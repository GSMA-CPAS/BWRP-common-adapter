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
* Upload a root certificate
*
 * @param {String} body root certificate.
 * @return {Promise<ServiceResponse>}
* */
const setCertificateRoot = ({body}) => new Promise(
  async (resolve, reject) => {
    try {
      const response = await blockchainAdapterConnection.setCertificateRoot(body);
      resolve(Service.successResponse(response));
    } catch (e) {
      e.message = e.response.data;
      reject(Service.rejectResponse(e, e.response.status));
    }
  },
);


/**
* Upload a certificate revocation list (CRL), revoked certificates are stored on the ledger and cannot be used for signing thereafter
*
 * @param {Object} body The Signature Object Payload
 * @return {Promise<ServiceResponse>}
* */
const submitCertificateRevocationList = ({body}) => new Promise(
  async (resolve, reject) => {
    try {
      const response = await blockchainAdapterConnection.submitCertificateRevocationList(body);
      resolve(Service.successResponse(response));
    } catch (e) {
      e.message = e.response.data;
      reject(Service.rejectResponse(e, e.response.status));
    }
  },
);

module.exports = {
  setCertificateRoot,
  submitCertificateRevocationList,
};
