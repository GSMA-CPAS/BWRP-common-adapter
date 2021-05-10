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
const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();


/**
 * Show details for a specific Msp
 *
 * @param {String} mspId Id of the MSP to return
 * @return {Promise<ServiceResponse>}
 */
const getDiscoveryMsp = ({mspId}) => new Promise(
  async (resolve, reject) => {
    try {
      const getDiscoveryMSPsResponse = await blockchainAdapterConnection.discovery(mspId);
      resolve(Service.successResponse(getDiscoveryMSPsResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Show a list of all Msps
 *
 * @return {Promise<ServiceResponse>}
 */
const getDiscoveryMsps = () => new Promise(
  async (resolve, reject) => {
    try {
      const getDiscoveryMSPsResponse = await blockchainAdapterConnection.discovery();
      resolve(Service.successResponse(getDiscoveryMSPsResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

module.exports = {
  getDiscoveryMsp,
  getDiscoveryMsps,
};
