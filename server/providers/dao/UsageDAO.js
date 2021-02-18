'use strict';

const logger = require('../../logger');
const errorUtils = require('../../utils/errorUtils');

const DAOErrorManager = require('./DAOErrorManager');
const UsageMongoRequester = require('./UsageMongoRequester');

const MISSING_MANDATORY_PARAM_ERROR = errorUtils.ERROR_DAO_MISSING_MANDATORY_PARAM;

class UsageDAO {
  static findAll(contractId) {
    return new Promise((resolve, reject) => {
      // Verify parameters

      // Define find condition
      const condition = {};
      if (contractId !== undefined) {
        condition.contractId = contractId;
      }

      // Launch database request
      UsageMongoRequester.findAll(condition, (err, usages) => {
        DAOErrorManager.handleErrorOrNullObject(err, usages)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::findAll] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static create(object, action = 'CREATION') {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[UsageDAO::create] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      object.id = UsageMongoRequester.defineUsageId();

      const creationDate = Date.now();
      object.creationDate = creationDate;
      object.lastModificationDate = creationDate;
      object.history = [
        {date: creationDate, action: action}
      ];

      // Launch database request
      UsageMongoRequester.create(object, (err, usage) => {
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::create] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static findOne(id, matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[UsageDAO::findOne] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define find condition
      const condition = {
        id: id,
        type: 'usage'
      };
      if (matchingConditions.state !== undefined) {
        condition.state = matchingConditions.state;
      }
      if (matchingConditions.contractId !== undefined) {
        condition.contractId = matchingConditions.contractId;
      }

      // Launch database request
      UsageMongoRequester.findOne(condition, (err, usage) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, usage)
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

  static findOneByReferenceId(referenceId, matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (referenceId === undefined) {
        logger.error('[UsageDAO::findOneByReferenceId] [FAILED] : referenceId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define find condition
      const condition = {
        referenceId: referenceId,
        type: 'usage'
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
      UsageMongoRequester.findOne(condition, (err, settlement) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, settlement)
          .then((objectReturned) => {
            logger.debug('[UsageDAO::findOneByReferenceId] [OK] objectReturned:' + typeof objectReturned + ' = ' + JSON.stringify(objectReturned));
            return resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::findOneByReferenceId] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            return reject(errorReturned);
          });
      });
    });
  }

  static update(object) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[UsageDAO::update] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (object.id === undefined) {
        logger.error('[UsageDAO::update] [FAILED] : object.id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (object.state === undefined) {
        logger.error('[UsageDAO::update] [FAILED] : object.state undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      object.lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: object.id,
        state: object.state
      };

      const updateCommand = {
        $set: {
          name: object.name,
          type: object.type,
          version: object.version,
          mspOwner: object.mspOwner,
          body: object.body,
          lastModificationDate: object.lastModificationDate
        },
        $push: {
          history: {date: object.lastModificationDate, action: 'UPDATE'}
        }
      };

      // Launch database request
      UsageMongoRequester.findOneAndUpdate(condition, updateCommand, (err, usage) => {
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::update] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static addContractReferenceId(id, contractReferenceId) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[UsageDAO::updateContractReferenceId] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (contractReferenceId === undefined) {
        logger.error('[UsageDAO::updateContractReferenceId] [FAILED] : contractReferenceId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      const lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: id,
        state: 'DRAFT',
        contractReferenceId: {
          $exists: false
        }
      };

      const updateCommand = {
        $set: {
          contractReferenceId: contractReferenceId
        },
        $push: {
          history: {date: lastModificationDate, action: 'UPDATE_CONTRACT_REFERENCE_ID'}
        }
      };

      // Launch database request
      UsageMongoRequester.findOneAndUpdate(condition, updateCommand, (err, usage) => {
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::updateContractReferenceId] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static findOneAndUpdateToSentUsage(usageId, rawData, referenceId, storageKeys, blockchainRef) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (usageId === undefined) {
        logger.error('[UsageDAO::findOneAndUpdateToSentUsage] [FAILED] : usageId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (rawData === undefined) {
        logger.error('[UsageDAO::findOneAndUpdateToSentUsage] [FAILED] : rawData undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (referenceId === undefined) {
        logger.error('[UsageDAO::findOneAndUpdateToSentUsage] [FAILED] : referenceId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (storageKeys === undefined) {
        logger.error('[UsageDAO::findOneAndUpdateToSentUsage] [FAILED] : storageKeys undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (blockchainRef === undefined) {
        logger.error('[UsageDAO::findOneAndUpdateToSentUsage] [FAILED] : blockchainRef undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      const lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: usageId,
        type: 'usage',
        state: 'DRAFT'
      };

      const updateCommand = {
        $set: {
          rawData: rawData,
          referenceId: referenceId,
          blockchainRef: blockchainRef,
          storageKeys: storageKeys,
          state: 'SENT',
          lastModificationDate: lastModificationDate
        },
        $push: {
          history: {date: lastModificationDate, action: 'SENT'}
        }
      };

      // Launch database request
      UsageMongoRequester.findOneAndUpdate(condition, updateCommand, (err, usage) => {
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::findOneAndUpdateToSentUsage] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static addSettlementId(usageId, settlementId) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (usageId === undefined) {
        logger.error('[UsageDAO::addSettlementId] [FAILED] : usageId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (settlementId === undefined) {
        logger.error('[UsageDAO::addSettlementId] [FAILED] : settlementId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      const lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: usageId,
        type: 'usage',
        state: ['SENT', 'RECEIVED']
      };

      const updateCommand = {
        $set: {
          settlementId: settlementId,
          lastModificationDate: lastModificationDate
        },
        $push: {
          history: {date: lastModificationDate, action: 'SAVE_SETTLEMENT_ID'}
        }
      };

      // Launch database request
      UsageMongoRequester.findOneAndUpdate(condition, updateCommand, (err, usage) => {
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::addSettlementId] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static findOneAndRemove(id, matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[UsageDAO::findOneAndRemove] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define find condition
      const condition = {
        id: id,
        type: 'usage'
      };
      if (matchingConditions.state !== undefined) {
        condition.state = matchingConditions.state;
      }
      if (matchingConditions.contractId !== undefined) {
        condition.contractId = matchingConditions.contractId;
      }

      // Launch database request
      UsageMongoRequester.findOneAndRemove(condition, (err, usage) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then((objectReturned) => {
            logger.debug('[DAO] [findOneAndRemove] [OK] objectReturned:' + typeof objectReturned + ' = ' + JSON.stringify(objectReturned));
            return resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[DAO] [findOneAndRemove] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            return reject(errorReturned);
          });
      });
    });
  }

  static exists(object) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[UsageDAO::exists] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Defined update condition and update command
      const condition = {
        type: 'usage'
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
      UsageMongoRequester.exists(condition, (err, exists) => {
        DAOErrorManager.handleError(err, exists)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[UsageDAO::exists] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }
}

module.exports = UsageDAO;
