'use strict';

const logger = require('../logger');

const STUB_MSPS = [
  {
    id: "TMUS",
    name: "TMUS",
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-TMUS###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: "",
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-TMUS###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-TMUS###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ""
  },
  {
    id: "OrdererMSP",
    name: "OrdererMSP",
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-OrdererMSP###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: "",
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-OrdererMSP###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-OrdererMSP###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ""
  },
  {
    id: "GSMA",
    name: "GSMA",
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-GSMA###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: "",
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-GSMA###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-GSMA###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ""
  },
  {
    id: "DTAG",
    name: "DTAG",
    organizationalUnitIdentifiers: [],
    rootCerts: `-----BEGIN CERTIFICATE-----\n###ROOT-CERT-DTAG###\n-----END CERTIFICATE-----\n`,
    intermediateCerts: "",
    admins: `-----BEGIN CERTIFICATE-----\n###ADMIN-CERT-DTAG###\n-----END CERTIFICATE-----\n`,
    tlsRootCerts: `-----BEGIN CERTIFICATE-----\n###TLS-ROOT-CERT-DTAG###\n-----END CERTIFICATE-----\n`,
    tlsIntermediateCerts: ""
  }
]

const STUB_PRIVATES_DOCUMENTS = [
  {
    id: "Stub_Private_doc_ID_1",
    toMSP: "TMUS",
    fromMSP: "GSMA",
    data: "DaaaaaaTaaaaa",
    dataHash: "HASH__Data",
    timestamp: Date.now()
  },
  {
    id: "Stub_Private_doc_ID_2",
    toMSP: "DTAG",
    fromMSP: "TMUS",
    data: "OtherData",
    dataHash: "HASH__OtherData",
    timestamp: Date.now()
  }
];

const STUB_SIGNATURES = [
  {
    signature: "signature1",
    certificate: "-----BEGIN CERTIFICATE-----\nAAAAMIICYjCCAemgAwIBA...",
    algorithm: "secp384r1"
  },
  {
    signature: "signature2",
    certificate: "-----BEGIN CERTIFICATE-----\nBBBBMIICYjCCAemgAwIBA...",
    algorithm: "secp384r1"
  },
  {
    signature: "signature3",
    certificate: "-----BEGIN CERTIFICATE-----\nCCCCMIICYjCCAemgAwIBA...",
    algorithm: "secp384r1"
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


class BlockchainAdapterProvider {

    constructor() {
      logger.info('[StubBlockchainAdapterProvider::constructor] You\'re running a Stub version of BlockchainAdapterProvider');
    }

    /**
     *
     * @param msp
     * @returns {Promise<string>}
     */
    async discovery(msp) {
      try {
        let response;
        if (msp) {
          response = STUB_MSPS.filter(MSP => (MSP.id === msp))[0];
          if (response === undefined) {
            throw ERROR_NOT_FOUND;
          }
        } else {
          response = STUB_MSPS.map(MSP => MSP.id);
        }
        return response;
      } catch (error) {
        logger.error('[StubBlockchainAdapterProvider::discovery] failed to discover msp - %s', error.message);
        throw error;
      }
    }

    /**
     *
     * @returns {Promise<string>}
     */
    async getPrivateDocumentIDs() {
      try {
        const ids = STUB_PRIVATES_DOCUMENTS.map(doc => doc.id);
        return ids; 
      } catch (error) {
        logger.error('[StubBlockchainAdapterProvider::getPrivateDocumentIDs] failed to get documents - %s', error.message);
        throw error;
      }
    }

    /**
     *
     * @param documentId
     * @returns {Promise<string>}
     */
    async getPrivateDocument(documentId) {
      try {
        let response = STUB_PRIVATES_DOCUMENTS.filter(doc => (doc.id === msp))[0];
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
     * @param documentId
     * @returns {Promise<string>}
     */
    async deletePrivateDocument(documentId) {
      try {
        let response = STUB_PRIVATES_DOCUMENTS.filter(doc => (doc.id === msp))[0];
        if (response === undefined) {
          throw ERROR_NOT_FOUND;
        }
        STUB_PRIVATES_DOCUMENTS.push()
        return {};
      } catch (error) {
          logger.error('[StubBlockchainAdapterProvider::deletePrivateDocument] failed to get document - %s', error.message);
          throw error;
      }
    }

    /**
     *
     * @param toMSP
     * @param dataBase64
     * @returns {Promise<string>}
     */
    async uploadPrivateDocument(toMSP, dataBase64) {
      try {
        const response = {
          id: "Stub_Private_doc_ID_3",
          toMSP: toMSP,
          fromMSP: "GSMA",
          data: "decodedData?",
          dataHash: dataBase64,
          timestamp: Date.now()
        }
        return response;
      } catch (error) {
          logger.error('[StubBlockchainAdapterProvider::uploadPrivateDocument] failed to upload document - %s', error.message);
          throw error;
      }
    }

    /**
     *
     * @param documentId
     * @param msp
     * @returns {Promise<string>}
     */
    async getSignatures(documentId, msp) {
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
     * @param documentId
     * @param certificate
     * @param algorithm
     * @param signature
     * @returns {Promise<string>}
     */
    async uploadSignature(documentId, certificate, algorithm, signature) {
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
     * @param callbackUrl
     * @param eventName
     * @returns {Promise<string>}
     */
    async webhookSubscribe(eventName, callbackUrl) {
      try {
        const response = "2531329f-fb09-4ef7-887e-84e648214436";
        return response;
      } catch (error) {
        logger.error('[StubBlockchainAdapterProvider::webhookSubscribe] failed to subscribe - %s', error.message);
        throw error;
      }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async initialize() {
    }
}

module.exports = BlockchainAdapterProvider;