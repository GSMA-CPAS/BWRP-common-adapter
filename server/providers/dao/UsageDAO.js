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

  static findOne(id) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[UsageDAO::findOne] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Launch database request
      UsageMongoRequester.findOne({id}, (err, usage) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then(objectReturned => {
            logger.debug('[DAO] [findOne] [OK] objectReturned:' + typeof objectReturned + " = " + JSON.stringify(objectReturned));
            return resolve(objectReturned);
          })
          .catch(errorReturned => {
            logger.error('[DAO] [findOne] [FAILED] errorReturned:' + typeof errorReturned + " = " + JSON.stringify(errorReturned));
            return reject(errorReturned);
          });
      });
    });
  };

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
          history: {date: object.lastModificationDate, action: "UPDATE"}
        }
      };

      // Launch database request
      UsageMongoRequester.findOneAndUpdate(condition, updateCommand, (err, usage) => {
        DAOErrorManager.handleErrorOrNullObject(err, usage)
          .then(objectReturned => {
            resolve(objectReturned);
          })
          .catch(errorReturned => {
            logger.error('[UsageDAO::update] [FAILED] errorReturned:' + typeof errorReturned + " = " + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  };

}

module.exports = UsageDAO;