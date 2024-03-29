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
      } else {
        const isFromMspIdMyMspId = await blockchainAdapterConnection.isMyMspId(getContractByIdResp.fromMsp.mspId);
        const mspOwner = isFromMspIdMyMspId ? getContractByIdResp.fromMsp.mspId : getContractByIdResp.toMsp.mspId;
        const mspReceiver = isFromMspIdMyMspId ? getContractByIdResp.toMsp.mspId : getContractByIdResp.fromMsp.mspId;
        const usageToCreate = UsageMapper.getUsageFromPostUsagesRequest(contractId, body, mspOwner, mspReceiver);

        const createUsageResp = await LocalStorageProvider.createUsage(usageToCreate);
        const returnedResponse = UsageMapper.getResponseBodyForGetUsage(createUsageResp);
        await LocalStorageProvider.updateContractIsUsageApproved(createUsageResp.contractId, false);
        const returnedHeaders = {
          'Content-Location': `${url.replace(/\/$/, '')}/${createUsageResp.id}`
        };
        resolve(Service.successResponse(returnedResponse, 201, returnedHeaders));
      }
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
      const deleteUsageByIdResp = await LocalStorageProvider.deleteUsage(contractId, usageId);
      const returnedResponse = UsageMapper.getResponseBodyForGetUsage(deleteUsageByIdResp);
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
 * @param {String} format Response format, defaults to JSON if not passed. (optional)
 * @return {Promise<ServiceResponse>}
 */
const getUsageById = ({contractId, usageId, format}) => new Promise(
  async (resolve, reject) => {
    try {
      const getUsageByIdResp = await LocalStorageProvider.getUsage(contractId, usageId);
      const returnedFormat = (format === 'RAW') ? format : 'JSON';
      if ((returnedFormat === 'RAW') && ((getUsageByIdResp.state === 'DRAFT') || (getUsageByIdResp.rawData === undefined))) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_USAGE_RAW_FORMAT_UNAVAILABLE));
      } else {
        const returnedResponse = UsageMapper.getResponseBodyForGetUsage(getUsageByIdResp, returnedFormat);
        resolve(Service.successResponse(returnedResponse));
      }
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
const getUsages = ({contractId, states}) => new Promise(
  async (resolve, reject) => {
    try {
      // Only to check that the contract exists and to return not found error in this case
      await LocalStorageProvider.getContract(contractId);
      const getUsagesResp = await LocalStorageProvider.getUsages(contractId, {state: states});
      const returnedResponse = UsageMapper.getResponseBodyForGetUsages(getUsagesResp);
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
 * @param {String} usageId The Usage Id
 * @return {Promise<ServiceResponse>}
 */
const sendUsageById = ({contractId, usageId}) => new Promise(
  async (resolve, reject) => {
    try {
      const contract = await LocalStorageProvider.getContract(contractId);
      if ((contract.state === 'DRAFT') || (contract.referenceId === undefined)) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_USAGE_ONLY_ALLOWED_ON_EXCHANGED_CONTRACT));
      } else {
        let usageToSend = await LocalStorageProvider.getUsage(contractId, usageId);
        const isMspOwnerMyMspId = await blockchainAdapterConnection.isMyMspId(usageToSend.mspOwner);
        if (usageToSend.state !== 'DRAFT') {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_USAGE_ONLY_ALLOWED_IN_STATE_DRAFT));
        } else if (!isMspOwnerMyMspId) {
          reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_USAGE_ONLY_ALLOWED_FOR_MSP_OWNER));
        } else {
          if (usageToSend.contractReferenceId === undefined) {
            usageToSend = await LocalStorageProvider.updateUsageWithContractReferenceId(usageId, contract.referenceId);
          }
          const uploadUsageResp = await blockchainAdapterConnection.uploadUsage(usageToSend);
          const getStorageKeysResp = await blockchainAdapterConnection.getStorageKeys(uploadUsageResp.referenceId, [usageToSend.mspOwner, usageToSend.mspReceiver]);
          // set last received usage as partnerUsageId if exists
          const lastReceivedUsage = await LocalStorageProvider.getLastReceivedUsage(contractId);

          const updateUsageResp = await LocalStorageProvider.updateSentUsage(
            usageId,
            uploadUsageResp.rawData,
            uploadUsageResp.referenceId,
            getStorageKeysResp,
            uploadUsageResp.blockchainRef,
            lastReceivedUsage);
          const returnedResponse = UsageMapper.getResponseBodyForSendUsage(updateUsageResp);
          resolve(Service.successResponse(returnedResponse, 200));
        }
      }
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
      const getUsageByIdResp = await LocalStorageProvider.getUsage(contractId, usageId);
      if ((body.state !== undefined) && !((getUsageByIdResp.state == 'DRAFT') && (body.state == 'DRAFT'))) {
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

/**
 * Set Tag to \"REJECTED\"
 *
 * @param {String} contractId The contract Id
 * @param {String} usageId The Usage Id
 * @return {Promise<ServiceResponse>}
 */
const rejectUsageById = ({contractId, usageId}) => new Promise(
  async (resolve, reject) => {
    try {
      let usageToReject = await LocalStorageProvider.getUsage(contractId, usageId);
      usageToReject = await LocalStorageProvider.updateUsageWithTag(usageId, 'REJECTED');
      const returnedResponse = UsageMapper.getResponseBodyForRejectUsage(usageToReject);
      resolve(Service.successResponse(returnedResponse, 200));
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
  sendUsageById,
  updateUsageById,
  rejectUsageById
};
