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
const SettlementMapper = require('../core/SettlementMapper');
const LocalStorageProvider = require('../providers/LocalStorageProvider');
const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();
const errorUtils = require('../utils/errorUtils');
const CalculationServiceProvider = require('../providers/CalculationServiceProvider');
const calculationServiceConnection = new CalculationServiceProvider();

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
      const isMspOwnerMyMspId = await blockchainAdapterConnection.isMyMspId(getSettlementByIdResp.mspOwner);
      if (getSettlementByIdResp.state !== 'DRAFT') {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_SETTLEMENT_ONLY_ALLOWED_IN_STATE_DRAFT));
      } else if (!isMspOwnerMyMspId) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_SEND_SETTLEMENT_ONLY_ALLOWED_FOR_MSP_OWNER));
      } else {
        const uploadSettlementResp = await blockchainAdapterConnection.uploadSettlement(getSettlementByIdResp);
        const getStorageKeysResp = await blockchainAdapterConnection.getStorageKeys(uploadSettlementResp.referenceId, [getSettlementByIdResp.mspOwner, getSettlementByIdResp.mspReceiver]);
        const updateSettlementResp = await LocalStorageProvider.updateSentSettlement(settlementId, uploadSettlementResp.rawData, uploadSettlementResp.referenceId, getStorageKeysResp, uploadSettlementResp.blockchainRef);
        const returnedResponse = SettlementMapper.getResponseBodyForSendSettlement(updateSettlementResp);
        resolve(Service.successResponse(returnedResponse, 200));
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
      const usage = await LocalStorageProvider.getUsage(contractId, usageId);
      if ((['SENT', 'RECEIVED'].includes(usage.state)) && (usage.settlementId !== undefined)) {
        reject(Service.rejectResponse(errorUtils.ERROR_BUSINESS_GENERATE_SETTLEMENT_ON_USAGE_WITH_ALREADY_LINKED_SETTLEMENT));
      } else {
        const contract = await LocalStorageProvider.getContract(contractId);
        const getCalculateResultResp = await calculationServiceConnection.getCalculateResult(usage, contract);
        const settlement = SettlementMapper.getSettlementForGenerateUsageById(usage, contract, getCalculateResultResp);
        if (['SENT', 'RECEIVED'].includes(usage.state)) {
          settlement.usageId = usage.id;
        }
        if (mode === 'preview') {
          // Create the returned response from the object that should be stored in LocalStorageProvider
          const returnedResponse = SettlementMapper.getResponseBodyForGetSettlement(settlement);
          resolve(Service.successResponse(returnedResponse));
        } else {
          const createSettlementResp = await LocalStorageProvider.createSettlement(settlement);
          if (['SENT', 'RECEIVED'].includes(usage.state)) {
            // Update usage with the created settlementId
            await LocalStorageProvider.updateUsageWithSettlementId(usageId, createSettlementResp.id);
          }
          if (mode === 'commit') {
            const uploadSettlementResp = await blockchainAdapterConnection.uploadSettlement(createSettlementResp);
            const getStorageKeysResp = await blockchainAdapterConnection.getStorageKeys(uploadSettlementResp.referenceId, [createSettlementResp.mspOwner, createSettlementResp.mspReceiver]);
            const updateSettlementResp = await LocalStorageProvider.updateSentSettlement(createSettlementResp.id, uploadSettlementResp.rawData, uploadSettlementResp.referenceId, getStorageKeysResp, uploadSettlementResp.blockchainRef);
            const returnedResponse = SettlementMapper.getResponseBodyForSendSettlement(updateSettlementResp);
            resolve(Service.successResponse(returnedResponse, 200));
          } else {
            const returnedResponse = SettlementMapper.getResponseBodyForGetSettlement(createSettlementResp);
            resolve(Service.successResponse(returnedResponse));
          }
        }
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
 * @param {String} settlementId The Settlement Id
 * @return {Promise<ServiceResponse>}
 */
const rejectSettlementById = ({contractId, settlementId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getSettlementByIdResp = await LocalStorageProvider.getSettlement(contractId, settlementId);
      const updateSettlementResp = await LocalStorageProvider.updateSettlementWithTag(settlementId, 'REJECTED');
      const returnedResponse = SettlementMapper.getResponseBodyForRejectSettlement(updateSettlementResp);
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
  generateUsageById,
  rejectSettlementById
};
