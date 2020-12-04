/* eslint-disable no-unused-vars */
const Service = require('./Service');
const UsageMapper = require('../core/UsageMapper');
const ContractMapper = require('../core/ContractMapper');
const SettlementMapper = require('../core/SettlementMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');
const errorUtils = require('../utils/errorUtils');


const CalculationServiceProvider = require('../providers/StubCalculationServiceProvider');
const calculationServiceConnection = new CalculationServiceProvider();
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
      const mspOwner = getContractByIdResp.fromMsp.mspId;
      const usageToCreate = UsageMapper.getUsageFromPostUsagesRequest(contractId, body, mspOwner);

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
 * Generate the \"Settlement\" with local calculator and POST to Blochain adapter towards TargetMsp of the calculated response.
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Usage Id
 * @param {String} mode Defaults to \"preview\" if not selected.
 * Preview will only performs \"calculation\" and return the calculated settlement in response.
 * if \"commit\", will create the settlement and Send it live to the Blockchain to the targetMsp. (optional)
 * @return {Promise<ServiceResponse>}
 */
const generateUsageById = ({contractId, usageId, mode}) => new Promise(
  async (resolve, reject) => {
    try {
      if (mode == 'commit') {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GENERATE_SETTLEMENT_AND_COMMIT_NOT_SUPPORTED));
      }
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageId);
      const usage = UsageMapper.getResponseBodyForGetUsage(getUsageByIdResp);

      if (getUsageByIdResp.contractId != contractId) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GENERATE_SETTLEMENT_ON_NOT_LINKED_CONTRACT_RECEIVED));
      }
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
      const contract = ContractMapper.getResponseBodyForGetContract(getContractByIdResp);

      const getCalculateResultResp = await calculationServiceConnection.getCalculateResult(usage, contract);

      const settlement = SettlementMapper.getSettlementForGenerateUsageById(usage, contract, getCalculateResultResp);
      const createSettlementResp = await LocalStorageProvider.createSettlement(settlement);
      console.log(createSettlementResp)

      const returnedResponse = SettlementMapper.getResponseBodyForGetSettlement(createSettlementResp);
      console.log(returnedResponse)
      resolve(Service.successResponse(returnedResponse));
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
 * Set State to \"SEND\" and POST to Blochain adapter towards TargetMsp of the Usage
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Usage Id
 * @return {Promise<ServiceResponse>}
 */
const sendUsageById = ({contractId, usageId}) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractId,
        usageId,
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
  generateUsageById,
  getUsageById,
  getUsages,
  sendUsageById,
  updateUsageById,
};
