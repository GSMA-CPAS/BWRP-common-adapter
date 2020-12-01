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

  static ERROR_BUSINESS_CONTRACT_RAW_FORMAT_UNAVAILABLE = {
    code: 422,
    error: {
      internalErrorCode: 2002,
      message: 'Unvailable RAW format',
      description: 'The RAW format of this contract is unavailable.'
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
    code: 500,
    error: {
      internalErrorCode: 3004,
      message: 'Blockchain response error',
      description: 'An unexpected response has been received from the Blockchain.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_SELF_HOST_UNDEFINED_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3005,
      message: 'Mandatory SELF_HOST configuration missing',
      description: 'Environnement variable SELF_HOST is not defined.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_URL_UNDEFINED_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3006,
      message: 'Mandatory BLOCKCHAIN_ADAPTER_URL configuration missing',
      description: 'Environnement variable BLOCKCHAIN_ADAPTER_URL is not defined.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOKS_INVALID_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3007,
      message: 'Mandatory BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS configuration not valid',
      description: 'Environnement variable BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS is not valid.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_DOCUMENT_TYPE_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3008,
      message: 'Mandatory private document type is not valid',
      description: 'The received private document does not contain a valid type.'
    }
  };

  static ERROR_BUSINESS_CREATE_USAGE_ON_CONTRACT_ONLY_ALLOWED_IN_STATE_SENT_SIGNED_OR_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2002,
      message: 'Create usage not allowed',
      description: 'It\'s not allowed to create usage on this contract.'
    }
  };

  static ERROR_BUSINESS_GET_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2003,
      message: 'Get usage not allowed',
      description: 'It\'s not allowed to get usage on wrong contract.'
    }
  };

  static ERROR_BUSINESS_USAGE_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT = {
    code: 422,
    error: {
      internalErrorCode: 2004,
      message: 'Usage modification not allowed',
      description: 'It\'s not allowed to update this usage or its state.'
    }
  };

  static ERROR_BUSINESS_PUT_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2005,
      message: 'Put usage not allowed',
      description: 'It\'s not allowed to put usage on wrong contract.'
    }
  };

  static ERROR_BUSINESS_DELETE_USAGE_ON_NOT_LINKED_CONTRACT_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2006,
      message: 'Delete usage not allowed',
      description: 'It\'s not allowed to delete usage on wrong contract.'
    }
  };

}

module.exports = ErrorUtils;