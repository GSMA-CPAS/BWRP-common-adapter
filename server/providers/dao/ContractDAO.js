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
          .then(objectReturned => {
            resolve(objectReturned);
          })
          .catch(errorReturned => {
            logger.error('[ContractDAO::findAll] [FAILED] errorReturned:'+typeof errorReturned+" = "+JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  };

  static create(object) {
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
        { date: creationDate, action: "CREATION" }
      ]

      // Launch database request
      ContractMongoRequester.create(object, (err, contract) => {
        DAOErrorManager.handleErrorOrNullObject(err, contract)
          .then(objectReturned => {
            resolve(objectReturned);
          })
          .catch(errorReturned => {
            logger.error('[ContractDAO::create] [FAILED] errorReturned:'+typeof errorReturned+" = "+JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  };

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
          rawData: object.rawData,
          lastModificationDate: object.lastModificationDate
        },
        $push: {
          history: { date: object.lastModificationDate, action: "UPDATE" }
        }
      };      

      // Launch database request
      ContractMongoRequester.findOneAndUpdate(condition, updateCommand, (err, contract) => {
        DAOErrorManager.handleErrorOrNullObject(err, contract)
          .then(objectReturned => {
            resolve(objectReturned);
          })
          .catch(errorReturned => {
            logger.error('[ContractDAO::update] [FAILED] errorReturned:'+typeof errorReturned+" = "+JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  };

}

module.exports = ContractDAO;