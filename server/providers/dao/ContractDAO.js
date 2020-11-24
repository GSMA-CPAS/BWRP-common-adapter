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

}

module.exports = ContractDAO;