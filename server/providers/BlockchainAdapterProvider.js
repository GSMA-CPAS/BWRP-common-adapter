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
      return response.data;
    } catch (error) {
      if (documentId && error.response && error.response.data && (error.response.data.message === `DOCUMENT '${documentId}' not found.`)) {
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
      const response = await axiosInstance.delete(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents/' + documentId);
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
