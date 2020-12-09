'use strict';

const logger = require('../logger');

const ContractDAO = require('./dao/ContractDAO');
const UsageDAO = require('./dao/UsageDAO');
const SettlementDAO = require('./dao/SettlementDAO');


class LocalStorageProvider {
  /**
   *
   * @return {Promise<[string]>}
   */
  static async getContracts() {
    try {
      return await ContractDAO.findAll();
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
   * @param {String} documentId
   * @param {Object} matchingConditions
   * @return {Promise<object>}
   */
  static async findContractByDocumentId(documentId, matchingConditions = {}) {
    try {
      return await ContractDAO.findOneByDocumentId(documentId, matchingConditions);
    } catch (error) {
      logger.error('[LocalStorageProvider::findContractByDocumentId] failed to get contract from documentId - %s', error.message);
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
   * @param {String} documentId
   * @return {Promise<object>}
   */
  static async updateSentContract(contractId, rawData, documentId) {
    try {
      return await ContractDAO.findOneAndUpdateToSentContract(contractId, rawData, documentId);
    } catch (error) {
      logger.error('[LocalStorageProvider::updateSentContract] failed to update sent contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} contractId
   * @return {Promise<[string]>}
   */
  static async getUsages(contractId) {
    try {
      return await UsageDAO.findAll(contractId);
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
   * @param {String} id
   * @return {Promise<object>}
   */
  static async getUsage(id) {
    try {
      return await UsageDAO.findOne(id);
    } catch (error) {
      logger.error('[LocalStorageProvider::getUsage] failed to get usage - ' + error.message);
      throw error;
    }
  }


  /**
   *
   * @param {String} id
   * @return {Promise<object>}
   */
  static async deleteUsage(id) {
    try {
      return await UsageDAO.findOneAndRemove(id);
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
   * @param {String} id
   * @return {Promise<object>}
   */
  static async getSettlement(id) {
    try {
      return await SettlementDAO.findOne(id);
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
}

module.exports = LocalStorageProvider;
