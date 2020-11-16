/* eslint-disable no-unused-vars */
const Service = require('./Service');


/** Show details for a specific MSP
   * @param {string} mspid - Name of a MSP
   * @return {string}
  */
const getDiscoveryMSP = ({mspid}) => new Promise(
    async (resolve, reject) => {
        try {
            resolve(Service.successResponse({
                contractID,
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

/** Show a list of all MSPs
   * @return {string}
  */
const getDiscoveryMSPs = () => new Promise(
    async (resolve, reject) => {
        try {
            resolve(Service.successResponse({
                contractID,
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
  getDiscoveryMSP,
  getDiscoveryMSPs,
};
