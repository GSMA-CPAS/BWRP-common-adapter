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

const DAOErrorManager = require('./DAOErrorManager');
const ContractMongoRequester = require('./ContractMongoRequester');

const MISSING_MANDATORY_PARAM_ERROR = errorUtils.ERROR_DAO_MISSING_MANDATORY_PARAM;

class ContractDAO {
  static findAll(matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters

      // Define find condition
      const condition = {
        type: 'contract'
      };
      if (matchingConditions.state !== undefined) {
        if (Array.isArray(matchingConditions.state)) {
          condition.state = {$in: matchingConditions.state};
        } else if (typeof matchingConditions.state === 'string') {
          condition.state = matchingConditions.state;
        }
      }
      if (matchingConditions.msp !== undefined) {
        if (Array.isArray(matchingConditions.msp)) {
          condition.$or = [
            {'fromMsp.mspId': {$in: matchingConditions.msp}},
            {'toMsp.mspId': {$in: matchingConditions.msp}}
          ];
        } else if (typeof matchingConditions.state === 'string') {
          condition.$or = [
            {'fromMsp.mspId': matchingConditions.msp},
            {'toMsp.mspId': matchingConditions.msp}
          ];
        }
      }
      if (matchingConditions.rawData !== undefined) {
        condition.rawData = matchingConditions.rawData;
      }
      if (matchingConditions.id !== undefined) {
        condition.id = matchingConditions.id;
      }
      if (matchingConditions.referenceId !== undefined) {
        condition.referenceId = matchingConditions.referenceId;
      }
      if (matchingConditions.storageKey !== undefined) {
        // stoargeKeys is an array and we try to find a storageKey in this storageKeys
        condition.storageKeys = matchingConditions.storageKey;
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
      object.type = 'contract';

      const creationDate = Date.now();
      object.creationDate = creationDate;
      object.lastModificationDate = creationDate;
      object.history = [
        {date: creationDate, action: action}
      ];

      if (action == 'RECEIVED') {
        const signatureLinks = [];
        if (object.fromMsp.signatures !== undefined) {
          for (let i = 0; i < object.fromMsp.signatures.length; i++) {
            signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'fromMsp', index: i});
          }
        }
        if (object.toMsp.signatures !== undefined) {
          for (let i = 0; i < object.toMsp.signatures.length; i++) {
            signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'toMsp', index: i});
          }
        }
        if (object.fromMsp.minSignatures !== undefined) {
          for (let i = 0; i < object.fromMsp.minSignatures; i++) {
            signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'fromMsp', index: i});
          }
        }
        if (object.toMsp.minSignatures !== undefined) {
          for (let i = 0; i < object.toMsp.minSignatures; i++) {
            signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'toMsp', index: i});
          }
        }
        object.signatureLink = signatureLinks;
      }

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
        type: 'contract',
        state: object.state
      };

      const updateCommand = {
        $set: {
          name: object.name,
          version: object.version,
          fromMsp: object.fromMsp,
          toMsp: object.toMsp,
          body: object.body,
          lastModificationDate: object.lastModificationDate,
          signatureLink: object.signatureLink
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

  static findOne(id, matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (id === undefined) {
        logger.error('[ContractDAO::findOne] [FAILED] : id undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define find condition
      const condition = {
        id: id,
        type: 'contract'
      };
      if (matchingConditions.state !== undefined) {
        if (Array.isArray(matchingConditions.state)) {
          condition.state = {$in: matchingConditions.state};
        } else if (typeof matchingConditions.state === 'string') {
          condition.state = matchingConditions.state;
        }
      }
      if (matchingConditions.rawData !== undefined) {
        condition.rawData = matchingConditions.rawData;
      }
      if (matchingConditions.referenceId !== undefined) {
        condition.referenceId = matchingConditions.referenceId;
      }
      if (matchingConditions.storageKey !== undefined) {
        // stoargeKeys is an array and we try to find a storageKey in this storageKeys
        condition.storageKeys = matchingConditions.storageKey;
      }

      // Launch database request
      ContractMongoRequester.findOne(condition, (err, contract) => {
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

  static findOneByReferenceId(referenceId, matchingConditions = {}) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (referenceId === undefined) {
        logger.error('[ContractDAO::findOneByReferenceId] [FAILED] : referenceId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define find condition
      const condition = {
        referenceId: referenceId,
        type: 'contract'
      };
      if (matchingConditions.state !== undefined) {
        if (Array.isArray(matchingConditions.state)) {
          condition.state = {$in: matchingConditions.state};
        } else if (typeof matchingConditions.state === 'string') {
          condition.state = matchingConditions.state;
        }
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
      ContractMongoRequester.findOne(condition, (err, contract) => {
        // Use errorManager to return appropriate dao errors
        DAOErrorManager.handleErrorOrNullObject(err, contract)
          .then((objectReturned) => {
            logger.debug('[DAO] [findOneByReferenceId] [OK] objectReturned:' + typeof objectReturned + ' = ' + JSON.stringify(objectReturned));
            return resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[DAO] [findOneByReferenceId] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
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

      // Define find condition
      const condition = {
        id: id,
        type: 'contract'
      };

      // Launch database request
      ContractMongoRequester.findOneAndRemove(condition, (err, contract) => {
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

  static findOneAndUpdateToSentContract(contractId, rawData, referenceId, storageKeys, blockchainRef) {
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
      if (referenceId === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] : referenceId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (storageKeys === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] : storageKeys undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (blockchainRef === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] : blockchainRef undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      const lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: contractId,
        type: 'contract',
        state: 'DRAFT'
      };

      // Convert "header->from/toMSP->signatures to signatureLink
      ContractMongoRequester.findOne(condition, (findOneErr, storedContract) => {
        DAOErrorManager.handleErrorOrNullObject(findOneErr, storedContract)
          .then((storedObjectReturned) => {
            const signatureLinks = [];
            if (storedContract.fromMsp.signatures !== undefined) {
              for (let i = 0; i < storedContract.fromMsp.signatures.length; i++) {
                signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'fromMsp', index: i});
              }
            }
            if (storedContract.toMsp.signatures !== undefined) {
              for (let i = 0; i < storedContract.toMsp.signatures.length; i++) {
                signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'toMsp', index: i});
              }
            }
            if (storedContract.fromMsp.minSignatures !== undefined) {
              for (let i = 0; i < storedContract.fromMsp.minSignatures; i++) {
                signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'fromMsp', index: i});
              }
            }
            if (storedContract.toMsp.minSignatures !== undefined) {
              for (let i = 0; i < storedContract.toMsp.minSignatures; i++) {
                signatureLinks.push({id: ContractMongoRequester.defineSignatureId(), msp: 'toMsp', index: i});
              }
            }


            const updateCommand = {
              $set: {
                rawData: rawData,
                referenceId: referenceId,
                blockchainRef: blockchainRef,
                storageKeys: storageKeys,
                state: 'SENT',
                lastModificationDate: lastModificationDate,
                signatureLink: signatureLinks
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
          })
          .catch((errorReturned) => {
            logger.error('[ContractDAO::findOneAndUpdateToSentContract] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static findOneAndUpdateIsUssageApproved(contractId, state) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (contractId === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateIsUssageApproved] [FAILED] : contractId undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }
      if (state === undefined) {
        logger.error('[ContractDAO::findOneAndUpdateIsUssageApproved] [FAILED] : state undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Define automatic values
      const lastModificationDate = Date.now();

      // Defined update condition and update command
      const condition = {
        id: contractId,
        type: 'contract'
      };

      // Convert "header->from/toMSP->signatures to signatureLink
      ContractMongoRequester.findOne(condition, (findOneErr, storedContract) => {
        DAOErrorManager.handleErrorOrNullObject(findOneErr, storedContract)
          .then((storedObjectReturned) => {
            
            const updateCommand = {
              $set: {
                isUsageApproved: state              },
              $push: {
                history: {date: lastModificationDate, action: 'isUsageApproved_' + state}
              }
            };

            // Launch database request
            ContractMongoRequester.findOneAndUpdate(condition, updateCommand, (err, contract) => {
              DAOErrorManager.handleErrorOrNullObject(err, contract)
                .then((objectReturned) => {
                  resolve(objectReturned);
                })
                .catch((errorReturned) => {
                  logger.error('[ContractDAO::findOneAndUpdateIsUssageApproved] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
                  reject(errorReturned);
                });
            });
          })
          .catch((errorReturned) => {
            logger.error('[ContractDAO::findOneAndUpdateIsUssageApproved] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }

  static exists(object) {
    return new Promise((resolve, reject) => {
      // Verify parameters
      if (object === undefined) {
        logger.error('[ContractDAO::exists] [FAILED] : object undefined');
        reject(MISSING_MANDATORY_PARAM_ERROR);
      }

      // Defined update condition and update command
      const condition = {
        type: 'contract'
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
      ContractMongoRequester.exists(condition, (err, exists) => {
        DAOErrorManager.handleError(err, exists)
          .then((objectReturned) => {
            resolve(objectReturned);
          })
          .catch((errorReturned) => {
            logger.error('[ContractDAO::exists] [FAILED] errorReturned:' + typeof errorReturned + ' = ' + JSON.stringify(errorReturned));
            reject(errorReturned);
          });
      });
    });
  }
}

module.exports = ContractDAO;
