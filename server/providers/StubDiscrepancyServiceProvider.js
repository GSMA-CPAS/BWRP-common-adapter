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
      response.localUsage = defineUsageToSendToDiscrepancyService(usage);
      response.remoteUsage = defineUsageToSendToDiscrepancyService(settlement.body.usage);
      return response;
    } catch (error) {
      logger.error('[StubDiscrepancyServiceProvider::createDiscrepancy] failed to create discrepancy', error.message);
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
      const response = STUB_DISCREPANCY[0];
      response.localUsage = defineUsageToSendToDiscrepancyService(settlement.body.usage);
      response.remoteUsage = defineUsageToSendToDiscrepancyService(settlementToCompare.body.usage);
      return response;
    } catch (error) {
      logger.error('[StubDiscrepancyServiceProvider::getSettlementDiscrepancy] failed to get discrepancy', error.message);
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
      const response = STUB_DISCREPANCY[0];
      response.localUsage = defineUsageToSendToDiscrepancyService(usage);
      response.remoteUsage = defineUsageToSendToDiscrepancyService(usageToCompare);
      return response;
    } catch (error) {
      logger.error('[StubDiscrepancyServiceProvider::getUsageDiscrepancy] failed to get discrepancy', error.message);
      throw error;
    }
  }
}

module.exports = DiscrepancyServiceProvider;
