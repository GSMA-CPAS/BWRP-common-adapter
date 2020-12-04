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
