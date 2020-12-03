/* eslint-disable no-unused-vars */
const Service = require('./Service');
const ContractMapper = require('../core/ContractMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');

const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();

const logger = require('../logger');
const errorUtils = require('../utils/errorUtils');

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
 * Define the list of blockchain document Ids to download from the storageKey of a received event
 *
 * @param {String} eventStorageKey The storage key of the received event
 * @return {Promise<[String]>}
 */
const getBlockchainDocumentIds = (eventStorageKey) => new Promise(
  async (resolve, reject) => {
    try {
      const getPrivateDocumentIDsResp = await blockchainAdapterConnection.getPrivateDocumentIDs();
      resolve(getPrivateDocumentIDsResp);
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
        returnedResponse = await LocalStorageProvider.saveReceivedContract(document);
      } else if (document.type === 'usage') {
        returnedResponse = await LocalStorageProvider.createUsage(document);
      } else if (document.type === 'settlement') {
        // storePromises.push(LocalStorageProvider.createSettlement(document));
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
      const documentIds = await getBlockchainDocumentIds(body.data.storageKey);
      logger.info(`[EventService::eventDocumentReceived] documentIds = ${JSON.stringify(documentIds)}`);
      const documentsStoredInDbAndDeleteFromBlockchain = [];
      if (documentIds && Array.isArray(documentIds)) {
        let documents = [];
        for (const documentId of documentIds) {
          try {
            const document = await blockchainAdapterConnection.getPrivateDocument(documentId);
            documents.push(document);
          } catch (exceptionInGetDocumentById) {
            logger.error(`[EventService::eventDocumentReceived] non-blocking error exceptionInGetDocumentById for documentId ${documentId} = ${JSON.stringify(exceptionInGetDocumentById)}`);
            // Do not reject. If there is an exception for a documentId, the document will not be removed of the blockchain.
          }
        }
        console.log(`[EventService::eventDocumentReceived] documents before sort = ${JSON.stringify(documents)}`);
        documents = documents.sort(compareTimestamp);
        console.log(`[EventService::eventDocumentReceived] document after sort = ${JSON.stringify(documents)}`);
        for (const document of documents) {
          try {
            const storedDocument = await storeBlockchainDocumentInLocalStorage(document);
            const documentId = (storedDocument.type === 'contract') ? storedDocument.documentId : undefined;
            const storedDocumentDeletedInBlockchain = await blockchainAdapterConnection.deletePrivateDocument(documentId);
            documentsStoredInDbAndDeleteFromBlockchain.push(storedDocument);
            logger.info(`[EventService::eventDocumentReceived] document stored in DB successfully deleted in Blockchain = ${JSON.stringify(storedDocument)}`);
          } catch (exceptionInStoreAndDeleteDocument) {
            logger.error(`[EventService::eventDocumentReceived] non-blocking error exceptionInStoreAndDeleteDocument for document = ${JSON.stringify(document)}`);
            // Do not reject. If there is an exception for a document, the document will not be removed of the blockchain.
          }
        }
      }
      const eventReceivedResp = documentsStoredInDbAndDeleteFromBlockchain.map((documentStoredInDbAndDeleteFromBlockchain) => {
        return {
          id: documentStoredInDbAndDeleteFromBlockchain.id,
          type: documentStoredInDbAndDeleteFromBlockchain.type,
          documentId: documentStoredInDbAndDeleteFromBlockchain.documentId
        };
      });
      resolve(Service.successResponse(eventReceivedResp, 200));
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
        // resolve(await eventDocumentReceived({body}));
        reject(Service.rejectResponse({}));
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
