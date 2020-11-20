/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get Signature Object by its ID
*
* contractID String The contract ID
* signatureID String The Signature ID
* returns SignatureResponse
* */
const getSignatureByID = ({ contractID, signatureID }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        signatureID,
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
* contractID String The contract ID
* returns String
* */
const getSignatures = ({ contractID }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
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
* Update Signature Object by its ID
*
* contractID String The contract ID
* signatureID String The Signature ID
* body SignatureRequest Signature Object Payload
* returns SignatureResponse
* */
const updateSignatureByID = ({ contractID, signatureID, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        signatureID,
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
  getSignatureByID,
  getSignatures,
  updateSignatureByID,
};
