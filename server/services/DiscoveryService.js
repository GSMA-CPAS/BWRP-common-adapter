/* eslint-disable no-unused-vars */
const Service = require('./Service');
const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();



/** Show details for a specific MSP
   * @param {string} mspid - Name of a MSP
   * @return {string}
  */
 const getDiscoveryMSP = ({ mspid }) => new Promise(
  async (resolve, reject) => {
    try {
      const getDiscoveryMSPsResponse = await blockchainAdapterConnection.discovery(mspid);
      resolve(Service.successResponse(getDiscoveryMSPsResponse));
    } catch (e) {
      reject(Service.rejectResponse(e));
    }
  },
);

/** Show a list of all MSPs
  * @return {string}
  */
 const getDiscoveryMSPs = () => new Promise(
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
  getDiscoveryMSP,
  getDiscoveryMSPs,
};
