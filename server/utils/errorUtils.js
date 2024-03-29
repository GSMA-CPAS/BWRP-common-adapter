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

  static ERROR_BUSINESS_DOCUMENT_UPSERT_FAILURE = {
    code: 422,
    error: {
      internalErrorCode: 2003,
      message: 'Blockchain document can\'t be upserted in DB',
      description: 'It\'s not possible to upsert this document.'
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
      message: 'Mandatory COMMON_ADAPTER_SELF_HOST configuration missing',
      description: 'Environnement variable COMMON_ADAPTER_SELF_HOST is not defined.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_URL_UNDEFINED_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3006,
      message: 'Mandatory COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_URL configuration missing',
      description: 'Environnement variable COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_URL is not defined.'
    }
  };

  static ERROR_BLOCKCHAIN_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOKS_INVALID_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3007,
      message: 'Mandatory COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS configuration not valid',
      description: 'Environnement variable COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS is not valid.'
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

  static ERROR_CALCULATION_SERVICE_RESPONSE_PARSING_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3100,
      message: 'Calculation Service response parsing error',
      description: 'It\'s not possible to parse the Calculation Service response.'
    }
  };

  static ERROR_CALCULATION_SERVICE_NO_RESPONSE = {
    code: 500,
    error: {
      internalErrorCode: 3101,
      message: 'No response received from Calculation Service',
      description: 'The Calculation Service does not respond.'
    }
  };

  static ERROR_CALCULATION_SERVICE_REQUEST_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3102,
      message: 'Calculation Service request error',
      description: 'Something happened in setting up the Calculation Service request.'
    }
  };

  static ERROR_CALCULATION_SERVICE_RESPONSE_UNEXPECTED_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3104,
      message: 'Calculation Service response error',
      description: 'An unexpected response has been received from the Calculation Service.'
    }
  };

  static ERROR_DISCREPANCY_SERVICE_RESPONSE_PARSING_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3200,
      message: 'Discrepancy Service response parsing error',
      description: 'It\'s not possible to parse the Discrepancy Service response.'
    }
  };

  static ERROR_DISCREPANCY_SERVICE_NO_RESPONSE = {
    code: 500,
    error: {
      internalErrorCode: 3201,
      message: 'No response received from Discrepancy Service',
      description: 'The Discrepancy Service does not respond.'
    }
  };

  static ERROR_DISCREPANCY_SERVICE_REQUEST_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3202,
      message: 'Discrepancy Service request error',
      description: 'Something happened in setting up the Discrepancy Service request.'
    }
  };

  static ERROR_DISCREPANCY_SERVICE_RESPONSE_UNEXPECTED_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 3204,
      message: 'Discrepancy Service response error',
      description: 'An unexpected response has been received from the Discrepancy Service.'
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

  static ERROR_BUSINESS_USAGE_UPDATE_ONLY_ALLOWED_IN_STATE_DRAFT = {
    code: 422,
    error: {
      internalErrorCode: 2004,
      message: 'Usage modification not allowed',
      description: 'It\'s not allowed to update this usage or its state.'
    }
  };

  static ERROR_BUSINESS_GENERATE_SETTLEMENT_ON_USAGE_WITH_ALREADY_LINKED_SETTLEMENT = {
    code: 422,
    error: {
      internalErrorCode: 2025,
      message: 'Calculate settlement not allowed',
      description: 'It\'s not allowed to calculate settlement on usage with an already linked settlement.'
    }
  };

  static ERROR_BUSINESS_GET_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2009,
      message: 'Get signatures not allowed',
      description: 'It\'s only allowed to get signatures on contracts SENT or RECEIVED.'
    }
  };

  static ERROR_BUSINESS_UPDATE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2010,
      message: 'Update signatures not allowed',
      description: 'It\'s only allowed to update signatures on contracts SENT or RECEIVED.'
    }
  };

  static ERROR_BUSINESS_UPDATE_SIGNATURES_LIMIT = {
    code: 422,
    error: {
      internalErrorCode: 2011,
      message: 'Update signatures not allowed',
      description: 'Signature Limit Exceeded.'
    }
  };

  static ERROR_BUSINESS_UPDATE_SIGNATURES_ON_SENT_CONTRACT = {
    code: 422,
    error: {
      internalErrorCode: 2012,
      message: 'Update signatures not allowed',
      description: 'For SENT contract update signature only allowed on fromMsp'
    }
  };

  static ERROR_BUSINESS_UPDATE_SIGNATURES_ON_RECEIVED_CONTRACT = {
    code: 422,
    error: {
      internalErrorCode: 2013,
      message: 'Update signatures not allowed',
      description: 'For RECEIVED contract update signature only allowed on toMsp'
    }
  };

  static ERROR_BUSINESS_UPDATE_SIGNATURES_WITH_WRONG_SIGNATURE_ID = {
    code: 404,
    error: {
      internalErrorCode: 2014,
      message: 'Update signatures not allowed',
      description: 'This signature Id doesn\'t exist'
    }
  };

  static ERROR_BUSINESS_GET_SIGNATURE_WITH_WRONG_SIGNATURE_ID = {
    code: 404,
    error: {
      internalErrorCode: 2015,
      message: 'Get signatures not allowed',
      description: 'This signature Id doesn\'t exist'
    }
  };

  static ERROR_BUSINESS_SEND_SETTLEMENT_ONLY_ALLOWED_IN_STATE_DRAFT = {
    code: 422,
    error: {
      internalErrorCode: 2017,
      message: 'Send settlement not allowed',
      description: 'It\'s not allowed to send this settlement.'
    }
  };

  static ERROR_BUSINESS_SEND_SETTLEMENT_ONLY_ALLOWED_FOR_MSP_OWNER = {
    code: 422,
    error: {
      internalErrorCode: 2024,
      message: 'Send settlement not allowed',
      description: 'It\'s not allowed to send this settlement.'
    }
  };

  static ERROR_INVALID_DEFINED_SELF_MSPID_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 2018,
      message: 'Invalid SELF_MSPID error',
      description: 'The defined SELF_MSPID is not valid.'
    }
  };

  static ERROR_INVALID_TESTED_MSPID_ERROR = {
    code: 500,
    error: {
      internalErrorCode: 2019,
      message: 'Invalid tested mspId error',
      description: 'The tested mspId is not valid.'
    }
  };

  static ERROR_REQUEST_CONTENT_NOT_VALID = {
    code: 422,
    error: {
      internalErrorCode: 2020,
      message: 'Request content not valid',
      description: 'The content of your request is not valid.'
    }
  };

  static ERROR_BUSINESS_SEND_USAGE_ONLY_ALLOWED_IN_STATE_DRAFT = {
    code: 422,
    error: {
      internalErrorCode: 2021,
      message: 'Send usage not allowed',
      description: 'It\'s not allowed to send this usage.'
    }
  };

  static ERROR_BUSINESS_SEND_USAGE_ONLY_ALLOWED_ON_EXCHANGED_CONTRACT = {
    code: 422,
    error: {
      internalErrorCode: 2022,
      message: 'Send usage not allowed',
      description: 'It\'s not allowed to send this usage.'
    }
  };

  static ERROR_BUSINESS_SEND_USAGE_ONLY_ALLOWED_FOR_MSP_OWNER = {
    code: 422,
    error: {
      internalErrorCode: 2023,
      message: 'Send usage not allowed',
      description: 'It\'s not allowed to send this usage.'
    }
  };

  static ERROR_BUSINESS_UPDATE_USAGE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2024,
      message: 'Update signatures not allowed',
      description: 'It\'s only allowed to update signatures on usages SENT or RECEIVED.'
    }
  };

  static ERROR_BUSINESS_UPDATE_SIGNATURES_ON_SENT_USAGE = {
    code: 422,
    error: {
      internalErrorCode: 2025,
      message: 'Update signatures not allowed',
      description: 'For SENT usage update signature only allowed on fromMsp'
    }
  };

  static ERROR_BUSINESS_UPDATE_SIGNATURES_ON_RECEIVED_USAGE = {
    code: 422,
    error: {
      internalErrorCode: 2026,
      message: 'Update signatures not allowed',
      description: 'For RECEIVED usage update signature only allowed on toMsp'
    }
  };

  static ERROR_BUSINESS_GET_USAGE_SIGNATURES_ONLY_ALLOWED_IN_STATE_SENT_OR_RECEIVED = {
    code: 422,
    error: {
      internalErrorCode: 2027,
      message: 'Get signatures not allowed',
      description: 'It\'s only allowed to get signatures on usages SENT or RECEIVED.'
    }
  };

  static ERROR_BUSINESS_USAGE_RAW_FORMAT_UNAVAILABLE = {
    code: 422,
    error: {
      internalErrorCode: 2028,
      message: 'Unvailable RAW format',
      description: 'The RAW format of this usage is unavailable.'
    }
  };
}


module.exports = ErrorUtils;