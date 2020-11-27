/* eslint-disable no-unused-vars */
const Service = require('./Service');
const UsageMapper = require('../core/UsageMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');
const errorUtils = require('../utils/errorUtils');

/**
 * Create a new Usage
 *
 * contractID String The contract ID
 * body UsageRequest Usage Object Payload
 * returns UsageResponse
 * */
const createUsage = ({url, contractID, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractID);
      if (!((getContractByIdResp.state == 'SENT') || (getContractByIdResp.state == 'RECEIVED')|| (getContractByIdResp.state == 'SIGNED'))) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_CREATE_USAGE_ON_CONTRACT_ONLY_ALLOWED_IN_STATE_SENT_SIGNED_OR_RECEIVED));
      }
      const mspOwner = getContractByIdResp.fromMsp.mspId;
      const usageToCreate = UsageMapper.getUsageFromPostUsagesRequest(contractID, body, mspOwner);
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
 * Delete a Usage By its ID
 *
 * contractID String The contract ID
 * usageID String The Usage ID
 * returns UsageResponse
 * */
const deleteUsageByID = ({contractID, usageID}) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
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
 * Generate the \"Settlement\" with local calculator and POST to Blochain adapter towards TargetMSP of the calculated response.
 *
 * contractID String The contract ID
 * usageID String The Usage ID
 * mode String Defaults to \"preview\" if not selected. Preview will only performs \"calculation\" and return the calculated settlement in response. if \"commit\", will create the settlement and Send it live to the Blockchain to the targetMSP. (optional)
 * returns Object
 * */
const generateUsageByID = ({contractID, usageID, mode}) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
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
 * Get Usage Object by its ID
 *
 * contractID String The contract ID
 * usageID String The Usage ID
 * returns UsageResponse
 * */
const getUsageByID = ({contractID, usageID}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageID);
      if (getUsageByIdResp.contractId != contractID) {
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
 * contractID String The contract ID
 * returns String
 * */
const getUsages = ({contractID}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsagesResp = await LocalStorageProvider.getUsages(contractID);
      const returnedResponse = UsageMapper.getResponseBodyForGetUsages(getUsagesResp);
      resolve(Service.successResponse(returnedResponse, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);
/**
 * Set State to \"SEND\" and POST to Blokchain adapter towards TargetMSP of the Usage
 *
 * contractID String The contract ID
 * usageID String The Usage ID
 * returns UsageResponse
 * */
const sendUsageByID = ({contractID, usageID}) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
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
 * Update Usage Object by its ID
 *
 * contractID String The contract ID
 * usageID String The Usage ID
 * body UsageRequest Usage Object Payload
 * returns UsageResponse
 * */
const updateUsageByID = ({contractID, usageID, body}) => new Promise(
  async (resolve, reject) => {

    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(usageID);
      if (getUsageByIdResp.contractId != contractID) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_PUT_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED));
      }
      if ( (body.state !== undefined) && !((getUsageByIdResp.state == 'DRAFT') && (body.state == 'DRAFT')) ) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_USAGE_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT));
      }

      const usageToUpdate = UsageMapper.getUsageFromPutUsagesRequest(getUsageByIdResp,body)
      const updateUsageResp = await LocalStorageProvider.updateUsage(usageToUpdate);

      const returnedResponse = UsageMapper.getResponseBodyForGetUsage(updateUsageResp);
      resolve(Service.successResponse(returnedResponse, 200));

    } catch (e) {
      reject(Service.rejectResponse(e));
    }








    if ((body.state !== undefined) && (body.state !== 'DRAFT')) {
      reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_USAGE_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT));
    }

    try {
      resolve(Service.successResponse({
        contractID,
        usageID,
        body,
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
  createUsage,
  deleteUsageByID,
  generateUsageByID,
  getUsageByID,
  getUsages,
  sendUsageByID,
  updateUsageByID,
};
