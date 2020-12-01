/* eslint-disable no-unused-vars */
const Service = require('./Service');
const ContractMapper = require('../core/ContractMapper');

const LocalStorageProvider = require('../providers/LocalStorageProvider');

const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();

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
 * Get the blockchain documents from the documentIds
 *
 * @param {Object} documentIds The documentIds to download
 * @return {Promise<[Object]>}
 */
const getBlockchainDocuments = (documentIds) => new Promise(
  async (resolve, reject) => {
    try {
      const downloadPromises = [];
      documentIds.forEach((documentId) => {
        downloadPromises.push(blockchainAdapterConnection.getPrivateDocument(documentId));
      });

      const downloadPromisesResponses = await Promise.all(downloadPromises);
      resolve(downloadPromisesResponses);
    } catch (e) {
      reject(e);
    }
  },
);

/**
 * Delete the blockchain documents from the documentIds
 *
 * @param {Object} documentIds The documentIds to download
 * @return {Promise<[Object]>}
 */
const deleteBlockchainDocuments = (documentIds) => new Promise(
  async (resolve, reject) => {
    try {
      const deletePromises = [];
      documentIds.forEach((documentId) => {
        deletePromises.push(blockchainAdapterConnection.deletePrivateDocument(documentId));
      });

      const deletePromisesResponses = await Promise.all(deletePromises);
      resolve(deletePromisesResponses);
    } catch (e) {
      reject(e);
    }
  },
);

/**
 * Store documents in LocalStorage
 *
 * @param {[Object]} documents Documents to store
 * @return {Promise<[String]>}
 */
const storeBlockchainDocumentsInLocalStorage = (documents) => new Promise(
  async (resolve, reject) => {
    try {
      const storePromises = [];
      documents.forEach((document) => {
        if (document.type === 'contract') {
          storePromises.push(LocalStorageProvider.saveReceivedContract(document));
        } else if (document.type === 'usage') {
          storePromises.push(LocalStorageProvider.createUsage(document));
        } else if (document.type === 'settlement') {
          // storePromises.push(LocalStorageProvider.createSettlement(document));
        }
      });

      const storePromisesResponses = await Promise.all(storePromises);
      resolve(storePromisesResponses);
    } catch (e) {
      reject(e);
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
      const documents = await getBlockchainDocuments(documentIds);
      console.log('documents = ', documents);
      const storedDocuments = await storeBlockchainDocumentsInLocalStorage(documents);
      const eventReceivedResp = storedDocuments.map((storedDocument) => {
        return {
          id: storedDocument.id,
          type: storedDocument.type,
          documentId: storedDocument.documentId
        };
      });
      await deleteBlockchainDocuments(documentIds);
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
