'use strict';

const axios = require('axios');
const config = require('../config');
const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

const DISCREPANCY_SERVICE_AXIOS_CONFIG = {
  transformResponse: [(data) => {
    return getAsObject(data);
  }]
};

const axiosInstance = axios.create(DISCREPANCY_SERVICE_AXIOS_CONFIG);

const getAsObject = (value) => {
  let returnedObject = undefined;
  if ((typeof value === 'object') || (value === undefined)) {
    returnedObject = value;
  } else {
    try {
      returnedObject = JSON.parse(value);
    } catch (e) {
      throw errorUtils.ERROR_CALCULATION_SERVICE_RESPONSE_PARSING_ERROR;
    }
  }
  return returnedObject;
};

const throwDefaultCommonInternalError = (error, loggerHeader = '[DiscrepancyServiceProvider::throwDefaultCommonInternalError]') => {
  if (error.response) {
    logger.error(`${loggerHeader} response in error : `, {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
    throw errorUtils.ERROR_DISCREPANCY_SERVICE_RESPONSE_UNEXPECTED_ERROR;
  } else if (error.request) {
    logger.error(`${loggerHeader} request in error: `, error.request);
    throw errorUtils.ERROR_DISCREPANCY_SERVICE_NO_RESPONSE;
  } else if (error === errorUtils.ERROR_DISCREPANCY_SERVICE_RESPONSE_PARSING_ERROR) {
    logger.error(`${loggerHeader} parse error: `, error);
    throw error;
  } else {
    logger.error(`${loggerHeader} error: `, error);
    throw errorUtils.ERROR_DISCREPANCY_SERVICE_REQUEST_ERROR;
  }
};
const STUB_DISCREPANCY = [
  {
    generatedDiscrepancy: {
      data1: 'a',
      data2: 'b',
      object1: {
        object1data10: 'z'
      }
    },
    otherData: ['8', 'test']
  }
];

const defineUsageToSendToDiscrepancyService = (usage) => {
  // to remove rawData, history, __v, ...
  return {
    storageKeys: usage.storageKeys,
    state: usage.state,
    contractId: usage.contractId,
    name: usage.name,
    type: usage.type,
    version: usage.version,
    mspOwner: usage.mspOwner,
    mspReceiver: usage.mspReceiver,
    body: usage.body,
    id: usage.id,
    creationDate: usage.creationDate,
    lastModificationDate: usage.lastModificationDate,
    contractReferenceId: usage.contractReferenceId,
    blockchainRef: usage.blockchainRef,
    referenceId: usage.referenceId,
    settlementId: usage.settlementId,
  };
};


const defineSentUsage = (usage, context) => {
  const returnedResponse = {
    header: {
      version: usage.version,
      type: usage.type,
      mspOwner: usage.mspOwner,
      context: context
    },
    body: usage.body
  };
  return returnedResponse;
}

const defineSentSettlement = (settlement, context) => {
  const returnedResponse = {
    header: {
      version: settlement.version,
      type: settlement.type,
      mspOwner: settlement.mspOwner,
      context: context
    },
    body: settlement.body
  };
  return returnedResponse;
}


class DiscrepancyServiceProvider {
  constructor() {
  }

  /**
   *
   * @param {Object} usage
   * @param {Object} settlement
   * @return {Promise<Object>}
   */
  async createDiscrepancy(usage, settlement) {
    try {
      const response = STUB_DISCREPANCY[0];
      response.localUsage = defineUsageToSendToDiscrepancyService(usage);
      response.remoteUsage = defineUsageToSendToDiscrepancyService(settlement.body.usage);
      return response;
    } catch (error) {
      logger.error('[DiscrepancyServiceProvider::createDiscrepancy] failed to create discrepancy', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} settlement
   * @param {Object} settlementToCompare
   * @return {Promise<Object>}
   */
  async getSettlementDiscrepancy(settlement, settlementToCompare) {
    try {
      const queryString = '?partnerSettlementId=' + settlementToCompare.id;
      const sentBody = [defineSentSettlement(settlement, 'home'), defineSentSettlement(settlementToCompare, 'partner')];
      const response = await axiosInstance.put(config.DISCREPANCY_SERVICE_URL + '/settlements/' + settlement.id + queryString, sentBody);
      logger.info(`[DiscrepancyServiceProvider::getSettlementDiscrepancy] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      logger.error('[DiscrepancyServiceProvider::getSettlementDiscrepancy] failed to get settlement discrepancy', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} usage
   * @param {Object} usageToCompare
   * @return {Promise<Object>}
   */
  async getUsageDiscrepancy(usage, usageToCompare) {
    try {
      const queryString = '?partnerUsageId=' + usageToCompare.id;
      const sentBody = [defineSentUsage(usage, 'home'), defineSentUsage(usageToCompare, 'partner')];
      const response = await axiosInstance.put(config.DISCREPANCY_SERVICE_URL + '/usages/' + usage.id + queryString, sentBody);
      logger.info(`[DiscrepancyServiceProvider::getUsageDiscrepancy] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      logger.error('[DiscrepancyServiceProvider::getUsageDiscrepancy] failed to get usage discrepancy', error.message);
      throw error;
    }
  }
}

/* eslint-enable camelcase */

module.exports = DiscrepancyServiceProvider;
