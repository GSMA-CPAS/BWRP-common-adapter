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
   * @return {Promise<Object>}
   */
  async getCalculateResult(usage, contract) {
    try {
      const sentDiscounts = ((contract === undefined) || (contract.body === undefined) || (typeof contract.body.discounts !== 'object')) ? {} : contract.body.discounts;
      const sentInboundUsage = ((usage === undefined) || (usage.body === undefined) || (!Array.isArray(usage.body.inbound))) ? [] : usage.body.inbound.map((usageElement) => {
        return {
          service: usageElement.service,
          usage: usageElement.usage,
          charges: usageElement.charges,
          homeTadig: usageElement.homeTadig,
          visitorTadig: usageElement.visitorTadig
        };
      });
      const sentOutboundUsage = ((usage === undefined) || (usage.body === undefined) || (!Array.isArray(usage.body.outbound))) ? [] : usage.body.outbound.map((usageElement) => {
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
        usage: {
          inbound: sentInboundUsage,
          outbound: sentOutboundUsage
        }
      });
      logger.info(`[CalculationServiceProvider::getCalculateResult] response data:${typeof response.data} = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      throwDefaultCommonInternalError(error, '[CalculationServiceProvider::getCalculateResult]');
    }
  }
}

module.exports = CalculationServiceProvider;
