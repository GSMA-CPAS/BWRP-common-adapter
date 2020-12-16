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
      const contract = await LocalStorageProvider.getContract(contractId);

      for (const signature of contract.signatureLink) {
        if (signature.id == signatureId) {
          console.log(signature);

          // get signatures from blockchain
          const bcSignatures = await blockchainAdapterConnection.getSignatures(contract.documentId, contract[signature.msp].mspId);
          console.log(bcSignatures);
          let state = 'UNSIGNED';

          const mySignature = {
            signatureId: signatureId,
            contractId: contract.id,
            msp: contract[signature.msp].mspId,
            name: contract[signature.msp]['signatures'][signature.index].name,
            role: contract[signature.msp]['signatures'][signature.index].role
          };
          if (signature.txId != undefined && bcSignatures[signature.txId] != undefined) {
            state = 'SIGNED';
            mySignature.algorithm = bcSignatures[signature.txId]['algorithm'];
            mySignature.certificate = bcSignatures[signature.txId]['certificate'];
            mySignature.signature = bcSignatures[signature.txId]['signature'];
          }
          mySignature.state = state;

          resolve(Service.successResponse(mySignature));
        }
      }

      // reject properlly
      reject(Service.rejectResponse(
        e.message || 'Invalid SignatureId',
        e.status || 405,
      ));

    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

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
          let state = 'UNSIGNED';
          if (signature.txId != undefined) {
            state = 'SIGNED';
          }
          signatures.push({
            signatureId: signature.id,
            contractId: getContractByIdResp.id,
            msp: getContractByIdResp[signature.msp].mspId,
            name: getContractByIdResp[signature.msp]['signatures'][signature.index].name,
            state: state
          });
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

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.documentId, body.certificate, body.algorithm, body.signature);
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
                name: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].name,
                role: updateContractResp[signatureLink[indexOfSignatureToUpdate]['msp']]['signatures'][signatureLink[indexOfSignatureToUpdate]['index']].role,
                algorithm: body.algorithm,
                certificate: body.certificate,
                signature: body.signature,
                state: 'SIGNED'
              }

              resolve(Service.successResponse(mySignature));
            }
          } else {
            // getContractByIdResp.state == 'RECEIVED'
            // only Updates on toMSP allowed
            if (signatureLink[indexOfSignatureToUpdate].msp != 'toMsp') {
              reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_UPDATE_SIGNATURES_ON_RECEIVED_CONTRACT));
            } else {
              // TODO: additional check if "signature" is valid.

              const bcSignatures = await blockchainAdapterConnection.uploadSignature(getContractByIdResp.documentId, body.certificate, body.algorithm, body.signature);
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
              }

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
};
