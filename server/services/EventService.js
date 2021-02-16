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
 * Compare objects timestamps
 *
 * @param {Object} a The first object to compare
 * @param {Object} b The second object to compare
 * @return {Promise<number>}
 */
const compareTimestamp = (a, b) => {
  try {
    /* eslint-disable new-cap */
    /* eslint-disable no-undef */
    const aTimestamp = BigInt(a.timestamp);
    const bTimestamp = BigInt(b.timestamp);
    /* eslint-enable no-undef */
    /* eslint-enable new-cap */
    if (aTimestamp > bTimestamp) {
      return 1;
    } else if (aTimestamp < bTimestamp) {
      return -1;
    } else {
      return 0;
    }
  } catch (sortException) {
    return -1;
  }
};

/**
 * Define the list of blockchain reference Ids to download from the storageKey of a received event
 *
 * @param {String} eventStorageKey The storage key of the received event
 * @param {String} msp The msp of the received event
 * @return {Promise<[String]>}
 */
const getBlockchainReferenceIds = (eventStorageKey, msp) => new Promise(
  async (resolve, reject) => {
    try {
      const getPrivateReferenceIDsResp = await blockchainAdapterConnection.getPrivateReferenceIDs();
      let getBlockchainReferenceIds = [];
      if (getPrivateReferenceIDsResp && Array.isArray(getPrivateReferenceIDsResp)) {
        getBlockchainReferenceIds = getPrivateReferenceIDsResp.filter((privateReferenceID) => {
          if ((eventStorageKey === undefined) || (msp === undefined)) {
            return true;
          } else {
            const eventSK = crypto.createHash('sha256').update(msp + privateReferenceID).digest('hex').toString('utf8');
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
      const referenceIds = await getBlockchainReferenceIds(body.data.storageKey, body.msp);
      logger.info(`[EventService::eventDocumentReceived] referenceIds = ${JSON.stringify(referenceIds)}`);
      const isReferenceIdLinkedToEventTxId = ((body.data.storageKey !== undefined) && (body.msp !== undefined) && (referenceIds.length === 1));
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
      documents = documents.sort(compareTimestamp);
      for (const document of documents) {
        try {
          if (isReferenceIdLinkedToEventTxId) {
            // append blockchainRef to "item"
            const txId = body.txID || 'XXXXXXX'; // incase we using a blockchain adapter that does not return txID;
            document.blockchainRef = {
              type: 'hlf', // need a dynamic way to define type to support future multiledger system
              txId: txId
            };
          }
          const storedDocument = await storeBlockchainDocumentInLocalStorage(document);
          const referenceId = ['contract', 'usage', 'settlement'].includes(storedDocument.type) ? storedDocument.referenceId : undefined;
          logger.info(`[EventService::eventDocumentReceived] config.DEACTIVATE_BLOCKCHAIN_DOCUMENT_DELETE = ${JSON.stringify(config.DEACTIVATE_BLOCKCHAIN_DOCUMENT_DELETE)}`);
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
      if (body.eventName === 'STORE:DOCUMENTHASH') {
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
