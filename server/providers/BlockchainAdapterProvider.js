'use strict';

const axios = require('axios');
const config = require('../config');
const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

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

// eslint-disable-next-line no-unused-vars
const defineRawDataFromContract = (c) => {
  const rawDataObject = {};
  rawDataObject.type = c.type;
  rawDataObject.version = c.version;
  rawDataObject.name = c.name;
  rawDataObject.fromMsp = c.fromMsp ? c.fromMsp : {}; // to keep signatures if specified
  rawDataObject.toMsp = c.toMsp ? c.toMsp : {}; // to keep signatures if specified
  rawDataObject.body = c.body;
  const stringToEncode = JSON.stringify(rawDataObject);

  return Buffer.from(stringToEncode).toString('base64');
};

const defineRawDataObjectFromRawData = (d) => {
  const stringToParse = Buffer.from(d, 'base64').toString();
  return JSON.parse(stringToParse);
};

const defineContractFromRawDataObject = (rawDataObject, fromMSP, toMSP, id) => {
  const contract = rawDataObject;

  contract.fromMsp = contract.fromMsp ? contract.fromMsp : {};
  contract.fromMsp.mspId = fromMSP;
  contract.toMsp = contract.toMsp ? contract.toMsp : {};
  contract.toMsp.mspId = toMSP;
  contract.documentId = id;
  contract.state = 'RECEIVED';
  return contract;
};

const defineUsageFromRawDataObject = (rawDataObject, fromMSP, toMSP, id) => {
  const usage = rawDataObject;
  return usage;
};

const defineSettlementFromRawDataObject = (rawDataObject, fromMSP, toMSP, id) => {
  const settlement = rawDataObject;
  return settlement;
};

class BlockchainAdapterProvider {
  constructor() {
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
  async getPrivateDocumentIDs() {
    try {
      const response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents');
      logger.debug(`[BlockchainAdapterProvider::getPrivateDocumentIDs] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::getPrivateDocumentIDs]');
    }
  }

  /**
   *
   * @param {String} documentId
   * @return {Promise<string>}
   */
  async getPrivateDocument(documentId) {
    try {
      const response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents/' + documentId);
      logger.debug(`[BlockchainAdapterProvider::getPrivateDocument] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      const rawDataObject = defineRawDataObjectFromRawData(response.data.data);
      if (!rawDataObject.type) {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_DOCUMENT_TYPE_ERROR;
      } else if (rawDataObject.type === 'contract') {
        const contract = defineContractFromRawDataObject(rawDataObject, response.data.fromMSP, response.data.toMSP, response.data.id);
        return contract;
      } else if (rawDataObject.type === 'usage') {
        const usage = defineUsageFromRawDataObject(rawDataObject, response.data.fromMSP, response.data.toMSP, response.data.id);
        return usage;
      } else if (rawDataObject.type === 'settlement') {
        const settlement = defineSettlementFromRawDataObject(rawDataObject, response.data.fromMSP, response.data.toMSP, response.data.id);
        return settlement;
      } else {
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_DOCUMENT_TYPE_ERROR;
      }
    } catch (error) {
      if (documentId && error.response && error.response.data && (error.response.data.message === `Error: failed to query document. documentID '${documentId}' unknown status 404 - not found`)) {
        logger.error('[BlockchainAdapterProvider::getPrivateDocument] response not found : ', {status: error.response.status, data: error.response.data, headers: error.response.headers});
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::getPrivateDocument]');
      }
    }
  }

  /**
   *
   * @param {String} documentId
   * @return {Promise<string>}
   */
  async deletePrivateDocument(documentId) {
    try {
      const response = await axios.delete(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents/' + documentId);
      logger.debug(`[BlockchainAdapterProvider::deletePrivateDocument] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (documentId && error.response && error.response.data && (error.response.data.message === `DOCUMENT '${documentId}' not found.`)) {
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
      const rawData = defineRawDataFromContract(contract);
      const response = await axiosInstance.post(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents', {
        toMSP: contract.toMsp.mspId,
        data: rawData
      });
      logger.debug(`[BlockchainAdapterProvider::uploadContract] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return {
        rawData,
        documentId: response.data.documentID
      };
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::uploadContract] failed to upload contract - %s', error.message);
      throw error;
    }
  }


  /**
   *
   * @param {String} documentId
   * @param {String} msp
   * @return {Promise<string>}
   */
  async getSignatures(documentId, msp) {
    try {
      const response = await axiosInstance.get(config.BLOCKCHAIN_ADAPTER_URL + '/signatures/' + documentId + '/' + msp);
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
   * @param {String} documentId
   * @param {String} certificate
   * @param {String} algorithm
   * @param {String} signature
   * @return {Promise<string>}
   */
  async uploadSignature(documentId, certificate, algorithm, signature) {
    try {
      const response = await axiosInstance.put(config.BLOCKCHAIN_ADAPTER_URL + '/signatures/' + documentId, {
        json: {
          certificate: certificate,
          algorithm: algorithm,
          signature: signature,
        },
        responseType: 'json'
      });
      logger.debug(`[BlockchainAdapterProvider::uploadSignature] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (documentId && error.response && error.response.data && (error.response.data.message === `DOCUMENT '${documentId}' not found.`)) {
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
      logger.info('[BlockchainAdapterProvider::subscribe] env SELF_HOST not set. Not subscribing');
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_SELF_HOST_UNDEFINED_ERROR;
    }

    if (config.BLOCKCHAIN_ADAPTER_URL.length <= 0) {
      logger.info('[BlockchainAdapterProvider::subscribe] env BLOCKCHAIN_ADAPTER_URL not set. Not subscribing');
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_URL_UNDEFINED_ERROR;
    }

    if (!Array.isArray(config.BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS)) {
      logger.info('[BlockchainAdapterProvider::subscribe] env BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS not an array. Not subscribing');
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
}

module.exports = BlockchainAdapterProvider;
