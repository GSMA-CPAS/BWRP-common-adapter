const Service = require('./Service');

/** Fetch a private document from the database, identified by its id
   * @param {string} id - The document ID
   * @return {PrivateDocumentResponse}
  */
const fetchPrivateDocument = ({id}) => new Promise(
    async (resolve, reject) => {
      const blockchainConnection = new BlockchainService(process.env.BSA_CCP);

      blockchainConnection.fetchPrivateDocument(id)
          .then( (document) => {
            resolve(Service.successResponse(document, 200));
          }).catch((error) => {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({'message': error.toString()}, 500));
          }).finally( () => {
            blockchainConnection.disconnect();
          });
    },
);

/** show last n private documents
   * @return {PrivateDocumentResponse[]}
  */
const fetchPrivateDocuments = () => new Promise(
    async (resolve, reject) => {
      const blockchainConnection = new BlockchainService(process.env.BSA_CCP);

      blockchainConnection.fetchPrivateDocuments()
          .then( (documents) => {
            resolve(Service.successResponse(documents, 200));
          }).catch((error) => {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({'message': error.toString()}, 500));
          }).finally( () => {
            blockchainConnection.disconnect();
          });
    },
);

/** Fetch all signatures for a given msp and a given document id from the ledger
   * @param {string} id - The document ID
   * @param {string} msp - A MSP name
   * @return {string}
  */
const fetchSignatures = ({id, msp}) => new Promise(
    async (resolve, reject) => {
      const blockchainConnection = new BlockchainService(process.env.BSA_CCP);

      blockchainConnection.fetchSignatures(msp, id)
          .then( (signatures) => {
            resolve(Service.successResponse(signatures, 200));
          }).catch((error) => {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse( {'message': error.toString()}, 500));
          }).finally( () => {
            blockchainConnection.disconnect();
          });
    },
);

/** Upload a private document, shared between our own organization and a partner MSP
   * @param {PrivateDocument} body - A document that should be uploaded
   * @return {string}
  */
const uploadPrivateDocument = ({body}) => new Promise(
    async (resolve, reject) => {
      const blockchainConnection = new BlockchainService(process.env.BSA_CCP);

      blockchainConnection.addDocument(body['toMSP'], body['data'])
          .then( (documentID) => {
            const resJSON = {};
            resJSON['documentID'] = documentID;
            console.log('> both parties stored data with ID ' + documentID);
            resolve(Service.successResponse(resJSON, 200));
          }).catch((error) => {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({'message': error.toString()}, 500));
          }).finally( () => {
            blockchainConnection.disconnect();
          });
    },
);

/** Store a signature for the document identified by id on the ledger
   * @param {string} id - The document ID
   * @param {DocumentSignature} body - a document signature that should be uploaded
   * @return {string}
  */
const uploadSignature = ({id, body}) => new Promise(
    async (resolve, reject) => {
      const blockchainConnection = new BlockchainService(process.env.BSA_CCP);

      // for security reasons, rewrite the json here:
      const signature = {
        'algorithm': body['algorithm'],
        'certificate': body['certificate'],
        'signature': body['signature'],
      };
      const signatureJSON = JSON.stringify(signature);

      blockchainConnection.signDocument(id, signatureJSON)
          .then( (txID) => {
            const resJSON = {};
            resJSON['txID'] = txID;
            console.log('> stored signature with txID ' + txID);
            resolve(Service.successResponse(resJSON, 200))
            ;
          }).catch((error) => {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({'message': error.toString()}, 500));
          }).finally( () => {
            blockchainConnection.disconnect();
          });
    },
);




const getContracts = () => new Promise(
    async (resolve, _) => {
        const stub_response = [
            { 'contract_id': '12345' },
            { 'contract_id': '23456' },
            { 'contract_id': '34567' },
        ];
        resolve(Service.successResponse(stub_response));
    },
);


const getContractByID = ({ contractID }) => new Promise(
    async (resolve, _) => {
        const stub_response = 
            { 'contract_id': contractID };
        resolve(Service.successResponse(stub_response));
    },
);

const createContract = ({ toMSP, body }) => new Promise(
    async (resolve, reject) => {
        try {
            console.log('toMSP:' + toMSP);
            console.log('body:' + JSON.stringify(body));
            const stub_response =
                { 'contract_id': toMSP };
            resolve(Service.successResponse(stub_response));
        } catch (error ) {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({ 'message': error.toString() }, 500));
        }
    },
);

const updateContractByID = ({ contractID, body }) => new Promise(
    async (resolve, reject) => {
        try {
            console.log('contractID:' + contractID);
            console.log('body:' + JSON.stringify(body));
            const stub_response =
                { 'contract_id': contractID };
            resolve(Service.successResponse(stub_response));
        } catch (error) {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({ 'message': error.toString() }, 500));
        }
    },
);

const deleteContractByID = ({ contractID }) => new Promise(
    async (resolve, reject) => {
        try {
            console.log('contractID:' + contractID);
            const stub_response = { 'status': 'OK', 'description': 'Contract Deleted.' };
            resolve(Service.successResponse(stub_response));
        } catch (error) {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({ 'message': error.toString() }, 500));
        }
    },
);


module.exports = {
  fetchPrivateDocument,
  fetchPrivateDocuments,
  fetchSignatures,
  uploadPrivateDocument,
  uploadSignature,
  getContracts,
  getContractByID,
  createContract,
  updateContractByID,
  deleteContractByID
};
