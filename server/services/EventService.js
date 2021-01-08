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
 * Define the list of blockchain reference Ids to download from the storageKey of a received event
 *
 * @param {String} eventStorageKey The storage key of the received event
 * @return {Promise<[String]>}
 */
const getBlockchainReferenceIds = (eventStorageKey) => new Promise(
  async (resolve, reject) => {
    try {
      const getPrivateReferenceIDsResp = await blockchainAdapterConnection.getPrivateReferenceIDs();
      resolve(getPrivateReferenceIDsResp);
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
      const referenceIds = await getBlockchainReferenceIds(body.data.storageKey);
      logger.info(`[EventService::eventDocumentReceived] referenceIds = ${JSON.stringify(referenceIds)}`);
      const documentsStoredInDbAndDeleteFromBlockchain = [];
      if (referenceIds && Array.isArray(referenceIds)) {
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
        console.log(`[EventService::eventDocumentReceived] documents before sort = ${JSON.stringify(documents)}`);
        documents = documents.sort(compareTimestamp);
        console.log(`[EventService::eventDocumentReceived] document after sort = ${JSON.stringify(documents)}`);
        for (const document of documents) {
          try {
            const storedDocument = await storeBlockchainDocumentInLocalStorage(document);
            const referenceId = (storedDocument.type === 'contract') ? storedDocument.referenceId : undefined;
            const storedDocumentDeletedInBlockchain = await blockchainAdapterConnection.deletePrivateDocument(referenceId);
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
          referenceId: documentStoredInDbAndDeleteFromBlockchain.referenceId
        };
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
      const getContractsResp = await LocalStorageProvider.getContracts({state: 'RECEIVED', storageKey: body.data.storageKey});
      if ((getContractsResp !== undefined) && (Array.isArray(getContractsResp)) && (getContractsResp.length === 1)) {
        // only one contract should be found from the storageKey
        const contract = getContractsResp[0];
        const getContractByIdResp = await LocalStorageProvider.getContract(contract.id);
        const getSignaturesByIdAndMspResp = await blockchainAdapterConnection.getSignatures(contract.referenceId, body.msp);
        const bcSignaturesIndex = Object.keys(getSignaturesByIdAndMspResp);
        const signatureLink = getContractByIdResp.signatureLink;
        let update = false;
        let j = 0;
        for (let i = 0; i < signatureLink.length; i++) {
          if (getContractByIdResp[signatureLink[i]['msp']]['mspId'] == body.msp) {
            if (signatureLink[i]['txId'] == undefined) {
              signatureLink[i]['txId'] = bcSignaturesIndex[j];
              update = true;
            }
            j++;
          }
        }
        if (update) {
          const contractToUpdate = getContractByIdResp;
          contractToUpdate.signatureLink = signatureLink;
          const updateContractResp = await LocalStorageProvider.updateContract(contractToUpdate);
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
