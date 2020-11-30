/* eslint-disable no-unused-vars */
const Service = require('./Service');

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

module.exports = {
  eventReceived,
};
