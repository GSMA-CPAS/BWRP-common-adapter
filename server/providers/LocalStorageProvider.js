'use strict';

const config = require('../config');
const logger = require('../logger');

const ContractDAO = require('./dao/ContractDAO');
const UsageDAO = require('./dao/UsageDAO');


class LocalStorageProvider {

  /**
   *
   * @returns {Promise<[string]>}
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
   * @returns {Promise<object>}
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
   * @returns {Promise<object>}
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
   * @returns {Promise<object>}
   */
  static async getContract(id) {
    try {
      return await ContractDAO.findOne(id);
    } catch (error) {
      logger.error('[LocalStorageProvider::getContract] failed to get contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @returns {Promise<object>}
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
   * @returns {Promise<object>}
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
   * @returns {Promise<[string]>}
   */
  static async getUsages(contractID) {
    try {
      return await UsageDAO.findAll(contractID);
    } catch (error) {
      logger.error('[LocalStorageProvider::getUsages] failed to get usages - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @returns {Promise<object>}
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
   * @returns {Promise<object>}
   */
  static async getUsage(id) {
    try {
      return await UsageDAO.findOne(id);
    } catch (error) {
      logger.error('[LocalStorageProvider::getUsage] failed to get usage - ' + error.message);
      throw error;
    }
  }

}

module.exports = LocalStorageProvider;