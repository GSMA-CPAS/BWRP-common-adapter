'use strict';

const axios = require('axios');
const config = require('../config');
const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

const CALCULATION_SERVICE_AXIOS_CONFIG = {
  transformResponse: [(data) => {
    return getAsObject(data);
  }]
};

const axiosInstance = axios.create(CALCULATION_SERVICE_AXIOS_CONFIG);

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

const throwDefaultCommonInternalError = (error, loggerHeader = '[CalculationServiceProvider::throwDefaultCommonInternalError]') => {
  if (error.response) {
    logger.error(`${loggerHeader} response in error : `, {status: error.response.status, data: error.response.data, headers: error.response.headers});
    throw errorUtils.ERROR_CALCULATION_SERVICE_RESPONSE_UNEXPECTED_ERROR;
  } else if (error.request) {
    logger.error(`${loggerHeader} request in error: `, error.request);
    throw errorUtils.ERROR_CALCULATION_SERVICE_NO_RESPONSE;
  } else if (error === errorUtils.ERROR_CALCULATION_SERVICE_RESPONSE_PARSING_ERROR) {
    logger.error(`${loggerHeader} parse error: `, error);
    throw error;
  } else {
    logger.error(`${loggerHeader} error: `, error);
    throw errorUtils.ERROR_CALCULATION_SERVICE_REQUEST_ERROR;
  }
};

class CalculationServiceProvider {
  constructor() {
  }

  /**
   *
   * @param {Object} usage
   * @param {Object} contract
   * @param {String} directionName
   * @return {Promise<Object>}
   */
  async getUnidirectionalCalculateResult(usage, contract, directionName) {
    try {
      const sentDiscounts = ((contract === undefined) || (contract.body === undefined) || (typeof contract.body.discounts !== 'object')) ? {} : contract.body.discounts;
      const sentUsage = ((usage === undefined) || (usage.body === undefined) || (!Array.isArray(usage.body[directionName]))) ? [] : usage.body[directionName].map((usageElement) => {
        return {
          service: usageElement.service,
          usage: usageElement.usage,
          charges: usageElement.charges,
          homeTadig: usageElement.homeTadig,
          visitorTadig: usageElement.visitorTadig
        };
      });
      const response = await axiosInstance.post(config.CALCULATION_SERVICE_URL + '/calculate', {
        discounts: sentDiscounts,
        usage: sentUsage
      });
      logger.info(`[CalculationServiceProvider::getUnidirectionalCalculateResult] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      throwDefaultCommonInternalError(error, '[CalculationServiceProvider::getUnidirectionalCalculateResult]');
    }
  }

  /**
   *
   * @param {Object} usage
   * @param {Object} contract
   * @return {Promise<Object>}
   */
  async getCalculateResult(usage, contract) {
    try {
      const getUnidirectionalCalculateResults = await Promise.all([
        this.getUnidirectionalCalculateResult(usage, contract, 'inbound'),
        this.getUnidirectionalCalculateResult(usage, contract, 'outbound')
      ]);
      const returnedResponse = {
        inbound: getUnidirectionalCalculateResults[0],
        outbound: getUnidirectionalCalculateResults[1]
      };
      logger.info(`[CalculationServiceProvider::getCalculateResult] returnedResponse :${typeof returnedResponse} = ${JSON.stringify(returnedResponse)}`);
      return returnedResponse;
    } catch (error) {
      throwDefaultCommonInternalError(error, '[CalculationServiceProvider::getCalculateResult]');
    }
  }
}

module.exports = CalculationServiceProvider;