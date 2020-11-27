/* eslint-disable no-unused-vars */
const Service = require('./Service');
const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();


/**
* Show details for a specific Msp
*
* mspId String Name of a Msp
* returns String
* */
const getDiscoveryMsp = ({ mspId }) => new Promise(
  async (resolve, reject) => {
    try {
      const getDiscoveryMSPsResponse = await blockchainAdapterConnection.discovery(mspId);
      resolve(Service.successResponse(getDiscoveryMSPsResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);
/**
* Show a list of all Msps
*
* returns String
* */
const getDiscoveryMsps = () => new Promise(
  async (resolve, reject) => {
    try {
      const getDiscoveryMSPsResponse = await blockchainAdapterConnection.discovery();
      resolve(Service.successResponse(getDiscoveryMSPsResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

module.exports = {
  getDiscoveryMsp,
  getDiscoveryMsps,
};
