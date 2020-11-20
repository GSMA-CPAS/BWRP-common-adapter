'use strict';

const logger = require('../../logger');

const DAOErrorManager = require('./DAOErrorManager');
const ContractMongoRequester = require('./ContractMongoRequester');

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

}

module.exports = ContractDAO;