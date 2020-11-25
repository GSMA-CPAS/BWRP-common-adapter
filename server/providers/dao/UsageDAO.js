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
          .then(objectReturned => {
            resolve(objectReturned);
          })
          .catch(errorReturned => {
            logger.error('[UsageDAO::findAll] [FAILED] errorReturned:' + typeof errorReturned + " = " + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  };

  static create(object) {
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
        {date: creationDate, action: "CREATION"}
      ]

      // Launch database request
      UsageMongoRequester.create(object, (err, usage) => {
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then(objectReturned => {
            resolve(objectReturned);
          })
          .catch(errorReturned => {
            logger.error('[UsageDAO::create] [FAILED] errorReturned:' + typeof errorReturned + " = " + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  };


}

module.exports = UsageDAO;