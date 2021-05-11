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

'use strict';

const logger = require('../logger');

const STUB_MSPS = [
  {
    id: 'TMUS',
    name: 'TMUS',
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-TMUS###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: '',
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-TMUS###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-TMUS###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ''
  },
  {
    id: 'OrdererMSP',
    name: 'OrdererMSP',
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-OrdererMSP###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: '',
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-OrdererMSP###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-OrdererMSP###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ''
  },
  {
    id: 'GSMA',
    name: 'GSMA',
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-GSMA###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: '',
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-GSMA###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-GSMA###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ''
  },
  {
    id: 'DTAG',
    name: 'DTAG',
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-DTAG###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: '',
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-DTAG###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-DTAG###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ''
  }
];

const STUB_PRIVATES_DOCUMENTS = [
  {
    id: 'Stub_Private_doc_ID_1',
    toMSP: 'TMUS',
    fromMSP: 'GSMA',
    data: 'DaaaaaaTaaaaa',
    dataHash: 'HASH__Data',
    timestamp: Date.now()
  },
  {
    id: 'Stub_Private_doc_ID_2',
    toMSP: 'DTAG',
    fromMSP: 'TMUS',
    data: 'OtherData',
    dataHash: 'HASH__OtherData',
    timestamp: Date.now()
  }
];

const STUB_SIGNATURES = [
  {
    signature: 'signature1',
    certificate: '-----BEGIN CERTIFICATE-----\nAAAAMIICYjCCAemgAwIBA...',
    algorithm: 'secp384r1'
  },
  {
    signature: 'signature2',
    certificate: '-----BEGIN CERTIFICATE-----\nBBBBMIICYjCCAemgAwIBA...',
    algorithm: 'secp384r1'
  },
  {
    signature: 'signature3',
    certificate: '-----BEGIN CERTIFICATE-----\nCCCCMIICYjCCAemgAwIBA...',
    algorithm: 'secp384r1'
  }
];

const ERROR_NOT_FOUND = {
  code: 404,
  error: {
    internalErrorCode: 60,
    message: 'MSP not found',
    description: 'MSP not found.'
  }
};

const defineRawDataFromContract = (c) => {
  const stringToEncode = JSON.stringify(c);
  return Buffer.from(stringToEncode).toString('base64');
};

// eslint-disable-next-line no-unused-vars
const defineContractFromRawData = (d) => {
  const stringToParse = Buffer.from(d, 'base64').toString();
  return JSON.parse(stringToParse);
};

class BlockchainAdapterProvider {
  constructor() {
    logger.info('[StubBlockchainAdapterProvider::constructor] You\'re running a Stub version of BlockchainAdapterProvider');
  }

  /**
   *
   * @param {String} msp
   * @return {Promise<[string]|Object>}
   */
  async discovery(msp) {
    try {
      let response;
      if (msp) {
        response = STUB_MSPS.filter((MSP) => (MSP.id === msp))[0];
        if (response === undefined) {
          throw ERROR_NOT_FOUND;
        }
      } else {
        response = STUB_MSPS.map((MSP) => MSP.id);
      }
      return response;
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::discovery] failed to discover msp - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @return {Promise<[string]>}
   */
  async getPrivateReferenceIDs() {
    try {
      const ids = STUB_PRIVATES_DOCUMENTS.map((doc) => doc.id);
      return ids;
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::getPrivateReferenceIDs] failed to get documents - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @return {Promise<Object>}
   */
  async getPrivateDocument(referenceId) {
    try {
      const response = STUB_PRIVATES_DOCUMENTS.filter((doc) => (doc.id === referenceId))[0];
      if (response === undefined) {
        throw ERROR_NOT_FOUND;
      }
      return response;
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::getPrivateDocument] failed to get document - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @return {Promise<string>}
   */
  async deletePrivateDocument(referenceId) {
    try {
      const response = STUB_PRIVATES_DOCUMENTS.filter((doc) => (doc.id === referenceId))[0];
      if (response === undefined) {
        throw ERROR_NOT_FOUND;
      }
      return {};
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::deletePrivateDocument] failed to get document - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} toMSP
   * @param {String} dataBase64
   * @return {Promise<Object>}
   */
  async uploadPrivateDocument(toMSP, dataBase64) {
    try {
      const response = {
        id: 'Stub_Private_doc_ID_3',
        toMSP: toMSP,
        fromMSP: 'GSMA',
        data: 'decodedData?',
        dataHash: dataBase64,
        timestamp: Date.now()
      };
      return response;
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::uploadPrivateDocument] failed to upload document - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} contract
   * @return {Promise<object>}
   */
  async uploadContract(contract) {
    try {
      const rawData = defineRawDataFromContract(contract);
      const randomValue = ((Math.random() * 65535) | 1).toString(16);
      const formatedRandomValue = ('000' + randomValue).slice(-4).toLowerCase();
      const blockchainResp = {
        'documentID': '1d5dde7bf9d52cc804ac89ca93c0143282386b6328e074e7ea209b16ed8d' + formatedRandomValue
      };
      return {
        rawData,
        referenceId: blockchainResp.documentID
      };
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::uploadContract] failed to upload contract - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @param {String} msp
   * @return {Promise<Object>}
   */
  async getSignatures(referenceId, msp) {
    try {
      const response = STUB_SIGNATURES;
      return response;
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::getSignatures] failed to get signatures - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} referenceId
   * @param {String} certificate
   * @param {String} algorithm
   * @param {String} signature
   * @return {Promise<Object>}
   */
  async uploadSignature(referenceId, certificate, algorithm, signature) {
    try {
      const response = {
        certificate: certificate,
        algorithm: algorithm,
        signature: signature,
      };
      return response;
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::uploadSignature] failed to upload signature - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {String} eventName
   * @param {String} callbackUrl
   * @return {Promise<string>}
   */
  async webhookSubscribe(eventName, callbackUrl) {
    try {
      const response = '2531329f-fb09-4ef7-887e-84e648214436';
      return response;
    } catch (error) {
      logger.error('[StubBlockchainAdapterProvider::webhookSubscribe] failed to subscribe - %s', error.message);
      throw error;
    }
  }

  /**
   *
   * @return {Promise<void>}
   */
  async 'initialize'() {
  }
}

module.exports = BlockchainAdapterProvider;
