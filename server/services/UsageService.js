/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Create a new USage
*
* contractID String The contract ID
* body Object Usage Object Payload
* returns String
* */
const createUsage = ({ contractID, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
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
/**
* Delete a Usage By its ID
*
* contractID String The contract ID
* usageID String The Usage ID
* returns String
* */
const deleteUsageByID = ({ contractID, usageID }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
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
* Get Usage Object by its ID
*
* contractID String The contract ID
* usageID String The Usage ID
* returns String
* */
const getUsageByID = ({ contractID, usageID }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
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
* Get All usage of a given Contract
*
* contractID String The contract ID
* returns String
* */
const getUsages = ({ contractID }) => new Promise(
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
* Update Usage Object by its ID
*
* contractID String The contract ID
* usageID String The Usage ID
* body Object Usage Object Payload
* returns String
* */
const updateUsageByID = ({ contractID, usageID, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
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
  createUsage,
  deleteUsageByID,
  getUsageByID,
  getUsages,
  updateUsageByID,
};
