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

const config = require('../config');
const crypto = require('crypto');

/**
 * Compare objects blockchainRef timestamps
 *
 * @param {Object} a The first object to compare
 * @param {Object} b The second object to compare
 * @return {Promise<number>}
 */
const compareBlockchainRefTimestamp = (a, b) => {
  try {
    /* eslint-disable new-cap */
    /* eslint-disable no-undef */
    const aDate = new Date(a.blockchainRef.timestamp);
    const bDate = new Date(b.blockchainRef.timestamp);
    /* eslint-enable no-undef */
    /* eslint-enable new-cap */
    if (aDate > bDate) {
      return 1;
    } else if (aDate < bDate) {
      return -1;
    } else {
      return 0;
    }
  } catch (sortException) {
    return -1;
  }
};

/**
 * Define the list of blockchain reference Ids to download from storageKey and msp of a received event
 * if storageKey or msp are undefined, returns all the blockchainReferenceIds
 *
 * @param {String|undefined} eventStorageKey The storage key of the received event
 * @param {String|undefined} msp The msp of the received event
 * @return {Promise<[String]>}
 */
const getBlockchainReferenceIds = (eventStorageKey = undefined, msp = undefined) => new Promise(
  async (resolve, reject) => {
    try {
      const getPrivateReferenceIDsResp = await blockchainAdapterConnection.getPrivateReferenceIDs();
      let getBlockchainReferenceIds = [];
      if (getPrivateReferenceIDsResp && Array.isArray(getPrivateReferenceIDsResp)) {
        getBlockchainReferenceIds = getPrivateReferenceIDsResp.filter((privateReferenceID) => {
          if ((eventStorageKey === undefined) || (msp === undefined)) {
            return true;
          } else {
            const eventSK = crypto.createHash('sha256').update(msp + ':' + privateReferenceID).digest('hex').toString('utf8');
            return (eventSK === eventStorageKey);
          }
        });
      }
      resolve(getBlockchainReferenceIds);
    } catch (e) {
      reject(e);
    }
  },
);

/**
 * Store document in LocalStorage
 *
 * @param {Object} document Document to store
 * @return {Promise<[String]>}
 */
const storeBlockchainDocumentInLocalStorage = (document) => new Promise(
  async (resolve, reject) => {
    try {
      let returnedResponse = undefined;
      if (document.type === 'contract') {
        const existsContract = await LocalStorageProvider.existsContract({referenceId: document.referenceId});
        if (existsContract) {
          returnedResponse = await LocalStorageProvider.findContractByReferenceId(document.referenceId, {rawData: document.rawData});
        } else {
          document.storageKeys = await blockchainAdapterConnection.getStorageKeys(document.referenceId, [document.fromMsp.mspId, document.toMsp.mspId]);
          returnedResponse = await LocalStorageProvider.saveReceivedContract(document);
        }
      } else if (document.type === 'usage') {
        // returnedResponse = await LocalStorageProvider.createUsage(document);
        const existsUsage = await LocalStorageProvider.existsUsage({referenceId: document.referenceId});
        const findContractByReferenceIdResp = await LocalStorageProvider.findContractByReferenceId(document.contractReferenceId);
        document.contractId = findContractByReferenceIdResp.id;
        if (existsUsage) {
          returnedResponse = await LocalStorageProvider.findUsageByReferenceId(document.referenceId, {rawData: document.rawData});
        } else {
          document.storageKeys = await blockchainAdapterConnection.getStorageKeys(document.referenceId, [document.mspOwner, document.mspReceiver]);
          returnedResponse = await LocalStorageProvider.saveReceivedUsage(document);

          // set this usage as partnerUsage of the last send usage
          const lastSentUsage = await LocalStorageProvider.getLastSentUsage(returnedResponse.contractId);
          if ( lastSentUsage ) {
            const updateUsageWithPartnerUsageIdResp = await LocalStorageProvider.updateUsageWithPartnerUsageId(lastSentUsage.id, returnedResponse.id);
          }
        }
      } else if (document.type === 'settlement') {
        // storePromises.push(LocalStorageProvider.createSettlement(document));
        // returnedResponse = await LocalStorageProvider.createSettlement(document);
        const existsSettlement = await LocalStorageProvider.existsSettlement({referenceId: document.referenceId});
        const findContractByReferenceIdResp = await LocalStorageProvider.findContractByReferenceId(document.contractReferenceId);
        document.contractId = findContractByReferenceIdResp.id;
        if (existsSettlement) {
          returnedResponse = await LocalStorageProvider.findSettlementByReferenceId(document.referenceId, {rawData: document.rawData});
        } else {
          document.storageKeys = await blockchainAdapterConnection.getStorageKeys(document.referenceId, [document.mspOwner, document.mspReceiver]);
          returnedResponse = await LocalStorageProvider.saveReceivedSettlement(document);
        }
      }
      if (returnedResponse !== undefined) {
        // STATE = something in DB represents this document
        resolve(returnedResponse);
      } else {
        // STATE = the document is not in the DB
        reject(errorUtils.ERROR_BUSINESS_DOCUMENT_UPSERT_FAILURE);
      }
    } catch (e) {
      // STATE = the document is not in the DB
      reject(errorUtils.ERROR_BUSINESS_DOCUMENT_UPSERT_FAILURE);
    }
  },
);

/**
 * Webhook callback
 *
 * @param {Object} body Content of the received event
 * @return {Promise<ServiceResponse>}
 */
const eventDocumentReceived = ({body}) => new Promise(
  async (resolve, reject) => {
    try {
      const documentsStoredInDb = [];
      // Do not send storageKey and msp params to do not filter this BlockchainReferenceIds
      const referenceIds = await getBlockchainReferenceIds();
      let documents = [];
      for (const referenceId of referenceIds) {
        try {
          const document = await blockchainAdapterConnection.getPrivateDocument(referenceId);
          documents.push(document);
        } catch (exceptionInGetDocumentById) {
          logger.error(`[EventService::eventDocumentReceived] non-blocking error exceptionInGetDocumentById for referenceId ${referenceId} = ${JSON.stringify(exceptionInGetDocumentById)}`);
          // Do not reject. If there is an exception for a referenceId, the document will not be removed of the blockchain.
        }
      }
      documents = documents.sort(compareBlockchainRefTimestamp);
      for (const document of documents) {
        try {
          const storedDocument = await storeBlockchainDocumentInLocalStorage(document);
          const referenceId = ['contract', 'usage', 'settlement'].includes(storedDocument.type) ? storedDocument.referenceId : undefined;
          if (config.DEACTIVATE_BLOCKCHAIN_DOCUMENT_DELETE) {
            // Do not delete private document in blockchain
            logger.info(`[EventService::eventDocumentReceived] document stored in DB but not deleted in Blockchain = ${JSON.stringify(storedDocument)}`);
          } else if (referenceId !== undefined) {
            await blockchainAdapterConnection.deletePrivateDocument(referenceId);
            logger.info(`[EventService::eventDocumentReceived] document stored in DB successfully deleted in Blockchain = ${JSON.stringify(storedDocument)}`);
          }
          documentsStoredInDb.push(storedDocument);
        } catch (exceptionInStoreAndDeleteDocument) {
          logger.error(`[EventService::eventDocumentReceived] non-blocking error exceptionInStoreAndDeleteDocument for document = ${JSON.stringify(document)}`);
          // Do not reject. If there is an exception for a document, the document will not be removed of the blockchain.
        }
      }
      const eventReceivedResp = documentsStoredInDb.map((documentStoredInDb) => {
        const returnedDoc = {
          id: documentStoredInDb.id,
          type: documentStoredInDb.type,
          referenceId: documentStoredInDb.referenceId
        };
        if (documentStoredInDb.contractId !== undefined) {
          returnedDoc.contractId = documentStoredInDb.contractId;
        }
        return returnedDoc;
      });
      resolve(Service.successResponse(eventReceivedResp, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

const eventSignatureReceived = ({body}) => new Promise(
  async (resolve, reject) => {
    try {
      const getContractsResp = await LocalStorageProvider.getContracts({state: ['RECEIVED', 'SENT'], storageKey: body.data.storageKey});
      if ((getContractsResp !== undefined) && (Array.isArray(getContractsResp)) && (getContractsResp.length === 1)) {
        // only one contract should be found from the storageKey
        const contract = getContractsResp[0];
        const getContractByIdResp = await LocalStorageProvider.getContract(contract.id);
        const getSignaturesByIdAndMspResp = await blockchainAdapterConnection.getSignatures(contract.referenceId, body.msp);
        const mspParamName = (getContractByIdResp.fromMsp.mspId === body.msp) ? 'fromMsp' : 'toMsp';
        let update = false;
        Object.keys(getSignaturesByIdAndMspResp).forEach((getSignaturesByIdAndMspRespKey) => {
          const alreadyExistingSignatureLink = getContractByIdResp.signatureLink.filter((signatureLink) => {
            return ((signatureLink.msp === mspParamName) && (signatureLink.txId === getSignaturesByIdAndMspRespKey));
          })[0];
          if (alreadyExistingSignatureLink !== undefined) {
            // This signature already exists
            // Do nothing more
          } else {
            // This signature must be added
            const firstSignatureLinkWithoutTxId = getContractByIdResp.signatureLink.filter((signatureLink) => {
              return ((signatureLink.msp === mspParamName) && (signatureLink.txId === undefined));
            })[0];
            if (firstSignatureLinkWithoutTxId === undefined) {
              // There is no more signatureLink without txId
              // Do nothing for this new incoming unexpected signature
            } else {
              firstSignatureLinkWithoutTxId.txId = getSignaturesByIdAndMspRespKey;
              update = true;
            }
          }
        });
        if (update) {
          const contractToUpdate = getContractByIdResp;
          contractToUpdate.signatureLink = getContractByIdResp.signatureLink;
          await LocalStorageProvider.updateContract(contractToUpdate);
        }
      }

      const getUsageResp = await LocalStorageProvider.findUsages({state: ['RECEIVED', 'SENT'], storageKey: body.data.storageKey});
      if ((getUsageResp !== undefined) && (Array.isArray(getUsageResp)) && (getUsageResp.length === 1)) {
        const usage = getUsageResp[0];
        const getUsageByIdResp = await LocalStorageProvider.getUsageByUsageId(usage.id);
        const getSignaturesByIdAndMspResp = await blockchainAdapterConnection.getSignatures(usage.referenceId, body.msp);
        const mspParamName = (getUsageByIdResp.mspOwner === body.msp) ? 'fromMsp' : 'toMsp';
        let update = false;
        Object.keys(getSignaturesByIdAndMspResp).forEach((getSignaturesByIdAndMspRespKey) => {
          const alreadyExistingSignatureLink = getUsageByIdResp.signatureLink.filter((signatureLink) => {
            return ((signatureLink.msp === mspParamName) && (signatureLink.txId === getSignaturesByIdAndMspRespKey));
          })[0];
          if (alreadyExistingSignatureLink !== undefined) {
            // This signature already exists
            // Do nothing more
          } else {
            // This signature must be added
            const firstSignatureLinkWithoutTxId = getUsageByIdResp.signatureLink.filter((signatureLink) => {
              return ((signatureLink.msp === mspParamName) && (signatureLink.txId === undefined));
            })[0];
            if (firstSignatureLinkWithoutTxId === undefined) {
              // There is no more signatureLink without txId
              // Do nothing for this new incoming unexpected signature
            } else {
              firstSignatureLinkWithoutTxId.txId = getSignaturesByIdAndMspRespKey;
              update = true;
            }
          }
        });
        if (update) {
          const usageToUpdate = getUsageByIdResp;
          usageToUpdate.signatureLink = getUsageByIdResp.signatureLink;
          const updateUsageResp = await LocalStorageProvider.updateUsage(usageToUpdate);

          // BUSINESS rule: if all signatures are signed, set tag to APPROVED
          let performUpdate = false;
          if (config.IS_USAGE_APPROVED_MODE) {
            const unsignedNumber = updateUsageResp.signatureLink.filter((signature) => (signature['txId'] === undefined)).length;
            if (unsignedNumber == 0) {
              performUpdate = true;
            }
          } else {
            const unsignedNumber = updateUsageResp.signatureLink.filter((signature) => (signature['txId'] !== undefined)).length;
            if (unsignedNumber > 0) {
              performUpdate = true;
            }
          }

          if (performUpdate) {
            const updateUsageWithTagResp = await LocalStorageProvider.updateUsageWithTag(updateUsageResp.id, 'APPROVED');

            let signatureSent = 0;
            let signatureReceived = 0;
            const sentUsage = await LocalStorageProvider.getUsages(usageToUpdate.contractId, {state: 'SENT'});
            if ((sentUsage !== undefined) && (Array.isArray(sentUsage))) {
              sentUsage.forEach((usage) => {
                if (usage.tag=='APPROVED') {
                  signatureSent++;
                }
              });
            }

            const receivedUsage = await LocalStorageProvider.getUsages(usageToUpdate.contractId, {state: 'RECEIVED'});
            if ((receivedUsage !== undefined) && (Array.isArray(receivedUsage))) {
              receivedUsage.forEach((usage) => {
                if (usage.tag=='APPROVED') {
                  signatureReceived++;
                }
              });
            }
            if (signatureSent >= 1 && signatureReceived >= 1) {
              await LocalStorageProvider.updateContractIsUsageApproved(usageToUpdate.contractId, true);
            }
          }
        }
      }
      resolve(Service.successResponse({}, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);


/**
 * Webhook callback
 *
 * @param {Object} body Content of the received event
 * @return {Promise<ServiceResponse>}
 */
const eventReceived = ({body}) => new Promise(
  async (resolve, reject) => {
    try {
      if (body.eventName === 'STORE:PAYLOADLINK') {
        resolve(await eventDocumentReceived({body}));
      } else if (body.eventName === 'STORE:SIGNATURE') {
        resolve(await eventSignatureReceived({body}));
      } else {
        // resolve(await eventDocumentReceived({body}));
        reject(Service.rejectResponse({}));
      }
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/**
 * Subscribe to events
 *
 * @return {Promise<ServiceResponse>}
 */
const subscribe = () => new Promise(
  async (resolve, reject) => {
    try {
      if (config.SELF_MSPID.length <= 0) {
        config.SELF_MSPID = await blockchainAdapterConnection.getSelfMspId();
      }
      const subscribeResp = await blockchainAdapterConnection.subscribe();
      resolve(Service.successResponse(subscribeResp, 200));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

module.exports = {
  eventReceived,
  subscribe
};
