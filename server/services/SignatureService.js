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
          if (getContractByIdResp.signatureLink[i]['id'] == signatureId) {
            indexOfSignatureToGet = i;
          }
        }
        if (indexOfSignatureToGet == -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_SIGNATURE_WITH_WRONG_SIGNATURE_ID));
        } else {
          const signature = getContractByIdResp.signatureLink[indexOfSignatureToGet];
          const bcSignatures = await blockchainAdapterConnection.getSignatures(getContractByIdResp.referenceId, getContractByIdResp[signature.msp].mspId);
          let state = 'UNSIGNED';

          const mySignature = {
            signatureId: signatureId,
            contractId: getContractByIdResp.id,
            msp: getContractByIdResp[signature.msp].mspId,
            name: getContractByIdResp[signature.msp]['signatures'][signature.index].name,
            role: getContractByIdResp[signature.msp]['signatures'][signature.index].role
          };
          if (signature.txId != undefined && bcSignatures[signature.txId] != undefined) {
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
          if (signature.txId != undefined) {
            signatures.push({
              signatureId: signature.id,
              contractId: getContractByIdResp.id,
              msp: getContractByIdResp[signature.msp].mspId,
              // name: getContractByIdResp[signature.msp]['signatures'][signature.index].name,
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
          if (signatureLink[i]['id'] == signatureId) {
            indexOfSignatureToUpdate = i;
          }
        }
        if (indexOfSignatureToUpdate == -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_WITH_WRONG_SIGNATURE_ID));
        } else {
          if (getContractByIdResp.state == 'SENT') {
            // only Updates on fromMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp != 'fromMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_SENT_CONTRACT));
            } else {
              // TODO: additional check if "signature" is valid.

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.referenceId, body.certificate, body.algorithm, body.signature);
              console.log(bcSignatures);

              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const contractToUpdate = getContractByIdResp;
              contractToUpdate.signatureLink = signatureLink;
              console.log('11');

              const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);
              console.log(updateContractResp);

              const mySignature = {
                signatureId: signatureId,
                contractId: getContractByIdResp.id,
                msp: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                // name: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].name,
                // role: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].role,
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
            if (signatureLink[indexOfSignatureToUpdate].msp != 'toMsp') {
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
                // name: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].name,
                // role: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].role,
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
 * Update Signature Object by its Id
 *
 * @param {String} contractId The contract Id
 * @param {Object} body The Signature Object Payload
 * @return {Promise<ServiceResponse>}
 */
const updateSignature = ({contractId, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);

      if ((getContractByIdResp.state !== 'SENT') && (getContractByIdResp.state !== 'RECEIVED')) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED));
      } else {
        const signatureLink = getContractByIdResp.signatureLink;
        let indexOfSignatureToUpdate = -1;
        let signatureId = '';
        for (let i = 0; i < signatureLink.length; i++) {
          if (signatureLink[i]['txId'] == undefined ) {
            indexOfSignatureToUpdate = i;
            signatureId = signatureLink[i]['id'];
          }
        }
        if (indexOfSignatureToUpdate == -1) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_LIMIT));
        } else {
          if (getContractByIdResp.state == 'SENT') {
            // only Updates on fromMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp != 'fromMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_SENT_CONTRACT));
            } else {
              // TODO: additional check if "signature" is valid.

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.referenceId, body.certificate, body.algorithm, body.signature);
              console.log(bcSignatures);

              signatureLink[indexOfSignatureToUpdate]['txId'] = bcSignatures.txID;

              const contractToUpdate = getContractByIdResp;
              contractToUpdate.signatureLink = signatureLink;

              const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);
              console.log(updateContractResp);

              const mySignature = {
                signatureId: signatureId,
                contractId: getContractByIdResp.id,
                msp: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']].mspId,
                // name: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].name,
                // role: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].role,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                blockchainRef: {type: 'hlf', txId: bcSignatures.txID},
                state: 'SIGNED'
              };

              resolve(Service.successResponse(mySignature));
            }
          } else {
            // getContractByIdResp.state == 'RECEIVED'
            // only Updates on toMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp != 'toMsp') {
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
                blockchainRef: {type: 'hlf', txId: bcSignatures.txID},
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

module.exports = {
  getSignatureById,
  getSignatures,
  updateSignatureById,
  updateSignature,
};
