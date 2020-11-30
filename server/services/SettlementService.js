/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
 * Get Settlement Object by its Id
 *
 * @param {String} contractId The contract Id
 * @param {String} settlementId The Settlement Id
 * @return {Promise<ServiceResponse>}
 */
const getSettlementById = ({contractId, settlementId}) => new Promise(
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
 * @param {String} contractId The contract Id
 * @return {Promise<ServiceResponse>}
 */
const getSettlements = ({contractId}) => new Promise(
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
