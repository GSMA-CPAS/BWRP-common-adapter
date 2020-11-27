/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get Signature Object by its Id
*
* contractId String The contract Id
* signatureId String The Signature Id
* returns SignatureResponse
* */
const getSignatureById = ({ contractId, signatureId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractId,
        signatureId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get All signatures of a given Contract
*
* contractId String The contract Id
* returns String
* */
const getSignatures = ({ contractId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update Signature Object by its Id
*
* contractId String The contract Id
* signatureId String The Signature Id
* body SignatureRequest Signature Object Payload
* returns SignatureResponse
* */
const updateSignatureById = ({ contractId, signatureId, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractId,
        signatureId,
        body,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  getSignatureById,
  getSignatures,
  updateSignatureById,
};
