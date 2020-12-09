/* eslint-disable no-unused-vars */
const Service = require('./Service');

const SettlementMapper = require('../core/SettlementMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');
const errorUtils = require('../utils/errorUtils');

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
      const getSettlementByIdResp = await LocalStorageProvider.getSettlement(settlementId);
      if (getSettlementByIdResp.contractId != contractId) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_SETTLEMENT_ON_NOT_LINKED_CONTRACT_RECEIVED));
      }
      const returnedResponse = SettlementMapper.getResponseBodyForGetSettlement(getSettlementByIdResp);
      resolve(Service.successResponse(returnedResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
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
      const getSettlementsResp = await LocalStorageProvider.getSettlements(contractId);
      const returnedResponse = SettlementMapper.getResponseBodyForGetSettlements(getSettlementsResp);
      resolve(Service.successResponse(returnedResponse, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

module.exports = {
  getSettlementById,
  getSettlements,
};
