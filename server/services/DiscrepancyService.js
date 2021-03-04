/* eslint-disable no-unused-vars */
const Service = require('./Service');
const DiscrepancyMapper = require('../core/DiscrepancyMapper');
const LocalStorageProvider = require('../providers/LocalStorageProvider');
const DiscrepencyServiceProvider = require('../providers/StubDiscrepancyServiceProvider');
const discrepencyServiceProviderConnection = new DiscrepencyServiceProvider();
const errorUtils = require('../utils/errorUtils');

/**
 * Put Settlement Discrepancy
 *
 * @param {String} contractId The contract Id
 * @param {String} settlementId The Settlement Id
 * @return {Promise<ServiceResponse>}
 */
const putDiscrepancy = ({contractId, settlementId, usageId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getSettlementByIdResp = await LocalStorageProvider.getSettlement(contractId, settlementId);
      const getUsageByIdResp = await LocalStorageProvider.getUsage(contractId, usageId);
      const createDiscrepancyResp = discrepencyServiceProviderConnection.createDiscrepancy(getUsageByIdResp, getSettlementByIdResp);
      const returnedResponse = await DiscrepancyMapper.getResponseBodyForGetDiscrepancy(createDiscrepancyResp);
      resolve(Service.successResponse(returnedResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Put Settlement Discrepancy
 *
 * @param {String} contractId The contract Id
 * @param {String} settlementId The Settlement Id
 * @param {String} usageId The Usage Id
 * @return {Promise<ServiceResponse>}
 */
const putSettlementDiscrepancy = ({contractId, settlementId, usageId}) => putDiscrepancy({contractId, settlementId, usageId});

/**
 * Put Usage Discrepancy
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Usage Id
 * @param {String} settlementId The Settlement Id
 * @return {Promise<ServiceResponse>}
 */
const putUsageDiscrepancy = ({contractId, usageId, settlementId}) => putDiscrepancy({contractId, settlementId, usageId});


/**
 * Get Settlement Discrepancy
 *
 * @param {String} contractId The contract Id
 * @param {String} settlementId The Settlement Id
 * @return {Promise<ServiceResponse>}
 */
const getSettlementDiscrepancy = ({contractId, settlementId, partnerSettlementId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getSettlementByIdResp = await LocalStorageProvider.getSettlement(contractId, settlementId);
      const getPartnerSettlementByIdResp = await LocalStorageProvider.getSettlement(contractId, partnerSettlementId);
      const getDiscrepancyResp = discrepencyServiceProviderConnection.getSettlementDiscrepancy(getSettlementByIdResp, getPartnerSettlementByIdResp);
      const returnedResponse = await DiscrepancyMapper.getResponseBodyForGetSettlementDiscrepancy(getDiscrepancyResp);
      resolve(Service.successResponse(returnedResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Get Settlement Discrepancy
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Settlement Id
 * @return {Promise<ServiceResponse>}
 */
const getUsageDiscrepancy = ({contractId, usageId, partnerUsageId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(contractId, usageId);
      const getPartnerUsageByIdResp = await LocalStorageProvider.getUsage(contractId, partnerUsageId);
      const getDiscrepancyResp = discrepencyServiceProviderConnection.getUsageDiscrepancy(getUsageByIdResp, getPartnerUsageByIdResp);
      const returnedResponse = await DiscrepancyMapper.getResponseBodyForGetUsageDiscrepancy(getDiscrepancyResp);
      resolve(Service.successResponse(returnedResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

// putSettlementDiscrepancy and putUsageDiscrepancy exported but not exposed in API
module.exports = {
  putSettlementDiscrepancy,
  putUsageDiscrepancy,
  getSettlementDiscrepancy,
  getUsageDiscrepancy
};
