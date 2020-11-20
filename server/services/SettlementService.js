/* eslint-disable no-unused-vars */
const Service = require('./Service');

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

module.exports = {
  getSettlementByID,
  getSettlements,
};
