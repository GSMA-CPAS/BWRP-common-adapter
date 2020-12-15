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
          const bcSignatures = await blockchainAdapterConnection.getSignatures( contract.documentId, contract[signature.msp].mspId);
          console.log(bcSignatures);
          let state = 'UNSIGNED';

          const mySignature = {
            signatureId: signatureId,
            contractId: contract.id,
            msp: contract[signature.msp].mspId,
            name: contract[signature.msp]['signatures'][signature.index].name,
            role: contract[signature.msp]['signatures'][signature.index].role 
          }
          if (signature.txId!=undefined && bcSignatures[signature.txId] != undefined) {
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
      const contract = await LocalStorageProvider.getContract(contractId);
      const signatures = [];
      for (const signature of contract.signatureLink) {
        let state = 'UNSIGNED';
        if (signature.txId!=undefined) {
          state = 'SIGNED';
        }
        signatures.push({signatureId: signature.id, contractId: contract.id, msp: contract[signature.msp].mspId, name: contract[signature.msp]['signatures'][signature.index].name, state: state});
      }
      resolve(Service.successResponse(signatures));
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
      // TODO: check payload format
      // {
      //   "signature": "signature",
      //   "certificate": "-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...",
      //   "algorithm": "secp384r1"
      // }
      // TODO: additional check to only allow operation for MSP = selfMSP. (cannot update Cert for Remote)


      const contract = await LocalStorageProvider.getContract(contractId);
      const signatureLink = contract.signatureLink;

      // TODO: additional check if "signature" is valid.

      for (let i = 0; i < signatureLink.length; i++) {
        if (signatureLink[i]['id'] == signatureId) {
          const bcSignatures = await blockchainAdapterConnection.uploadSignature( contract.documentId, body.certificate, body.algorithm, body.signature);
          signatureLink[i]['txId'] = bcSignatures.txID;

          const contractToUpdate = contract;
          contractToUpdate.signatureLink = signatureLink;

          const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);

          const mySignature = {
            signatureId: signatureId,
            contractId: contract.id,
            msp: updateContractResp[signatureLink[i]['msp']].mspId,
            name: updateContractResp[signatureLink[i]['msp']]['signatures'][signatureLink[i]['index']].name,
            role: updateContractResp[signatureLink[i]['msp']]['signatures'][signatureLink[i]['index']].role,
            algorithm: body.algorithm,
            certificate: body.certificate,
            signature: body.signature,
            state: 'SIGNED'
          }

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

module.exports = {
  getSignatureById,
  getSignatures,
  updateSignatureById,
};
