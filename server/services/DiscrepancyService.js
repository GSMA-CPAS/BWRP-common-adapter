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
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageId);
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

module.exports = {
  putSettlementDiscrepancy,
  putUsageDiscrepancy
};
