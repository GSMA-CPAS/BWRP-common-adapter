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


  static create(object, action = 'CREATION') {
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
        {date: creationDate, action: action}
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


  static findOne(id, matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[SettlementDAO::findOne] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define find condition
      const condition = {
        id: id,
        type: 'settlement'
      };
      if (matchingConditions.state !== undefined) {
        condition.state = matchingConditions.state;
      }
      if (matchingConditions.contractId !== undefined) {
        condition.contractId = matchingConditions.contractId;
      }

      // Launch database request
      SettlementMongoRequester.findOne(condition, (err, settlement) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, settlement)
          .then((objectReturned) => {
            logger.debug('[SettlementDAO::findOne] [OK] objectReturned:' + typeof objectReturned + ' = ' + JSON.stringify(objectReturned));
            return resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[SettlementDAO::findOne] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            return reject(errorReturned);
          });
      });
    });
  }

  static findOneByReferenceId(referenceId, matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (referenceId === undefined) {
        logger.error('[SettlementDAO::findOneByReferenceId] [FAILED] : referenceId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define find condition
      const condition = {
        referenceId: referenceId,
        type: 'settlement'
      };
      if (matchingConditions.state !== undefined) {
        condition.state = matchingConditions.state;
      }
      if (matchingConditions.rawData !== undefined) {
        condition.rawData = matchingConditions.rawData;
      }
      if (matchingConditions.id !== undefined) {
        condition.id = matchingConditions.id;
      }
      if (matchingConditions.storageKey !== undefined) {
        // stoargeKeys is an array and we try to find a storageKey in this storageKeys
        condition.storageKeys = matchingConditions.storageKey;
      }

      // Launch database request
      SettlementMongoRequester.findOne(condition, (err, settlement) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, settlement)
          .then((objectReturned) => {
            logger.debug('[SettlementDAO::findOneByReferenceId] [OK] objectReturned:' + typeof objectReturned + ' = ' + JSON.stringify(objectReturned));
            return resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[SettlementDAO::findOneByReferenceId] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            return reject(errorReturned);
          });
      });
    });
  }

  static findOneAndUpdateToSentSettlement(settlementId, rawData, referenceId, storageKeys) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (settlementId === undefined) {
        logger.error('[SettlementDAO::findOneAndUpdateToSentSettlement] [FAILED] : contractId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (rawData === undefined) {
        logger.error('[SettlementDAO::findOneAndUpdateToSentSettlement] [FAILED] : rawData undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (referenceId === undefined) {
        logger.error('[SettlementDAO::findOneAndUpdateToSentSettlement] [FAILED] : referenceId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (storageKeys === undefined) {
        logger.error('[SettlementDAO::findOneAndUpdateToSentSettlement] [FAILED] : storageKeys undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      const lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: settlementId,
        type: 'settlement',
        state: 'DRAFT'
      };

      const updateCommand = {
        $set: {
          rawData: rawData,
          referenceId: referenceId,
          storageKeys: storageKeys,
          state: 'SENT',
          lastModificationDate: lastModificationDate
        },
        $push: {
          history: {date: lastModificationDate, action: 'SENT'}
        }
      };

      // Launch database request
      SettlementMongoRequester.findOneAndUpdate(condition, updateCommand, (err, settlement) => {
        DAOErrorManager.handleErrorOrNullObject(err, settlement)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[SettlementDAO::findOneAndUpdateToSentSettlement] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static exists(object) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[SettlementDAO::exists] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Defined update condition and update command
      const condition = {
        type: 'settlement'
      };

      if (object.id) {
        condition.id = object.id;
      }

      if (object.state) {
        condition.state = object.state;
      }

      if (object.referenceId) {
        condition.referenceId = object.referenceId;
      }

      if (object.rawData !== undefined) {
        condition.rawData = object.rawData;
      }

      // Launch database request
      SettlementMongoRequester.exists(condition, (err, exists) => {
        DAOErrorManager.handleError(err, exists)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[SettlementDAO::exists] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }
}

module.exports = SettlementDAO;
