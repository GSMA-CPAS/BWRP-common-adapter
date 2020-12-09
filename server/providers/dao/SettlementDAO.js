'use strict';

const logger = require('../../logger');
const errorUtils = require('../../utils/errorUtils');

const DAOErrorManager = require('./DAOErrorManager');
const SettlementMongoRequester = require('./SettlementMongoRequester');

const MISSING_MANDATORY_PARAM_ERROR = errorUtils.ERROR_DAO_MISSING_MANDATORY_PARAM;

class SettlementDAO {
  static findAll(contractId) {
    return new Promise((resolve, reject) => {
      // Verify parameters

      // Define find condition
      const condition = {};
      if (contractId !== undefined) {
        condition.contractId = contractId;
      }

      // Launch database request
      SettlementMongoRequester.findAll(condition, (err, settlements) => {
        DAOErrorManager.handleErrorOrNullObject(err, settlements)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[SettlementDAO::findAll] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }


  static create(object) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[SettlementDAO::create] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      object.id = SettlementMongoRequester.defineSettlementId();

      const creationDate = Date.now();
      object.creationDate = creationDate;
      object.lastModificationDate = creationDate;
      object.history = [
        {date: creationDate, action: 'CREATION'}
      ];

      // Launch database request
      SettlementMongoRequester.create(object, (err, settlement) => {
        DAOErrorManager.handleErrorOrNullObject(err, settlement)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[SettlementDAO::create] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }


  static findOne(id) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[SettlementDAO::findOne] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Launch database request
      SettlementMongoRequester.findOne({id}, (err, settlement) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, settlement)
          .then((objectReturned) => {
            logger.debug('[DAO] [findOne] [OK] objectReturned:' + typeof objectReturned + ' = ' + JSON.stringify(objectReturned));
            return resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[DAO] [findOne] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            return reject(errorReturned);
          });
      });
    });
  }
}

module.exports = SettlementDAO;
