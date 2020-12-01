/* eslint-disable no-unused-vars */
const Service = require('./Service');

const BlockchainAdapterProvider = require('../providers/BlockchainAdapterProvider');
const blockchainAdapterConnection = new BlockchainAdapterProvider();

/**
 * Webhook callback
 *
 * @param {Object} body Content of the received event
 * @return {Promise<ServiceResponse>}
 */
const eventReceived = ({body}) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        body,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
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
