/* eslint-disable no-unused-vars */
const Service = require('./Service');
const SettlementMapper = require('../core/SettlementMapper');
const LocalStorageProvider = require('../providers/LocalStorageProvider');
const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();
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
      const getSettlementByIdResp = await LocalStorageProvider.getSettlement(contractId, settlementId);
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


/**
 * Set State to \"SEND\" and POST to Blockchain adapter towards TargetMsp of the Usage
 *
 * @param {String} contractId The contract Id
 * @param {String} settlementId The Settlement Id
 * @return {Promise<ServiceResponse>}
 */
const sendSettlementById = ({contractId, settlementId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getSettlementByIdResp = await LocalStorageProvider.getSettlement(contractId, settlementId);
      if (getSettlementByIdResp.state !== 'DRAFT') {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_SETTLEMENT_ONLY_ALLOWED_IN_STATE_DRAFT));
      }
      const uploadSettlementResp = await blockchainAdapterConnection.uploadSettlement(getSettlementByIdResp);
      const getStorageKeysResp = await blockchainAdapterConnection.getStorageKeys(uploadContractResp.referenceId, [getContractByIdResp.fromMsp.mspId, getContractByIdResp.toMsp.mspId]);
      const updateContractResp = await LocalStorageProvider.updateSentContract(contractId, uploadContractResp.rawData, uploadContractResp.referenceId, getStorageKeysResp);
      const returnedResponse = ContractMapper.getResponseBodyForSendContract(updateContractResp);
      resolve(Service.successResponse(returnedResponse, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);


module.exports = {
  getSettlementById,
  sendSettlementById,
  getSettlements,
};
