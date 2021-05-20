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

/* eslint-disable no-unused-vars */
const Service = require('./Service');
const ContractMapper = require('../core/ContractMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');

const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();

const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

/**
 * Get Signature Object by its Id
 *
 * @param {String} contractId The contract Id
 * @param {String} signatureId The Signature Id
 * @return {Promise<ServiceResponse>}
 */
const getSignatureById = ({contractId, signatureId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
      if ((getContractByIdResp.state !== 'SENT') && (getContractByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        let indexOfSignatureToGet = -1;
        for (let i = 0; i < getContractByIdResp.signatureLink.length; i++) {
          if (getContractByIdResp.signatureLink[i]['id'] === signatureId) {
            indexOfSignatureToGet = i;
          }
        }
        if (indexOfSignatureToGet === -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_SIGNATURE_WITH_WRONG_SIGNATURE_ID));
        } else {
          const signature = getContractByIdResp.signatureLink[indexOfSignatureToGet];
          const bcSignatures = await blockchainAdapterConnection.getSignatures(getContractByIdResp.referenceId, getContractByIdResp[signature.msp].mspId);
          let state = 'UNSIGNED';

          const mySignature = {
            signatureId: signatureId,
            contractId: getContractByIdResp.id,
            msp: getContractByIdResp[signature.msp].mspId,
            // name: getContractByIdResp[signature.msp]['signatures'][signature.index].name,
            // role: getContractByIdResp[signature.msp]['signatures'][signature.index].role
          };
          if (signature.txId !== undefined && bcSignatures[signature.txId] !== undefined) {
            state = 'SIGNED';
            mySignature.algorithm = bcSignatures[signature.txId]['algorithm'];
            mySignature.certificate = bcSignatures[signature.txId]['certificate'];
            mySignature.signature = bcSignatures[signature.txId]['signature'];
            mySignature.blockchainRef = {type: 'hlf', txId: signature.txId};
          }
          mySignature.state = state;

          resolve(Service.successResponse(mySignature));
        }
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  });

/**
 * Get All signatures of a given Contract
 *
 * @param {String} contractId The contract Id
 * @return {Promise<ServiceResponse>}
 */
const getSignatures = ({contractId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
      if ((getContractByIdResp.state !== 'SENT') && (getContractByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        const signatures = [];
        for (const signature of getContractByIdResp.signatureLink) {
          if (signature.txId !== undefined) {
            signatures.push({
              signatureId: signature.id,
              contractId: getContractByIdResp.id,
              msp: getContractByIdResp[signature.msp].mspId,
              state: 'SIGNED'
            });
          }
        }
        resolve(Service.successResponse(signatures));
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Update Signature Object by its Id
 *
 * @param {String} contractId The contract Id
 * @param {String} signatureId The Signature Id
 * @param {Object} body The Signature Object Payload
 * @return {Promise<ServiceResponse>}
 */
const updateSignatureById = ({contractId, signatureId, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);

      if ((getContractByIdResp.state !== 'SENT') && (getContractByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        const signatureLink = getContractByIdResp.signatureLink;
        let indexOfSignatureToUpdate = -1;
        for (let i = 0; i < signatureLink.length; i++) {
          if (signatureLink[i]['id'] === signatureId) {
            indexOfSignatureToUpdate = i;
          }
        }
        if (indexOfSignatureToUpdate === -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_WITH_WRONG_SIGNATURE_ID));
        } else {
          if (getContractByIdResp.state === 'SENT') {
            // only Updates on fromMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp !== 'fromMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_SENT_CONTRACT));
            } else {
              // TODO: additional check if "signature" is valid.

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.referenceId, body.certificate, body.algorithm, body.signature);

              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const contractToUpdate = getContractByIdResp;
              contractToUpdate.signatureLink = signatureLink;

              const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);

              const mySignature = {
                signatureId: signatureId,
                contractId: getContractByIdResp.id,
                msp: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                name: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].name,
                role: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].role,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                state: 'SIGNED'
              };

              resolve(Service.successResponse(mySignature));
            }
          } else {
            // getContractByIdResp.state == 'RECEIVED'
            // only Updates on toMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp !== 'toMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_RECEIVED_CONTRACT));
            } else {
              // TODO: additional check if "signature" is valid.

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.referenceId, body.certificate, body.algorithm, body.signature);
              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const contractToUpdate = getContractByIdResp;
              contractToUpdate.signatureLink = signatureLink;

              const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);

              const mySignature = {
                signatureId: signatureId,
                contractId: getContractByIdResp.id,
                msp: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                name: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].name,
                role: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].role,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                state: 'SIGNED'
              };

              resolve(Service.successResponse(mySignature));
            }
          }
        }
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Create/Upload Signature
 *
 * @param {String} contractId The contract Id
 * @param {Object} body The Signature Object Payload
 * @return {Promise<ServiceResponse>}
 */
const createSignature = ({url, contractId, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);

      if ((getContractByIdResp.state !== 'SENT') && (getContractByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        const signatureLink = getContractByIdResp.signatureLink;
        let msp = 'fromMsp';
        if (getContractByIdResp.state === 'RECEIVED') {
          msp = 'toMsp';
        }
        let indexOfSignatureToUpdate = -1;
        let signatureId = '';
        for (let i = 0; i < signatureLink.length; i++) {
          if ((signatureLink[i]['txId'] === undefined) && (signatureLink[i]['msp'] === msp)) {
            indexOfSignatureToUpdate = i;
            signatureId = signatureLink[i]['id'];
          }
        }
        if (indexOfSignatureToUpdate === -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_LIMIT));
        } else {
          if (getContractByIdResp.state === 'SENT') {
            // only Updates on fromMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp !== 'fromMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_SENT_CONTRACT));
            } else {
              // TODO: additional check if "signature" is valid.

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.referenceId, body.certificate, body.algorithm, body.signature);

              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const contractToUpdate = getContractByIdResp;
              contractToUpdate.signatureLink = signatureLink;

              const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);

              const mySignature = {
                signatureId: signatureId,
                contractId: getContractByIdResp.id,
                msp: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                blockchainRef: {type: 'hlf', txId: bcSignatures.txID},
                state: 'SIGNED'
              };

              const returnedHeaders = {
                'Content-Location': `${url.replace(/\/$/, '')}/${signatureId}`
              };

              resolve(Service.successResponse(mySignature, 201, returnedHeaders));
            }
          } else {
            // getContractByIdResp.state == 'RECEIVED'
            // only Updates on toMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp !== 'toMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_RECEIVED_CONTRACT));
            } else {
              // TODO: additional check if "signature" is valid.

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.referenceId, body.certificate, body.algorithm, body.signature);
              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const contractToUpdate = getContractByIdResp;
              contractToUpdate.signatureLink = signatureLink;

              const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);

              const mySignature = {
                signatureId: signatureId,
                contractId: getContractByIdResp.id,
                msp: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                blockchainRef: {type: 'hlf', txId: bcSignatures.txID},
                state: 'SIGNED'
              };

              const returnedHeaders = {
                'Content-Location': `${url.replace(/\/$/, '')}/${signatureId}`
              };

              resolve(Service.successResponse(mySignature, 201, returnedHeaders));
            }
          }
        }
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Create/Upload Signature
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The usage Id
 * @param {Object} body The Signature Object Payload
 * @return {Promise<ServiceResponse>}
 */
const createUsageSignature = ({url, contractId, usageId, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(contractId, usageId);

      if ((getUsageByIdResp.state !== 'SENT') && (getUsageByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_USAGE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        const signatureLink = getUsageByIdResp.signatureLink;
        let msp = 'fromMsp';
        if (getUsageByIdResp.state === 'RECEIVED') {
          msp = 'toMsp';
        }
        let indexOfSignatureToUpdate = -1;
        let signatureId = '';
        for (let i = 0; i < signatureLink.length; i++) {
          if ((signatureLink[i]['txId'] === undefined) && (signatureLink[i]['msp'] === msp)) {
            indexOfSignatureToUpdate = i;
            signatureId = signatureLink[i]['id'];
          }
        }
        if (indexOfSignatureToUpdate === -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_LIMIT));
        } else {
          if (getUsageByIdResp.state === 'SENT') {
            // only Updates on fromMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp !== 'fromMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_SENT_USAGE));
            } else {
              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getUsageByIdResp.referenceId, body.certificate, body.algorithm, body.signature);

              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const usageToUpdate = getUsageByIdResp;
              usageToUpdate.signatureLink = signatureLink;

              const updateUsageResp = await LocalStorageProvider.updateUsage(usageToUpdate);

              const mySignature = {
                signatureId: signatureId,
                usageId: getUsageByIdResp.id,
                msp: updateUsageResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                blockchainRef: {type: 'hlf', txId: bcSignatures.txID},
                state: 'SIGNED'
              };

              const returnedHeaders = {
                'Content-Location': `${url.replace(/\/$/, '')}/${signatureId}`
              };

              resolve(Service.successResponse(mySignature, 201, returnedHeaders));
            }
          } else {
            // getUsageByIdResp.state == 'RECEIVED'
            // only Updates on toMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp !== 'toMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_RECEIVED_USAGE));
            } else {
              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getUsageByIdResp.referenceId, body.certificate, body.algorithm, body.signature);
              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const usageToUpdate = getUsageByIdResp;
              usageToUpdate.signatureLink = signatureLink;

              const updateUsageResp = await LocalStorageProvider.updateUsage(usageToUpdate);

              const mySignature = {
                signatureId: signatureId,
                usageId: getUsageByIdResp.id,
                msp: updateUsageResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                blockchainRef: {type: 'hlf', txId: bcSignatures.txID},
                state: 'SIGNED'
              };

              const returnedHeaders = {
                'Content-Location': `${url.replace(/\/$/, '')}/${signatureId}`
              };

              resolve(Service.successResponse(mySignature, 201, returnedHeaders));
            }
          }
        }
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Get Signature Object by its Id
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The usage Id
 * @param {String} signatureId The Signature Id
 * @return {Promise<ServiceResponse>}
 */
const getUsageSignatureById = ({contractId, usageId, signatureId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(contractId, usageId);
      if ((getUsageByIdResp.state !== 'SENT') && (getUsageByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_USAGE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        let indexOfSignatureToGet = -1;
        for (let i = 0; i < getUsageByIdResp.signatureLink.length; i++) {
          if (getUsageByIdResp.signatureLink[i]['id'] === signatureId) {
            indexOfSignatureToGet = i;
          }
        }
        if (indexOfSignatureToGet === -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_SIGNATURE_WITH_WRONG_SIGNATURE_ID));
        } else {
          const signature = getUsageByIdResp.signatureLink[indexOfSignatureToGet];
          const bcSignatures = await blockchainAdapterConnection.getSignatures(getUsageByIdResp.referenceId, getUsageByIdResp[signature.msp].mspId);
          let state = 'UNSIGNED';

          const mySignature = {
            signatureId: signatureId,
            usageId: getUsageByIdResp.id,
            msp: getUsageByIdResp[signature.msp].mspId,
            // name: getUsageByIdResp[signature.msp]['signatures'][signature.index].name,
            // role: getUsageByIdResp[signature.msp]['signatures'][signature.index].role
          };
          if (signature.txId !== undefined && bcSignatures[signature.txId] !== undefined) {
            state = 'SIGNED';
            mySignature.algorithm = bcSignatures[signature.txId]['algorithm'];
            mySignature.certificate = bcSignatures[signature.txId]['certificate'];
            mySignature.signature = bcSignatures[signature.txId]['signature'];
            mySignature.blockchainRef = {type: 'hlf', txId: signature.txId};
          }
          mySignature.state = state;

          resolve(Service.successResponse(mySignature));
        }
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  });

/**
 * Get All signatures of a given Usage
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The contract Id
 * @return {Promise<ServiceResponse>}
 */
const getUsageSignatures = ({contractId, usageId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(contractId, usageId);
      if ((getUsageByIdResp.state !== 'SENT') && (getUsageByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_USAGE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        const signatures = [];
        for (const signature of getUsageByIdResp.signatureLink) {
          if (signature.txId !== undefined) {
            signatures.push({
              signatureId: signature.id,
              usageId: getUsageByIdResp.id,
              msp: getUsageByIdResp[signature.msp].mspId,
              state: 'SIGNED'
            });
          }
        }
        resolve(Service.successResponse(signatures));
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

module.exports = {
  getSignatureById,
  getSignatures,
  // updateSignatureById,
  createSignature,
  createUsageSignature,
  getUsageSignatureById,
  getUsageSignatures,
};
