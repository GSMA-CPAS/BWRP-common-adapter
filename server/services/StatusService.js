// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/* eslint-disable no-unused-vars */
const Service = require('./Service');

const statusInfo = {
  'commitHash': 'unknown',
  'apiHash': 'unknown',
  'apiVersion': '?.?.?'
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
    resolve(Service.successResponse(statusInfo));
  },
);

module.exports = {
  getApiStatus,
};
