/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get Settlement Object by its Id
*
* contractId String The contract Id
* settlementId String The Settlement Id
* returns Object
* */
const getSettlementById = ({ contractId, settlementId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractId,
        settlementId,
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
* contractId String The contract Id
* returns String
* */
const getSettlements = ({ contractId }) => new Promise(
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

module.exports = {
  getSettlementById,
  getSettlements,
};
