/* eslint-disable no-unused-vars */
const Service = require('./Service');

const statusInfo = {
  'commitHash': 'haha',
  'apiHash': 'hehe',
  'apiVersion': '1.2.3',
};

try {
  const {tags} = require('../.status_info');
  statusInfo.commitHash = tags.commitHash;
  statusInfo.apiHash = tags.apiHash;
  statusInfo.apiVersion = tags.apiVersion;
} catch (e) {
  console.log('could not parse version info: ' + e);
}


/** Show version information of the API
   * @return {string}
  */
const getApiStatus = () => new Promise(
    async (resolve, _) => {
      resolve(Service.successResponse(JSON.stringify(statusInfo)));
    },
);


module.exports = {
  getApiStatus,
};
