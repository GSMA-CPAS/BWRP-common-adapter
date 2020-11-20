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

}

module.exports = LocalStorageProvider;