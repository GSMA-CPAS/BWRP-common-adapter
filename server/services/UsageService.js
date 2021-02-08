/* eslint-disable no-unused-vars */
const Service = require('./Service');
const UsageMapper = require('../core/UsageMapper');
const SettlementMapper = require('../core/SettlementMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');
const errorUtils = require('../utils/errorUtils');

const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();

/**
 * Create a new Usage
 *
 * @param {String} url The endpoint url
 * @param {String} contractId The contract Id
 * @param {Object} body The Usage Object Payload
 * @return {Promise<ServiceResponse>}
 */
const createUsage = ({url, contractId, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
      if (!((getContractByIdResp.state == 'SENT') || (getContractByIdResp.state == 'RECEIVED') || (getContractByIdResp.state == 'SIGNED'))) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_CREATE_USAGE_ON_CONTRACT_ONLY_ALLOWED_IN_STATE_SENT_SIGNED_OR_RECEIVED));
      }
      const isFromMspIdMyMspId = await blockchainAdapterConnection.isMyMspId(getContractByIdResp.fromMsp.mspId);
      const mspOwner = isFromMspIdMyMspId ? getContractByIdResp.fromMsp.mspId : getContractByIdResp.toMsp.mspId;
      const mspReceiver = isFromMspIdMyMspId ? getContractByIdResp.toMsp.mspId : getContractByIdResp.fromMsp.mspId;
      const usageToCreate = UsageMapper.getUsageFromPostUsagesRequest(contractId, body, mspOwner, mspReceiver);

      const createUsageResp = await LocalStorageProvider.createUsage(usageToCreate);
      const returnedResponse = UsageMapper.getResponseBodyForGetUsage(createUsageResp);
      const returnedHeaders = {
        'Content-Location': `${url.replace(/\/$/, '')}/${createUsageResp.id}`
      };
      resolve(Service.successResponse(returnedResponse, 201, returnedHeaders));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Delete a Usage By its Id
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Usage Id
 * @return {Promise<ServiceResponse>}
 */
const deleteUsageById = ({contractId, usageId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageId);
      if (getUsageByIdResp.contractId != contractId) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_PUT_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED));
      } else {
        const deleteUsageByIdResp = await LocalStorageProvider.deleteUsage(usageId);
        const returnedResponse = UsageMapper.getResponseBodyForGetUsage(deleteUsageByIdResp);
        resolve(Service.successResponse(returnedResponse));
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);


/**
 * Get Usage Object by its Id
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Usage Id
 * @return {Promise<ServiceResponse>}
 */
const getUsageById = ({contractId, usageId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageId);
      if (getUsageByIdResp.contractId != contractId) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GET_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED));
      }
      const returnedResponse = UsageMapper.getResponseBodyForGetUsage(getUsageByIdResp);
      resolve(Service.successResponse(returnedResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);
/**
 * Get All usage of a given Contract
 *
 * @param {String} contractId The contract Id
 * @return {Promise<ServiceResponse>}
 */
const getUsages = ({contractId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsagesResp = await LocalStorageProvider.getUsages(contractId);
      const returnedResponse = UsageMapper.getResponseBodyForGetUsages(getUsagesResp);
      resolve(Service.successResponse(returnedResponse, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Update Usage Object by its Id
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Usage Id
 * @param {String} body The Usage Object Payload
 * @return {Promise<ServiceResponse>}
 */
const updateUsageById = ({contractId, usageId, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageId);
      if (getUsageByIdResp.contractId != contractId) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_PUT_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED));
      } else if ((body.state !== undefined) && !((getUsageByIdResp.state == 'DRAFT') && (body.state == 'DRAFT'))) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_USAGE_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT));
      } else {
        const usageToUpdate = UsageMapper.getUsageFromPutUsagesRequest(getUsageByIdResp, body);
        const updateUsageResp = await LocalStorageProvider.updateUsage(usageToUpdate);
        const returnedResponse = UsageMapper.getResponseBodyForGetUsage(updateUsageResp);
        resolve(Service.successResponse(returnedResponse, 200));
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

module.exports = {
  createUsage,
  deleteUsageById,
  getUsageById,
  getUsages,
  updateUsageById,
};
