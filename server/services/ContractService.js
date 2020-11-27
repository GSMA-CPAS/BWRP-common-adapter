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
* body ContractRequest Contract Object Payload
* returns ContractResponse
* */
const createContract = ({ url, body }) => new Promise(
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
* Delete a Contract By its Id
*
* contractId String The contract Id
* returns ContractResponse
* */
const deleteContractById = ({ contractId }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleteContractByIdResp = await LocalStorageProvider.deleteContract(contractId);
      const returnedResponse = ContractMapper.getResponseBodyForGetContract(deleteContractByIdResp);
      resolve(Service.successResponse(returnedResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);
/**
* Get a Contract By its Id
*
* contractId String The contract Id
* format String Response format, defaults to JSON if not passed. (optional)
* returns oneOf<ContractResponse,RAWContractResponse>
* */
const getContractById = ({ contractId, format }) => new Promise(
  async (resolve, reject) => {
    // TODO: if format == raw
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
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
* Set State to \"SEND\" and POST to Blochain adapter towards TargetMsp of the Contract
*
* contractId String The contract Id
* returns ContractResponse
* */
const sendContractById = ({ contractId }) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
      if (getContractByIdResp.state !== 'DRAFT') {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_CONTRACT_ONLY_ALLOWED_IN_STATE_DRAFT));
      }
      const uploadContractResp = await blockchainAdapterConnection.uploadContract(getContractByIdResp);
      const updateContractResp = await LocalStorageProvider.updateSentContract(contractId, uploadContractResp.rawData, uploadContractResp.documentID);
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
* contractId String The contract Id
* body ContractRequest Contract Object Payload
* returns ContractResponse
* */
const updateContractById = ({ contractId, body }) => new Promise(
  async (resolve, reject) => {
    if ((body.state !== undefined) && (body.state !== 'DRAFT')) {
      reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_CONTRACT_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT));
    }
    try {
      const contractToUpdate = ContractMapper.getContractFromPutContractRequest(contractId, body);
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
  deleteContractById,
  getContractById,
  getContracts,
  sendContractById,
  updateContractById,
};
