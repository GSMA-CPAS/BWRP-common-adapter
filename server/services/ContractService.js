// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/* eslint-disable no-unused-vars */
const Service = require('./Service');
const ContractMapper = require('../core/ContractMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');

const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();

const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

/**
 * Create a new Contract
 *
 * @param {String} url
 * @param {Object} body
 * @return {Promise<ServiceResponse>}
 */
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
 * Delete a Contract By its Id
 *
 * @param {String} contractId The contract Id
 * @return {Promise<ServiceResponse>}
 */
const deleteContractById = ({contractId}) => new Promise(
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
 * @param {String} contractId The contract Id
 * @param {String} format Response format, defaults to JSON if not passed. (optional)
 * @return {Promise<ServiceResponse>}
 */
const getContractById = ({contractId, format}) => new Promise(
  async (resolve, reject) => {
    // TODO: if format == raw
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
      const returnedFormat = (format === 'RAW') ? format : 'JSON';
      if ((returnedFormat === 'RAW') && ((getContractByIdResp.state === 'DRAFT') || (getContractByIdResp.rawData === undefined))) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_CONTRACT_RAW_FORMAT_UNAVAILABLE));
      } else {
        const returnedResponse = ContractMapper.getResponseBodyForGetContract(getContractByIdResp, returnedFormat);
        resolve(Service.successResponse(returnedResponse));
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Show a list of all Contracts
 *
 * @return {Promise<ServiceResponse>}
 */
const getContracts = ({withMSPs, states}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractsResp = await LocalStorageProvider.getContracts({msp: withMSPs, state: states});
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
 * @param {String} contractId The contract Id
 * @return {Promise<ServiceResponse>}
 */
const sendContractById = ({contractId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractByIdResp = await LocalStorageProvider.getContract(contractId);
      if (getContractByIdResp.state !== 'DRAFT') {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_CONTRACT_ONLY_ALLOWED_IN_STATE_DRAFT));
      } else {
        const uploadContractResp = await blockchainAdapterConnection.uploadContract(getContractByIdResp);
        const getStorageKeysResp = await blockchainAdapterConnection.getStorageKeys(uploadContractResp.referenceId, [getContractByIdResp.fromMsp.mspId, getContractByIdResp.toMsp.mspId]);
        const updateContractResp = await LocalStorageProvider.updateSentContract(contractId, uploadContractResp.rawData, uploadContractResp.referenceId, getStorageKeysResp, uploadContractResp.blockchainRef);
        const returnedResponse = ContractMapper.getResponseBodyForSendContract(updateContractResp);
        resolve(Service.successResponse(returnedResponse, 200));
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Update existing Contract
 *
 * @param {String} contractId The contract Id
 * @param {Object} body The Contract Object Payload
 * @return {Promise<ServiceResponse>}
 */
const updateContractById = ({contractId, body}) => new Promise(
  async (resolve, reject) => {
    if ((body.state !== undefined) && (body.state !== 'DRAFT')) {
      reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_CONTRACT_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT));
    } else {
      try {
        const contractToUpdate = ContractMapper.getContractFromPutContractRequest(contractId, body);
        const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);
        const returnedResponse = ContractMapper.getResponseBodyForGetContract(updateContractResp);
        resolve(Service.successResponse(returnedResponse, 200));
      } catch (e) {
        let rejectError = e;
        if (e === errorUtils.ERROR_DAO_NOT_FOUND) {
          // Maybe not found because its state is not DRAFT
          try {
            const existingContract = await LocalStorageProvider.getContract(contractId);
            if (existingContract.state !== 'DRAFT') {
              rejectError = errorUtils.ERROR_BUSINESS_CONTRACT_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT;
            }
          } catch (otherException) {
            // Do nothing ( will return ERROR_DAO_NOT_FOUND )
          }
        }
        reject(Service.rejectResponse(rejectError));
      }
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
