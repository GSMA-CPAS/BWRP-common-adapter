/* eslint-disable no-unused-vars */
const Service = require('./Service');
const ContractMapper = require('../core/ContractMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');

const BlockchainAdapterProvider = require('../providers/StubBlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();

const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

/**
 * Create a new Contract
 *
 * req ContractRequest
 * returns ContractResponse
 * */
const createContract = ({url, body}) => new Promise(
  async (resolve, reject) => {
    try {
      const contractToCreate = ContractMapper.getContractFromPostContractsRequest(body);
      const createContractResp = await LocalStorageProvider.createContract(contractToCreate);
      const returnedResponse = ContractMapper.getResponseBodyForGetContract(createContractResp);
      const returnedHeaders = {
        'Content-Location': `${url.replace(/\/$/, '')}/${createContractResp.id}`
      };
      resolve(Service.successResponse(returnedResponse, 201, returnedHeaders));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Delete a Contract By its ID
 *
 * contractID String The contract ID
 * returns ContractResponse
 * */
const deleteContractByID = ({contractID}) => new Promise(
  async (resolve, reject) => {
    try {
      const deleteContractByIdResp = await LocalStorageProvider.deleteContract(contractID);
      const returnedResponse = ContractMapper.getResponseBodyForGetContract(deleteContractByIdResp);
      resolve(Service.successResponse(returnedResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);
/**
 * Get a Contract By its ID
 *
 * contractID String The contract ID
 * format String Response format, defaults to JSON if not passed. (optional)
 * returns oneOf<ContractResponse,RAWContractResponse>
 * */
const getContractByID = ({contractID, format}) => new Promise(
    async (resolve, reject) => {
      // TODO: if format == raw
      try {
        const getContractByIdResp = await LocalStorageProvider.getContract(contractID);
        const returnedResponse = ContractMapper.getResponseBodyForGetContract(getContractByIdResp);
        resolve(Service.successResponse(returnedResponse));
      } catch (e) {
        reject(Service.rejectResponse(e));
      }
    },
);
/**
 * Show a list of all Contracts
 *
 * returns String
 * */
const getContracts = () => new Promise(
  async (resolve, reject) => {
    try {
      const getContractsResp = await LocalStorageProvider.getContracts();
      const returnedResponse = ContractMapper.getResponseBodyForGetContracts(getContractsResp);
      resolve(Service.successResponse(returnedResponse, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Set State to \"SEND\" and POST to Blochain adapter towards TargetMSP of the Contract
 *
 * contractID String The contract ID
 * returns ContractResponse
 * */
const sendContractByID = ({contractID}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractID);
      if (getContractByIdResp.state !== 'DRAFT') {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_CONTRACT_ONLY_ALLOWED_IN_STATE_DRAFT));
      }
      const uploadContractResp = await blockchainAdapterConnection.uploadContract(getContractByIdResp);
      const updateContractResp = await LocalStorageProvider.updateSentContract(contractID, uploadContractResp.rawData, uploadContractResp.documentID);
      const returnedResponse = ContractMapper.getResponseBodyForSendContract(updateContractResp);
      resolve(Service.successResponse(returnedResponse, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);
/**
 * Update existing Contract
 *
 * contractID String The contract ID
 * body ContractRequest Contract Object Payload
 * returns ContractResponse
 * */
const updateContractByID = ({contractID, body}) => new Promise(
  async (resolve, reject) => {
    if ((body.state !== undefined) && (body.state !== 'DRAFT')) {
      reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_CONTRACT_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT));
    }
    try {
      const contractToUpdate = ContractMapper.getContractFromPutContractRequest(contractID, body);
      const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);
      const returnedResponse = ContractMapper.getResponseBodyForGetContract(updateContractResp);
      resolve(Service.successResponse(returnedResponse, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

module.exports = {
    createContract,
    deleteContractByID,
    getContractByID,
    getContracts,
    sendContractByID,
    updateContractByID,
};
