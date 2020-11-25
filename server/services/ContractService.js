/* eslint-disable no-unused-vars */
const Service = require('./Service');
const ContractMapper = require('../core/ContractMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');
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
        logger.error( e)
        reject(Service.rejectResponse(
          e.error.message || 'Invalid input',
          e.status || 500,
        ));
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
            logger.error(e)
            reject(Service.rejectResponse(
                e.message || 'Invalid input',
                e.status || 405,
            ));
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
            resolve(Service.successResponse({
                contractID,
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
 * Update existing Contract
 *
 * contractID String The contract ID
 * body ContractRequest Contract Object Payload
 * returns ContractResponse
 * */
const updateContractByID = ({contractID, body}) => new Promise(
    async (resolve, reject) => {
        if ((body.state !== undefined) && (body.state !== 'DRAFT')) {
            const MISSING_MANDATORY_PARAM_ERROR = errorUtils.ERROR_BUSINESS_CONTRACT_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT;
            reject(Service.rejectResponse(MISSING_MANDATORY_PARAM_ERROR));
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
