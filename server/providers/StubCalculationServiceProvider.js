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

const logger = require('../logger');

const STUB_SETTLEMENTS = [
  {
    dealValue: 12,
    operators: ['BELMO', 'DEUD1'],
    intermediateResults: []
  }
];

class CalculationServiceProvider {
  constructor() {
    logger.info('[StubCalculationServiceProvider::constructor] You\'re running a Stub version of CalculationServiceProvider');
  }

  /**
   *
   * @param {String} usage
   * @param {String} contract
   * @return {Promise<[string]|Object>}
   */
  async getCalculateResult(usage, contract) {
    try {
      const response = STUB_SETTLEMENTS[0];
      return response;
    } catch (error) {
      logger.error('[StubCalculationServiceProvider::getCalculateResult] failed to calculate', error.message);
      throw error;
    }
  }
}

module.exports = CalculationServiceProvider;
