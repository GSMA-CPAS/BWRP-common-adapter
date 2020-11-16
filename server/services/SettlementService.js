/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Create a new Settlement
*
* contractID String The contract ID
* body Object Settlement Object Payload
* returns String
* */
const createSettlement = ({ contractID, body }) => new Promise(
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
* Delete a Settlement By its ID
*
* contractID String The contract ID
* settlementID String The Settlement ID
* returns SuccessResponse
* */
const deleteSettlementByID = ({ contractID, settlementID }) => new Promise(
    async (resolve, reject) => {
        console.log('Delete settlement');
    try {
     // resolve(Service.successResponse({
    //    contractID,
    //    settlementID,
    //  }));
        reject(Service.rejectResponse(
            {"error":"invalid_request", "description": "Invalid Bearer Token"},
            400,
        ));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Settlement Object by its ID
*
* contractID String The contract ID
* settlementID String The Settlement ID
* returns Object
* */
const getSettlementByID = ({ contractID, settlementID }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        settlementID,
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
* Get All Settlement of a given Contract
*
* contractID String The contract ID
* returns String
* */
const getSettlements = ({ contractID }) => new Promise(
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
* Update Settlement Object by its ID
*
* contractID String The contract ID
* settlementID String The Settlement ID
* body Object Settlement Object Payload
* returns Object
* */
const updateSettlementByID = ({ contractID, settlementID, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        settlementID,
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
  createSettlement,
  deleteSettlementByID,
  getSettlementByID,
  getSettlements,
  updateSettlementByID,
};
