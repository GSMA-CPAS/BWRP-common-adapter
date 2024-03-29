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

const path = require('path');

const getAsString = (envVar, defaultValue) => {
  let returnedObject = defaultValue;
  if (envVar !== undefined) {
    returnedObject = envVar;
  }
  return returnedObject;
};

const getAsObject = (envVar, defaultValue) => {
  let returnedObject = defaultValue;
  if (envVar !== undefined) {
    try {
      returnedObject = JSON.parse(envVar);
    } catch (e) {
      console.log(`[config::getAsObject] The env var ${envVar} can't be parsed as an object!`);
    }
  }
  return returnedObject;
};

const getAsInt = (envVar, defaultValue) => {
  let returnedInt = defaultValue;
  if (envVar !== undefined) {
    try {
      const parsedValue = parseInt(envVar, 10);
      if (!isNaN(parsedValue)) {
        returnedInt = parsedValue;
      } else {
        console.log(`[config::getAsObject] The env var ${envVar} can't be parsed as an int!`);
      }
    } catch (e) {
      console.log(`[config::getAsObject] The env var ${envVar} can't be parsed as an int!`);
    }
  }
  return returnedInt;
};

const getAsBoolean = (envVar, defaultValue) => {
  let returnedBoolean = defaultValue;
  if (envVar !== undefined) {
    if (['true', 'True', 'TRUE'].includes(envVar)) {
      returnedBoolean = true;
    } else if (['false', 'False', 'FALSE'].includes(envVar)) {
      returnedBoolean = false;
    }
  }
  return returnedBoolean;
};

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: 8080,
  URL_PATH: 'http://localhost',
  BASE_VERSION: '/api/v1',
  CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
  PROJECT_DIR: __dirname,
};
config.OPENAPI_YAML = path.join(config.ROOT_DIR, 'api', 'openapi.yaml');
config.FULL_PATH = `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`;
config.FILE_UPLOAD_PATH = path.join(config.PROJECT_DIR, 'uploaded_files');

// Logger configuration
config.LOG_LEVEL = process.env.COMMON_ADAPTER_LOG_LEVEL || 'info';

// Calculation Service configuration
config.CALCULATION_SERVICE_URL = getAsString(process.env.COMMON_ADAPTER_CALCULATION_SERVICE_URL, 'http://127.0.0.1:8989');

// Discrepancy Service configuration
config.DISCREPANCY_SERVICE_URL = getAsString(process.env.COMMON_ADAPTER_DISCREPANCY_SERVICE_URL, undefined);

// BlockchainAdapter configuration
config.BLOCKCHAIN_ADAPTER_URL = getAsString(process.env.COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_URL, 'http://127.0.0.1:8081');
config.BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS = getAsObject(process.env.COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS, []);
config.SELF_HOST = getAsString(process.env.COMMON_ADAPTER_SELF_HOST, '');
config.SELF_MSPID = getAsString(process.env.COMMON_ADAPTER_SELF_MSPID, '');

config.DB_URL = getAsString(process.env.COMMON_ADAPTER_DB_URL, 'mongodb://user:userpw@127.0.0.1:27917/commondb?authSource=commondb');
config.DB_CREATE_CONNECTION_TIMEOUT = getAsInt(process.env.COMMON_ADAPTER_DB_CREATE_CONNECTION_TIMEOUT, 30000);
config.DB_HEARTBEAT_FREQUENCY = getAsInt(process.env.COMMON_ADAPTER_DB_HEARTBEAT_FREQUENCY, 5000);
config.DB_POOL_SIZE = getAsInt(process.env.COMMON_ADAPTER_DB_POOL_SIZE, 10);

config.DEACTIVATE_BLOCKCHAIN_DOCUMENT_DELETE = getAsBoolean(process.env.COMMON_ADAPTER_DEACTIVATE_BLOCKCHAIN_DOCUMENT_DELETE, false);
config.IS_USAGE_APPROVED_MODE = getAsBoolean(process.env.COMMON_ADAPTER_IS_USAGE_APPROVED_MODE, false);

module.exports = config;
