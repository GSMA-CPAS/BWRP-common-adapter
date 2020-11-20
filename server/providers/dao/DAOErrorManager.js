'use strict';

const logger = require('../../logger');

const errorUtils = require('../../utils/errorUtils');

class DAOErrorManager {

  static handleErrorOrNullObject = function(err, object) {
    return new Promise((resolve, reject) => {
      DAOErrorManager.handleError(err, object)
        .then(objectReturned => {
          if (!objectReturned) {
            logger.error('[DAO] [handleErrorOrNullObject] returned object is null');
            reject(errorUtils.ERROR_DAO_NOT_FOUND);
          } else {
            resolve(objectReturned);    
          }
        })
        .catch(errorReturned => {
          reject(errorReturned);
        })
    });
  };
    
  static handleError = function(err, object) {
    return new Promise((resolve, reject) => {
      if (err) {
        logger.error('[DAO] [handleError] err:'+typeof err+" = "+JSON.stringify(err));
        if (err.name === 'NotFound' && err.code === 404) {
          reject(errorUtils.ERROR_DAO_NOT_FOUND);
        } else if (err.name === 'MongoError' && err.code === 11000) {
          reject(errorUtils.ERROR_DAO_CONFLICT);
        } else {
          reject(errorUtils.ERROR_DAO_REQUEST_FAILED);
        }
      } else {
        resolve(object);
      }
    });
  };

}

module.exports = DAOErrorManager;