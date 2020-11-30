/* eslint-disable no-unused-vars */
const Service = require('./Service');
const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();


/**
 * Show details for a specific Msp
 *
 * @param {String} mspId Id of the MSP to return
 * @return {Promise<ServiceResponse>}
 */
const getDiscoveryMsp = ({mspId}) => new Promise(
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
 * @return {Promise<ServiceResponse>}
 */
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
