'use strict';

class ErrorUtils {

  static ERROR_DAO_NOT_FOUND = {
    code: 404,
    error: {
      internalErrorCode: 60,
      message: 'Resource not found',
      description: 'The requested URI or the requested resource does not exist.'
    }
  };

  static ERROR_DAO_CONFLICT = {
    code: 409,
    error: {
      internalErrorCode: 409,
      message: 'Conflict',
      description: 'This object already exists.'
    }
  };

  static ERROR_DAO_REQUEST_FAILED = {
    code: 500,
    error: {
      internalErrorCode: 1,
      message: 'Internal error',
      description: 'An internal error occured requesting the resource.'
    }
  };

  static ERROR_DAO_MISSING_MANDATORY_PARAM = {
    code: 500,
    error: {
      internalErrorCode: 1,
      message: 'Internal error',
      description: 'An internal error occured accessing the resource.'
    }
  };

  static ERROR_BUSINESS_CONTRACT_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT = {
    code: 422,
    error: {
      internalErrorCode: 2000,
      message: 'Contract modification not allowed',
      description: 'It\'s not allowed to update this contract or its state.'
    }
  };

  static ERROR_BUSINESS_SEND_CONTRACT_ONLY_ALLOWED_IN_STATE_DRAFT = {
    code: 422,
    error: {
      internalErrorCode: 2001,
      message: 'Send contract not allowed',
      description: 'It\'s not allowed to send this contract.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_PARSING_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3000,
      message: 'Blockchain response parsing error',
      description: 'It\'s not possible to parse the blockchain response.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_NO_RESPONSE = {
    code: 500,
    error: {
      internalErrorCode: 3001,
      message: 'No response received from Blockchain',
      description: 'The Blochain does not respond.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_REQUEST_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3002,
      message: 'Blockchain request error',
      description: 'Something happened in setting up the Blockchain request.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_NOT_FOUND_ERROR = {
    code: 404,
    error: {
      internalErrorCode: 3003,
      message: 'Blockchain resource not found',
      description: 'The requested URI or the requested Blockchain resource does not exist.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_RESPONSE_UNEXPECTED_ERROR = {
    code: 404,
    error: {
      internalErrorCode: 3004,
      message: 'Blockchain response error',
      description: 'An unexpected response has been received from the Blockchain.'
    }
  };

}

module.exports = ErrorUtils;