const Service = require('./Service');



const getSignatures = ({ contractID }) => new Promise(
    async (resolve, reject) => {
        console.log('contractID:' + contractID);
        const stub_response = [
            { 'signature_id': '12345' },
            { 'signature_id': '23456' },
            { 'signature_id': '34567' },
        ];
        resolve(Service.successResponse(stub_response));
    },
);


const getSignatureByID = ({ contractID, signatureID }) => new Promise(
    async (resolve, reject) => {
        console.log('contractID:' + contractID);
        console.log('signatureID:' + signatureID);
        const stub_response = 
            { 'signature_id': signatureID };
        resolve(Service.successResponse(stub_response));
    },
);


const updateSignatureByID = ({ contractID, signatureID, body }) => new Promise(
    async (resolve, reject) => {
        try {
            console.log('contractID:' + contractID);
            console.log('signatureID:' + signatureID);
            console.log('body:' + JSON.stringify(body));
            const stub_response =
                { 'signature_id': contractID };
            resolve(Service.successResponse(stub_response));
        } catch (error) {
            console.log('ERROR: ' + error);
            reject(Service.rejectResponse({ 'message': error.toString() }, 500));
        }
    },
);

module.exports = {
  getSignatures,
  getSignatureByID,
  updateSignatureByID,
};
