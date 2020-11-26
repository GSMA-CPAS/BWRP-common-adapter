/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Create a new Usage
*
* contractID String The contract ID
* body UsageRequest Usage Object Payload
* returns UsageResponse
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
* returns UsageResponse
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
* Generate the \"Settlement\" with local calculator and POST to Blochain adapter towards TargetMSP of the calculated response.
*
* contractID String The contract ID
* usageID String The Usage ID
* mode String Defaults to \"preview\" if not selected. Preview will only performs \"calculation\" and return the calculated settlement in response. if \"commit\", will create the settlement and Send it live to the Blockchain to the targetMSP. (optional)
* returns Object
* */
const generateUsageByID = ({ contractID, usageID, mode }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
        mode,
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
* returns UsageResponse
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
* Set State to \"SEND\" and POST to Blochain adapter towards TargetMSP of the Usage
*
* contractID String The contract ID
* usageID String The Usage ID
* returns UsageResponse
* */
const sendUsageByID = ({ contractID, usageID }) => new Promise(
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
* Update Usage Object by its ID
*
* contractID String The contract ID
* usageID String The Usage ID
* body UsageRequest Usage Object Payload
* returns UsageResponse
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
  generateUsageByID,
  getUsageByID,
  getUsages,
  sendUsageByID,
  updateUsageByID,
};
