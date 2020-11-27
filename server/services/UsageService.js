/* eslint-disable no-unused-vars */
const Service = require('./Service');
const UsageMapper = require('../core/UsageMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');
const errorUtils = require('../utils/errorUtils');

/**
 * Create a new Usage
 *
 * contractId String The contract Id
 * body UsageRequest Usage Object Payload
 * returns UsageResponse
 * */
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
 * contractId String The contract Id
 * usageId String The Usage Id
 * returns UsageResponse
 * */
const deleteUsageById = ({contractId, usageId}) => new Promise(
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
 * Generate the \"Settlement\" with local calculator and POST to Blochain adapter towards TargetMsp of the calculated response.
 *
 * contractId String The contract Id
 * usageId String The Usage Id
 * mode String Defaults to \"preview\" if not selected. Preview will only performs \"calculation\" and return the calculated settlement in response. if \"commit\", will create the settlement and Send it live to the Blockchain to the targetMsp. (optional)
 * returns Object
 * */
const generateUsageById = ({contractId, usageId, mode}) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractId,
        usageId,
        mode,
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
 * Get Usage Object by its Id
 *
 * contractId String The contract Id
 * usageId String The Usage Id
 * returns UsageResponse
 * */
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
 * contractId String The contract Id
 * returns String
 * */
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
 * contractId String The contract Id
 * usageId String The Usage Id
 * returns UsageResponse
 * */
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
 * contractId String The contract Id
 * usageId String The Usage Id
 * body UsageRequest Usage Object Payload
 * returns UsageResponse
 * */
const updateUsageById = ({contractId, usageId, body}) => new Promise(
  async (resolve, reject) => {

    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageId);
      if (getUsageByIdResp.contractId != contractId) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_PUT_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED));
      } else if ((body.state !== undefined) && !((getUsageByIdResp.state == 'DRAFT') && (body.state == 'DRAFT'))) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_USAGE_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT));
      } else {
        const usageToUpdate = UsageMapper.getUsageFromPutUsagesRequest(getUsageByIdResp, body)
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
