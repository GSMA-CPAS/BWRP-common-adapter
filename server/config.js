const path = require('path');

const getAsObject = (envVar) => {
  let returnedObject = undefined;
  if (envVar !== undefined) {
    try {
      returnedObject = JSON.parse(envVar);
    } catch (e) {
      console.log(`[config::getAsObject] The env var ${envVar} can't be parsed as an object!`);
    }
  }
  return returnedObject;
};

const getAsInt = (envVar) => {
  let returnedInt = undefined;
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
config.LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// BlockchainAdapter configuration
config.BLOCKCHAIN_ADAPTER_URL = process.env.BLOCKCHAIN_ADAPTER_URL || 'http://127.0.0.1:8081';
config.BLOCKCHAIN_ADAPTER_WEBHOOKS = getAsObject(process.env.BLOCKCHAIN_ADAPTER_WEBHOOKS) || [];
config.SELF_HOST = process.env.SELF_HOST || "";

config.DB_URL = process.env.DB_URL || 'mongodb://userdtag:userpwd@localhost:27017/roamingdbdtag?authSource=roamingdbdtag';
config.DB_CREATE_CONNECTION_TIMEOUT = getAsInt(process.env.DB_CREATE_CONNECTION_TIMEOUT) || 30000;
config.DB_HEARTBEAT_FREQUENCY = getAsInt(process.env.DB_HEARTBEAT_FREQUENCY) || 5000;
config.DB_POOL_SIZE = getAsInt(process.env.DB_POOL_SIZE) || 10;

module.exports = config;
