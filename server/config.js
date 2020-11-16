const path = require('path');

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
config.LOG_LEVEL = process.env.LOG_LEVEL || "info";

// BlockchainAdapter configuration
config.BLOCKCHAIN_ADAPTER_URL = process.env.BLOCKCHAIN_ADAPTER_URL || "http://127.0.0.1:8081";
config.BLOCKCHAIN_ADAPTER_WEBHOOKS = process.env.BLOCKCHAIN_ADAPTER_WEBHOOKS || [];

module.exports = config;
