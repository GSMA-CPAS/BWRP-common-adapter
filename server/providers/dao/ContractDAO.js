'use strict';

const logger = require('../../logger');
const errorUtils = require('../../utils/errorUtils');

const DAOErrorManager = require('./DAOErrorManager');
const ContractMongoRequester = require('./ContractMongoRequester');

const MISSING_MANDATORY_PARAM_ERROR = errorUtils.ERROR_DAO_MISSING_MANDATORY_PARAM;

class ContractDAO {
  static findAll(state) {
    return new Promise((resolve, reject) => {
      // Verify parameters

      // Define find condition
      const condition = {};
      if (state !== undefined) {
        condition.state = state;
      }

      // Launch database request
      ContractMongoRequester.findAll(condition, (err, contracts) => {
        DAOErrorManager.handleErrorOrNullObject(err, contracts)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[ContractDAO::findAll] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static create(object, action = 'CREATION') {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[ContractDAO::create] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      object.id = ContractMongoRequester.defineContractId();

      const creationDate = Date.now();
      object.creationDate = creationDate;
      object.lastModificationDate = creationDate;
      object.history = [
        {date: creationDate, action: action}
      ];

      // Launch database request
      ContractMongoRequester.create(object, (err, contract) => {
        DAOErrorManager.handleErrorOrNullObject(err, contract)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[ContractDAO::create] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static update(object) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[ContractDAO::update] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (object.id === undefined) {
        logger.error('[ContractDAO::update] [FAILED] : object.id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (object.state === undefined) {
        logger.error('[ContractDAO::update] [FAILED] : object.state undefined');
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
          fromMsp: object.fromMsp,
          toMsp: object.toMsp,
          body: object.body,
          lastModificationDate: object.lastModificationDate
        },
        $push: {
          history: {date: object.lastModificationDate, action: 'UPDATE'}
        }
      };

      // Launch database request
      ContractMongoRequester.findOneAndUpdate(condition, updateCommand, (err, contract) => {
        DAOErrorManager.handleErrorOrNullObject(err, contract)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[ContractDAO::update] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static findOne(id) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[ContractDAO::findOne] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Launch database request
      ContractMongoRequester.findOne({id}, (err, contract) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, contract)
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

  static findOneAndRemove(id) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[ContractDAO::findOneAndRemove] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Launch database request
      ContractMongoRequester.findOneAndRemove({id}, (err, contract) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, contract)
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

  static findOneAndUpdateToSentContract(contractId, rawData, documentId) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (contractId === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] : contractId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (rawData === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] : rawData undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (documentId === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] : documentId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      const lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: contractId,
        state: 'DRAFT'
      };

      const updateCommand = {
        $set: {
          rawData: rawData,
          documentId: documentId,
          state: 'SENT',
          lastModificationDate: lastModificationDate
        },
        $push: {
          history: {date: lastModificationDate, action: 'SENT'}
        }
      };

      // Launch database request
      ContractMongoRequester.findOneAndUpdate(condition, updateCommand, (err, contract) => {
        DAOErrorManager.handleErrorOrNullObject(err, contract)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }
}

module.exports = ContractDAO;
