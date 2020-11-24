'use strict';

const config = require('../config');
const logger = require('../logger');

const ContractDAO = require('./dao/ContractDAO');


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
            logger.error('[LocalStorageProvider::updateContract] failed to update contract - %s', error.message);
            throw error;
        }
    }

}

module.exports = LocalStorageProvider;