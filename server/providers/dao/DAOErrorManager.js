// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

'use strict';

const logger = require('../../logger');

const errorUtils = require('../../utils/errorUtils');

class DAOErrorManager {
  static handleErrorOrNullObject(err, object) {
    return new Promise((resolve, reject) => {
      DAOErrorManager.handleError(err, object)
        .then((objectReturned) => {
          if (!objectReturned) {
            logger.error('[DAO] [handleErrorOrNullObject] returned object is null');
            reject(errorUtils.ERROR_DAO_NOT_FOUND);
          } else {
            resolve(objectReturned);
          }
        })
        .catch((errorReturned) => {
          reject(errorReturned);
        });
    });
  }

  static handleError(err, object) {
    return new Promise((resolve, reject) => {
      if (err) {
        logger.error('[DAO] [handleError] err:' + typeof err + ' = ' + JSON.stringify(err));
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
  }
}

module.exports = DAOErrorManager;
