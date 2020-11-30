'use strict';

const axios = require('axios');
const config = require('../config');
const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

const BLOCKCHAIN_ADAPTER_AXIOS_CONFIG = {
  transformResponse: [(data) => {return getAsObject(data);}]
};

const axiosInstance = axios.create(BLOCKCHAIN_ADAPTER_AXIOS_CONFIG);

const getAsObject = (value) => {
  let returnedObject = undefined;
  if ((typeof value === 'object') || (value === undefined)) {
    returnedObject = value;
  } else {
    try {
      returnedObject = JSON.parse(value);
    } catch(e) {
      throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_PARSING_ERROR;
    }
  }
  return returnedObject;
}

const throwDefaultCommonInternalError = (error, loggerHeader = "[BlockchainAdapterProvider::throwDefaultCommonInternalError]") => {
  if (error.response) {
    logger.error(`${loggerHeader} response in error : `, { status: error.response.status, data: error.response.data, headers: error.response.headers});
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
}

class BlockchainAdapterProvider {

  constructor() {
  }

  /**
   *
   * @param msp
   * @returns {Promise<string>}
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
        logger.error('[BlockchainAdapterProvider::discovery] response not found : ', { status: error.response.status, data: error.response.data, headers: error.response.headers});
        throw errorUtils.ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR;
      } else {
        throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::discovery]');
      }
    }
  }

  /**
   *
   * @returns {Promise<string>}
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
   * @param documentId
   * @returns {Promise<string>}
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
   * @param documentId
   * @returns {Promise<string>}
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
   * @param toMSP
   * @param dataBase64
   * @returns {Promise<string>}
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
   * @param documentId
   * @param msp
   * @returns {Promise<string>}
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
   * @param documentId
   * @param certificate
   * @param algorithm
   * @param signature
   * @returns {Promise<string>}
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
   * @param callbackUrl
   * @param eventName
   * @returns {Promise<string>}
   */
  async webhookSubscribe(eventName, callbackUrl) {
    try {
      const response = await axiosInstance.post(config.BLOCKCHAIN_ADAPTER_URL + '/webhooks/subscribe', {
        json: {
          "eventName": eventName,
          "callbackUrl": callbackUrl
        },
        responseType: 'text'
      });
      logger.debug(`[BlockchainAdapterProvider::webhookSubscribe] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      throwDefaultCommonInternalError(error, '[BlockchainAdapterProvider::webhookSubscribe]');
    }
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      const webhooks = config.BLOCKCHAIN_ADAPTER_WEBHOOKS;
      for (const webhook of webhooks) {
        await this.webhookSubscribe(webhook.eventName, webhook.callbackUrl);
        logger.info('[BlockchainAdapterProvider::initialize] webhook subscribe: %s -> %s', webhook.eventName, webhook.callbackUrl);
      }
    } catch (error) {
      logger.error('[BlockchainAdapterProvider::initialize] failed to initialize adapter - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async subscribe() {
    if (config.SELF_HOST.length <= 0){
      logger.info('[BlockchainAdapterProvider::subscribe] env SELF_HOST not set. Not subscribing');
      return;
    }

    if (config.BLOCKCHAIN_ADAPTER_URL.length <= 0){
      logger.info('[BlockchainAdapterProvider::subscribe] env BLOCKCHAIN_ADAPTER_URL not set. Not subscribing');
      return;
    }

    const callback_url = config.SELF_HOST  + "/api/v1/contracts/event/";
    const webhooks = [
      {
        "eventName": "STORE:DOCUMENTHASH",
        "callbackUrl": callback_url
      },
      {
        "eventName": "STORE:SIGNATURE",
        "callbackUrl": callback_url
      }
    ];

    try {
      for (const webhook of webhooks) {
        await axios.post(config.BLOCKCHAIN_ADAPTER_URL + '/webhooks/subscribe', webhook);
        logger.info('[BlockchainAdapterProvider::subscribe] webhook subscribe: %s -> %s', webhook.eventName, webhook.callbackUrl);
      }
    } catch (error) {
      console.log(error);
      logger.error('[BlockchainAdapterProvider::subscribe] failed to subscribe to blockchain-adapter - %s', error.message);
      throw error;
    }
  }

}

module.exports = BlockchainAdapterProvider;