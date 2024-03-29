// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

'use strict';

const axios = require('axios');
const config = require('../config');
const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');
const rawDataUtils = require('./utils/rawDataUtils');

const crypto = require('crypto');

const BLOCKCHAIN_ADAPTER_AXIOS_CONFIG = {
  transformResponse: [(data) => {
    return getAsObject(data);
  }]
};

const axiosInstance = axios.create(BLOCKCHAIN_ADAPTER_AXIOS_CONFIG);

const getAsObject = (value) => {
  let returnedObject = undefined;
  if ((typeof value === 'object') || (value === undefined)) {
    returnedObject = value;
  } else {
    try {
      returnedObject = JSON.parse(value);
    } catch (e) {
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_PARSING_ERROR;
    }
  }
  return returnedObject;
};

const throwDefaultCommonInternalError = (error, loggerHeader = '[BlockchainAdapterProvider::throwDefaultCommonInternalError]') => {
  if (error.response) {
    logger.error(`${loggerHeader} response in error : `, {status: error.response.status, data: error.response.data, headers: error.response.headers});
    throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_UNEXPECTED_ERROR;
  } else if (error.request) {
    logger.error(`${loggerHeader} request in error: `, error.request);
    throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_NO_RESPONSE;
  } else if (error === errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_PARSING_ERROR) {
    logger.error(`${loggerHeader} parse error: `, error);
    throw error;
  } else {
    logger.error(`${loggerHeader} error: `, error);
    throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_REQUEST_ERROR;
  }
};

class BlockchainAdapterProvider {
  constructor() {
  }

  /**
   *
   * @param {String} mspId
   * @return {Promise<boolean>}
   */
  async isMyMspId(mspId) {
    if ((config.SELF_MSPID === undefined) || (typeof config.SELF_MSPID !== 'string') || (config.SELF_MSPID.length <= 0)) {
      logger.warn('[BlockchainAdapterProvider::isMyMspId] config.SELF_MSPID not defined : ', config.SELF_MSPID);
      throw errorUtils.ERROR_INVALID_DEFINED_SELF_MSPID_ERROR;
    } else if ((mspId === undefined) || (typeof mspId !== 'string') || (mspId.length <= 0)) {
      logger.warn('[BlockchainAdapterProvider::isMyMspId] invalid tested mspId : ', mspId);
      throw errorUtils.ERROR_INVALID_TESTED_MSPID_ERROR;
    } else {
      return (config.SELF_MSPID.toLowerCase() === mspId.toLowerCase());
    }
  }

  /**
   *
   * @param {String} msp
   * @return {Promise<[string]|object>}
   */
  async discovery(msp) {
    try {
      let response;
      if (msp) {
        response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/discovery/msps/' + msp);
      } else {
        response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/discovery/msps');
      }
      logger.debug(`[BlockchainAdapterProvider::discovery] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (msp && error.response && error.response.data && (error.response.data.message === `MSP '${msp}' not found.`)) {
        logger.error('[BlockchainAdapterProvider::discovery] response not found : ', {status: error.response.status, data: error.response.data, headers: error.response.headers});
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::discovery]');
      }
    }
  }

  /**
   *
   * @return {Promise<string>}
   */
  async getPrivateReferenceIDs() {
    try {
      const response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents');
      logger.debug(`[BlockchainAdapterProvider::getPrivateReferenceIDs] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::getPrivateReferenceIDs]');
    }
  }

  /**
   *
   * @param {String} referenceId
   * @return {Promise<string>}
   */
  async getPrivateDocument(referenceId) {
    try {
      const response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents/' + referenceId);
      logger.debug(`[BlockchainAdapterProvider::getPrivateDocument] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      const rawDataObject = rawDataUtils.defineRawDataObjectFromRawData(response.data.payload);
      // append blockchainRef to "item"
      const blockchainRef = {
        type: 'hlf', // need a dynamic way to define type to support future multiledger system
        txId: response.data.blockchainRef.txID,
        timestamp: response.data.blockchainRef.timestamp
      };
      if (!rawDataObject.header || !rawDataObject.header.type) {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_DOCUMENT_TYPE_ERROR;
      } else if (rawDataObject.header.type === 'contract') {
        const contract = rawDataUtils.defineContractFromRawDataObject(rawDataObject, response.data.fromMSP, response.data.toMSP, response.data.referenceID, response.data.blockchainRef.timeStamp);
        contract.blockchainRef = blockchainRef;
        return contract;
      } else if (rawDataObject.header.type === 'usage') {
        const usage = rawDataUtils.defineUsageFromRawDataObject(rawDataObject, response.data.fromMSP, response.data.toMSP, response.data.referenceID, response.data.blockchainRef.timeStamp);
        usage.blockchainRef = blockchainRef;
        return usage;
      } else if (rawDataObject.header.type === 'settlement') {
        const settlement = rawDataUtils.defineSettlementFromRawDataObject(rawDataObject, response.data.fromMSP, response.data.toMSP, response.data.referenceID, response.data.blockchainRef.timeStamp);
        settlement.blockchainRef = blockchainRef;
        return settlement;
      } else {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_DOCUMENT_TYPE_ERROR;
      }
    } catch (error) {
      if (referenceId && error.response && error.response.data && (error.response.data.message === `Error: failed to query document. referenceId '${referenceId}' unknown status 404 - not found`)) {
        logger.error('[BlockchainAdapterProvider::getPrivateDocument] response not found : ', {status: error.response.status, data: error.response.data, headers: error.response.headers});
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::getPrivateDocument]');
      }
    }
  }

  /**
   *
   * @param {String} referenceId
   * @return {Promise<string>}
   */
  async deletePrivateDocument(referenceId) {
    try {
      const response = await axios.delete(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents/' + referenceId);
      logger.debug(`[BlockchainAdapterProvider::deletePrivateDocument] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (referenceId && error.response && error.response.data && (error.response.data.message === `DOCUMENT '${referenceId}' not found.`)) {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::deletePrivateDocument]');
      }
    }
  }

  /**
   *
   * @param {String} toMSP
   * @param {String} dataBase64
   * @return {Promise<string>}
   */
  async uploadPrivateDocument(toMSP, dataBase64) {
    try {
      const response = await axiosInstance.post(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents', {
        json: {
          toMSP: toMSP,
          data: dataBase64
        },
        responseType: 'json'
      });
      logger.debug(`[BlockchainAdapterProvider::uploadPrivateDocument] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (toMSP && error.response && error.response.data && (error.response.data.message === `MSP '${toMSP}' not found.`)) {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::uploadPrivateDocument]');
      }
    }
  }

  /**
   *
   * @param {Object} contract
   * @return {Promise<object>}
   */
  async uploadContract(contract) {
    try {
      const rawData = rawDataUtils.defineRawDataFromContract(contract);
      const response = await axiosInstance.post(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents', {
        toMSP: contract.toMsp.mspId,
        payload: rawData
      });
      logger.debug(`[BlockchainAdapterProvider::uploadContract] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return {
        rawData,
        referenceId: response.data.referenceID,
        blockchainRef: {
          type: 'hlf', // need a dynamic way to define type to support future multiledger system
          txId: response.data.blockchainRef.txID,
          timestamp: response.data.blockchainRef.timestamp
        }
      };
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::uploadContract] failed to upload contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {string} referenceId
   * @param {Array<string>} mspIds
   * @return {Promise<Array<string>>}
   */
  async getStorageKeys(referenceId, mspIds) {
    try {
      const returnedContractStorageKeys = [];
      if ((mspIds !== undefined) && (Array.isArray(mspIds))) {
        mspIds.forEach((mspId) => {
          returnedContractStorageKeys.push(crypto
            .createHash('sha256')
            .update(mspId + ':' + referenceId)
            .digest('hex')
            .toString('utf8'));
        });
      }
      return returnedContractStorageKeys;
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::getStorageKeys] failed to get storage keys - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @param {String} msp
   * @return {Promise<string>}
   */
  async getSignatures(referenceId, msp) {
    try {
      const response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/signatures/' + referenceId + '/' + msp);
      logger.debug(`[BlockchainAdapterProvider::getSignatures] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (msp && error.response && error.response.data && (error.response.data.message === `MSP '${msp}' not found.`)) {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::getSignatures]');
      }
    }
  }

  /**
   *
   * @param {String} referenceId
   * @param {String} certificate
   * @param {String} algorithm
   * @param {String} signature
   * @return {Promise<string>}
   */
  async uploadSignature(referenceId, certificate, algorithm, signature) {
    try {
      const response = await axiosInstance.put(config.BLOCKCHAIN_ADAPTER_URL + '/signatures/' + referenceId, {
        certificate: certificate,
        algorithm: algorithm,
        signature: signature
      });
      logger.debug(`[BlockchainAdapterProvider::uploadSignature] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (referenceId && error.response && error.response.data && (error.response.data.message === `DOCUMENT '${referenceId}' not found.`)) {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::uploadSignature]');
      }
    }
  }

  /**
   *
   * @param {String} eventName
   * @param {String} callbackUrl
   * @return {Promise<string>}
   */
  async webhookSubscribe(eventName, callbackUrl) {
    try {
      const response = await axios.post(config.BLOCKCHAIN_ADAPTER_URL + '/webhooks/subscribe', {
        'eventName': eventName,
        'callbackUrl': callbackUrl
      });
      logger.debug(`[BlockchainAdapterProvider::webhookSubscribe] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::webhookSubscribe]');
    }
  }

  /**
   *
   * @return {Promise<[string]>}
   */
  async subscribe() {
    if (config.SELF_HOST.length <= 0) {
      logger.info('[BlockchainAdapterProvider::subscribe] env COMMON_ADAPTER_SELF_HOST not set. Not subscribing');
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_SELF_HOST_UNDEFINED_ERROR;
    }

    if (config.BLOCKCHAIN_ADAPTER_URL.length <= 0) {
      logger.info('[BlockchainAdapterProvider::subscribe] env BLOCKCHAIN_ADAPTER_URL not set. Not subscribing');
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_URL_UNDEFINED_ERROR;
    }

    if (!Array.isArray(config.BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS)) {
      logger.info('[BlockchainAdapterProvider::subscribe] env COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS not an array. Not subscribing');
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS_INVALID_ERROR;
    }

    const callbackUrl = config.SELF_HOST + '/api/v1/contracts/event/';
    try {
      const webhookIds = [];
      const webhookEvents = config.BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS;
      for (const webhookEvent of webhookEvents) {
        const webhookSubscribeResponse = await this.webhookSubscribe(webhookEvent, callbackUrl);
        logger.info('[BlockchainAdapterProvider::subscribe] webhook subscribe: %s -> %s', webhookEvent, callbackUrl);
        const webhookId = webhookSubscribeResponse;
        webhookIds.push(webhookId);
      }
      return webhookIds;
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::subscribe] failed to subscribe to events - %s', JSON.stringify(error));
      throw error;
    }
  }


  /**
   *
   * @return {Promise<string>}
   */
  async getSelfMspId() {
    if (config.BLOCKCHAIN_ADAPTER_URL.length <= 0) {
      logger.info('[BlockchainAdapterProvider::getSelfMspId] env BLOCKCHAIN_ADAPTER_URL not set. Not possible to define self MSP Id');
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_URL_UNDEFINED_ERROR;
    }

    try {
      const response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/status');
      logger.debug(`[BlockchainAdapterProvider::getSelfMspId] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data.hyperledger.localMSP;
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::getSelfMspId] failed to get self MSP Id - %s', JSON.stringify(error));
      throw error;
    }
  }

  /**
   *
   * @param {Object} usage
   * @return {Promise<object>}
   */
  async uploadUsage(usage) {
    try {
      const rawData = rawDataUtils.defineRawDataFromUsage(usage);
      const response = await axiosInstance.post(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents', {
        toMSP: usage.mspReceiver,
        payload: rawData
      });
      logger.debug(`[BlockchainAdapterProvider::uploadUsage] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return {
        rawData,
        referenceId: response.data.referenceID,
        blockchainRef: {
          type: 'hlf', // need a dynamic way to define type to support future multiledger system
          txId: response.data.blockchainRef.txID,
          timestamp: response.data.blockchainRef.timestamp
        }
      };
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::uploadUsage] failed to upload usage - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} settlement
   * @return {Promise<object>}
   */
  async uploadSettlement(settlement) {
    try {
      const rawData = rawDataUtils.defineRawDataFromSettlement(settlement);
      const response = await axiosInstance.post(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents', {
        toMSP: settlement.mspReceiver,
        payload: rawData
      });
      logger.debug(`[BlockchainAdapterProvider::uploadSettlement] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return {
        rawData,
        referenceId: response.data.referenceID,
        blockchainRef: {
          type: 'hlf', // need a dynamic way to define type to support future multiledger system
          txId: response.data.blockchainRef.txID,
          timestamp: response.data.blockchainRef.timestamp
        }
      };
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::uploadSettlement] failed to upload settlement - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} certificate
   * @return {Promise<string>}
   */
  async setCertificateRoot(certificate) {
    try {
      logger.debug(`[BlockchainAdapterProvider::setCertificateRoot] request data:${typeof certificate} = ${certificate}`);
      const LocalaxiosInstance = axios.create({responseType: 'text'});
      const response = await LocalaxiosInstance.put(config.BLOCKCHAIN_ADAPTER_URL + '/certificate/root/', certificate);
      logger.debug(`[BlockchainAdapterProvider::setCertificateRoot] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::setCertificateRoot] failed to set root cert - %s', error.response.data);
      throw error;
    }
  }

  /**
   *
   * @param {Object} payload
   * @return {Promise<string>}
   */
  async submitCertificateRevocationList(payload) {
    try {
      logger.debug(`[BlockchainAdapterProvider::submitCertificateRevocationList] request data:${typeof payload} = ${JSON.stringify(payload)}`);
      const response = await axiosInstance.post(config.BLOCKCHAIN_ADAPTER_URL + '/certificate/revoke', payload);
      logger.debug(`[BlockchainAdapterProvider::submitCertificateRevocationList] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::submitCertificateRevocationList] failed to set CRL - %s', JSON.stringify(error.response.data));
      throw error;
    }
  }
}

module.exports = BlockchainAdapterProvider;
