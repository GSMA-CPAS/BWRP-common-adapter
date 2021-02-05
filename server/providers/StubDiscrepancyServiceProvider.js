'use strict';

const logger = require('../logger');

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

class DiscrepancyServiceProvider {
  constructor() {
    logger.info('[StubDiscrepancyServiceProvider::constructor] You\'re running a Stub version of DiscrepancyServiceProvider');
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
      response.localUsage = usage;
      response.remoteUsage = settlement.body.usage;
      return response;
    } catch (error) {
      logger.error('[StubDiscrepancyServiceProvider::createDiscrepancy] failed to create discrepancy', error.message);
      throw error;
    }
  }
}

module.exports = DiscrepancyServiceProvider;
