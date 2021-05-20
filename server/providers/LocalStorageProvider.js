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

const ContractDAO = require('./dao/ContractDAO');
const UsageDAO = require('./dao/UsageDAO');
const SettlementDAO = require('./dao/SettlementDAO');


class LocalStorageProvider {
  /**
   *
   * @param {Object} matchingConditions
   * @return {Promise<[string]>}
   */
  static async getContracts(matchingConditions = {}) {
    try {
      return await ContractDAO.findAll(matchingConditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::getContracts] failed to get contracts - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} contract
   * @return {Promise<object>}
   */
  static async createContract(contract) {
    try {
      return await ContractDAO.create(contract);
    } catch (error) {
      logger.error('[LocalStorageProvider::createContract] failed to create contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} contract
   * @return {Promise<object>}
   */
  static async saveReceivedContract(contract) {
    try {
      return await ContractDAO.create(contract, 'RECEIVED');
    } catch (error) {
      logger.error('[LocalStorageProvider::saveReceivedContract] failed to save received contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} contract
   * @return {Promise<object>}
   */
  static async updateContract(contract) {
    try {
      return await ContractDAO.update(contract);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateContract] failed to update contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @param {Object} matchingConditions
   * @return {Promise<object>}
   */
  static async findContractByReferenceId(referenceId, matchingConditions = {}) {
    try {
      return await ContractDAO.findOneByReferenceId(referenceId, matchingConditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::findContractByReferenceId] failed to get contract from referenceId - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} id
   * @param {Object} matchingConditions
   * @return {Promise<object>}
   */
  static async getContract(id, matchingConditions = {}) {
    try {
      return await ContractDAO.findOne(id, matchingConditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::getContract] failed to get contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} conditions
   * @return {Promise<object>}
   */
  static async existsContract(conditions) {
    try {
      return await ContractDAO.exists(conditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::existsContract] failed to find if a contract exists - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} id
   * @return {Promise<object>}
   */
  static async deleteContract(id) {
    try {
      return await ContractDAO.findOneAndRemove(id);
    } catch (error) {
      logger.error('[LocalStorageProvider::deleteContract] failed to delete contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @param {String} rawData
   * @param {String} referenceId
   * @param {Array<String>} storageKeys
   * @param {JSON} blockchainRef
   * @return {Promise<object>}
   */
  static async updateSentContract(contractId, rawData, referenceId, storageKeys, blockchainRef) {
    try {
      return await ContractDAO.findOneAndUpdateToSentContract(contractId, rawData, referenceId, storageKeys, blockchainRef);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateSentContract] failed to update sent contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @param {Object} matchingConditions
   * @return {Promise<[string]>}
   */
  static async getUsages(contractId, matchingConditions = {}) {
    try {
      return await UsageDAO.findAll(contractId, matchingConditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::getUsages] failed to get usages - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @return {Promise<[string]>}
   */
  static async getLastReceivedUsage(contractId) {
    try {
      let receivedUsages = await LocalStorageProvider.getUsages(contractId, {state: 'RECEIVED'});
      receivedUsages = receivedUsages.filter((usage) => {
        if ((usage.tag) && (usage.tag === 'REJECTED') ) {
          return false;
        } else {
          return true;
        }
      });
      if (receivedUsages.length > 0 ) {
        const receivedUsage = receivedUsages.sort(function(a, b) {
          return new Date(b.lastModificationDate) - new Date(a.lastModificationDate);
        })[0];
        return receivedUsage;
      } else {
        return undefined;
      }
    } catch (error) {
      logger.error('[LocalStorageProvider::getUsages] failed to get usages - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @return {Promise<[string]>}
   */
  static async getLastSentUsage(contractId) {
    try {
      let sentUsages = await LocalStorageProvider.getUsages(contractId, {state: 'SENT'});
      sentUsages = sentUsages.filter((usage) => {
        if ((usage.tag) && (usage.tag === 'REJECTED') ) {
          return false;
        } else {
          return true;
        }
      });
      if (sentUsages.length > 0 ) {
        const sentUsage = sentUsages.sort(function(a, b) {
          return new Date(b.lastModificationDate) - new Date(a.lastModificationDate);
        })[0];
        return sentUsage;
      } else {
        return undefined;
      }
    } catch (error) {
      logger.error('[LocalStorageProvider::getUsages] failed to get usages - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} usage
   * @return {Promise<object>}
   */
  static async createUsage(usage) {
    try {
      return await UsageDAO.create(usage);
    } catch (error) {
      logger.error('[LocalStorageProvider::createUsage] failed to create usage - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} usage
   * @return {Promise<object>}
   */
  static async saveReceivedUsage(usage) {
    try {
      return await UsageDAO.create(usage, 'RECEIVED');
    } catch (error) {
      logger.error('[LocalStorageProvider::saveReceivedUsage] failed to save received usage - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} conditions
   * @return {Promise<object>}
   */
  static async existsUsage(conditions) {
    try {
      return await UsageDAO.exists(conditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::existsUsage] failed to find if an usage exists - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} usage
   * @return {Promise<object>}
   */
  static async updateUsage(usage) {
    try {
      return await UsageDAO.update(usage);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateUsage] failed to update usage - ', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @param {Object} matchingConditions
   * @return {Promise<object>}
   */
  static async findUsageByReferenceId(referenceId, matchingConditions = {}) {
    try {
      return await UsageDAO.findOneByReferenceId(referenceId, matchingConditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::findUsageByReferenceId] failed to get usage from referenceId - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} id
   * @param {Object} contractReferenceId
   * @return {Promise<object>}
   */
  static async updateUsageWithContractReferenceId(id, contractReferenceId) {
    try {
      return await UsageDAO.addContractReferenceId(id, contractReferenceId);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateUsageWithContractReferenceId] failed to updateUsageWithContractReferenceId - ', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} id
   * @param {Object} partnerUsageId
   * @return {Promise<object>}
   */
  static async updateUsageWithPartnerUsageId(id, partnerUsageId) {
    try {
      return await UsageDAO.addPartnerUsageId(id, partnerUsageId);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateUsageWithPartnerUsageId] failed to updateUsageWithPartnerUsageId - ', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} usageId
   * @param {String} rawData
   * @param {String} referenceId
   * @param {Array<String>} storageKeys
   * @param {JSON} blockchainRef
   * @param {JSON} lastReceivedUsage
   * @return {Promise<object>}
   */
  static async updateSentUsage(usageId, rawData, referenceId, storageKeys, blockchainRef, lastReceivedUsage) {
    try {
      return await UsageDAO.findOneAndUpdateToSentUsage(usageId, rawData, referenceId, storageKeys, blockchainRef, lastReceivedUsage);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateSentUsage] failed to update sent usage - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} usageId
   * @param {Object} tag
   * @return {Promise<object>}
   */
  static async updateUsageWithTag(usageId, tag) {
    try {
      return await UsageDAO.addTag(usageId, tag);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateUsageWithTag] failed to updateUsageWithTag - ', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} usageId
   * @param {Object} settlementId
   * @return {Promise<object>}
   */
  static async updateUsageWithSettlementId(usageId, settlementId) {
    try {
      return await UsageDAO.addSettlementId(usageId, settlementId);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateUsageWithSettlementId] failed to updateUsageWithSettlementId - ', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @param {String} usageId
   * @return {Promise<object>}
   */
  static async getUsage(contractId, usageId) {
    try {
      return await UsageDAO.findOne(usageId, {contractId: contractId});
    } catch (error) {
      logger.error('[LocalStorageProvider::getUsage] failed to get usage - ' + error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @param {String} usageId
   * @return {Promise<object>}
   */
  static async deleteUsage(contractId, usageId) {
    try {
      return await UsageDAO.findOneAndRemove(usageId, {contractId: contractId});
    } catch (error) {
      logger.error('[LocalStorageProvider::deleteUsage] failed to delete usage - ' + error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @return {Promise<[string]>}
   */
  static async getSettlements(contractId) {
    try {
      return await SettlementDAO.findAll(contractId);
    } catch (error) {
      logger.error('[LocalStorageProvider::getSettlements] failed to get settlements - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @param {String} settlementId
   * @return {Promise<object>}
   */
  static async getSettlement(contractId, settlementId) {
    try {
      return await SettlementDAO.findOne(settlementId, {contractId: contractId});
    } catch (error) {
      logger.error('[LocalStorageProvider::getSettlement] failed to get settlement - ' + error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} settlement
   * @return {Promise<object>}
   */
  static async createSettlement(settlement) {
    try {
      return await SettlementDAO.create(settlement);
    } catch (error) {
      logger.error('[LocalStorageProvider::createSettlement] failed to create settlement - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} settlement
   * @return {Promise<object>}
   */
  static async saveReceivedSettlement(settlement) {
    try {
      return await SettlementDAO.create(settlement, 'RECEIVED');
    } catch (error) {
      logger.error('[LocalStorageProvider::saveReceivedSettlement] failed to save received settlement - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} conditions
   * @return {Promise<object>}
   */
  static async existsSettlement(conditions) {
    try {
      return await SettlementDAO.exists(conditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::existsSettlement] failed to find if a settlement exists - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @param {Object} matchingConditions
   * @return {Promise<object>}
   */
  static async findSettlementByReferenceId(referenceId, matchingConditions = {}) {
    try {
      return await SettlementDAO.findOneByReferenceId(referenceId, matchingConditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::findSettlementByReferenceId] failed to get settlement from referenceId - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} settlementId
   * @param {String} rawData
   * @param {String} referenceId
   * @param {Array<String>} storageKeys
   * @param {JSON} blockchainRef
   * @return {Promise<object>}
   */
  static async updateSentSettlement(settlementId, rawData, referenceId, storageKeys, blockchainRef) {
    try {
      return await SettlementDAO.findOneAndUpdateToSentSettlement(settlementId, rawData, referenceId, storageKeys, blockchainRef);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateSentSettlement] failed to update sent settlement - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} settlementId
   * @param {String} tag
   * @return {Promise<object>}
   */
  static async updateSettlementWithTag(settlementId, tag) {
    try {
      return await SettlementDAO.addTag(settlementId, tag);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateSettlementWithTag] failed to update tag in settlement - %s', error.message);
      throw error;
    }
  }
}

module.exports = LocalStorageProvider;
