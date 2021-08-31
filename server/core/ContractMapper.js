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

const config = require('../config');
const errorUtils = require('../utils/errorUtils');
const logger = require('../logger');

class ContractMapper {
  // Map the input POST contracts request to internal contract
  static getContractFromPostContractsRequest(body) {
    // Temporary support both version. TO BE removed in future version.
    if (body.header.msps != undefined) {
      const fromMsp = {};
      const toMsp = {};

      for (const msp in body.header.msps) {
        if (msp == config.SELF_MSPID) {
          fromMsp.mspId = msp;
          fromMsp.signatures = body.header.msps[msp].signatures;
          fromMsp.minSignatures = body.header.msps[msp].minSignatures;
          fromMsp.nbOfsignatures = body.header.msps[msp].nbOfsignatures;
        } else {
          toMsp.mspId = msp;
          toMsp.signatures = body.header.msps[msp].signatures;
          toMsp.minSignatures = body.header.msps[msp].minSignatures;
          toMsp.nbOfsignatures = body.header.msps[msp].nbOfsignatures;
        }
      }
      body.header.fromMsp = fromMsp;
      body.header.toMsp = toMsp;
      if ((fromMsp.mspId === undefined) || (toMsp.mspId === undefined)) {
        throw (errorUtils.ERROR_REQUEST_CONTENT_NOT_VALID);
      }
    }

    const returnedContract = {
      state: 'DRAFT',
      name: body.header.name,
      type: body.header.type,
      version: body.header.version,
      fromMsp: {
        mspId: body.header.fromMsp.mspId,
        minSignatures: body.header.fromMsp.minSignatures,
        nbOfsignatures: body.header.fromMsp.nbOfsignatures,
        signatures: []
      },
      toMsp: {
        mspId: body.header.toMsp.mspId,
        minSignatures: body.header.toMsp.minSignatures,
        nbOfsignatures: body.header.toMsp.nbOfsignatures,
        signatures: []
      },
      body: body.body
    };

    if ((body.header.fromMsp.signatures !== undefined) && (Array.isArray(body.header.fromMsp.signatures))) {
      body.header.fromMsp.signatures.forEach((signature) => {
        returnedContract.fromMsp.signatures.push({
          id: signature.id,
          name: signature.name,
          role: signature.role
        });
      });
    }

    if ((body.header.toMsp.signatures !== undefined) && (Array.isArray(body.header.toMsp.signatures))) {
      body.header.toMsp.signatures.forEach((signature) => {
        returnedContract.toMsp.signatures.push({
          id: signature.id,
          name: signature.name,
          role: signature.role
        });
      });
    }

    return returnedContract;
  }

  // Map the input PUT contracts/id request to internal contract
  static getContractFromPutContractRequest(id, body) {
    // By default, use mapper getContractFromPostContractsRequest
    const returnedContract = ContractMapper.getContractFromPostContractsRequest(body);

    // Define specific mapping for Put Contract
    returnedContract.id = id;
    returnedContract.state = body.state ? body.state : 'DRAFT';

    return returnedContract;
  }

  // Map the internal contract to POST contracts or GET contract/id response body
  static getResponseBodyForGetContract(contract, format = 'JSON') {
    let returnedResponseBody = {};
    if (format === 'RAW') {
      returnedResponseBody = {
        contractId: contract.id,
        state: contract.state,
        referenceId: contract.referenceId,
        blockchainRef: contract.blockchainRef,
        raw: contract.rawData,
        creationDate: contract.creationDate,
        lastModificationDate: contract.lastModificationDate,
      };
    } else if (format === 'JSON') {
      returnedResponseBody = {
        contractId: contract.id,
        header: {
          name: contract.name,
          type: contract.type,
          version: contract.version,
          fromMsp: {
            mspId: contract.fromMsp.mspId,
            minSignatures: contract.fromMsp.minSignatures,
            nbOfsignatures: contract.fromMsp.nbOfsignatures,
            signatures: contract.fromMsp.signatures.map((signature) => {
              return {
                id: signature.id,
                name: signature.name,
                role: signature.role
              };
            })
          },
          toMsp: {
            mspId: contract.toMsp.mspId,
            minSignatures: contract.toMsp.minSignatures,
            nbOfsignatures: contract.toMsp.nbOfsignatures,
            signatures: contract.toMsp.signatures.map((signature) => {
              return {
                id: signature.id,
                name: signature.name,
                role: signature.role
              };
            })
          }
        },
        body: contract.body,
        state: contract.state,
        referenceId: contract.referenceId,
        blockchainRef: contract.blockchainRef,
        creationDate: contract.creationDate,
        lastModificationDate: contract.lastModificationDate
      };
      returnedResponseBody = ContractMapper.convertOldToNew(returnedResponseBody);
    }
    return returnedResponseBody;
  }

  static getResponseBodyForSendContract(contract) {
    // By default, use mapper getResponseBodyForGetContract
    const returnedResponseBody = ContractMapper.getResponseBodyForGetContract(contract, 'JSON');
    return returnedResponseBody;
  }

  static failsafeGetBodyKey(contract, key) {
    try {
      switch (key) {
      case 'name':
        return contract.body.metadata.name;
      case 'authors':
        return contract.body.metadata.authors;
      case 'term':
        return contract.body.framework.term;
      case 'partyInformation':
        return contract.body.framework.partyInformation;
      }
    } catch (e) {
      return null;
    }
  }


  // Map the internal contracts to GET contracts response body
  static getResponseBodyForGetContracts(contracts) {
    const returnedResponseBody = [];
    if ((contracts !== undefined) && (Array.isArray(contracts))) {
      contracts.forEach((contract) => {
        let isSigned = false;
        let totalSignature = 0;
        let signatureCount = 0;
        contract.signatureLink.forEach((signature) => {
          totalSignature++;
          if (signature.txId != undefined) {
            signatureCount++;
          }
        });
        if (signatureCount == totalSignature && totalSignature != 0) {
          isSigned = true;
        }
        returnedResponseBody.push(ContractMapper.convertOldToNew({
          contractId: contract.id,
          header: {
            name: contract.name,
            type: contract.type,
            version: contract.version,
            fromMsp: {
              mspId: contract.fromMsp.mspId,
              signatures: contract.fromMsp.signatures.map((signature) => {
                return {
                  id: signature.id,
                  name: signature.name,
                  role: signature.role
                };
              })
            },
            toMsp: {
              mspId: contract.toMsp.mspId,
              signatures: contract.toMsp.signatures.map((signature) => {
                return {
                  id: signature.id,
                  name: signature.name,
                  role: signature.role
                };
              })
            }
          },
          body: {
            metadata: {
              name: this.failsafeGetBodyKey(contract, 'name'),
              authors: this.failsafeGetBodyKey(contract, 'authors')
            },
            framework: {
              term: this.failsafeGetBodyKey(contract, 'term'),
              partyInformation: this.failsafeGetBodyKey(contract, 'partyInformation')
            }
          },
          isSigned: isSigned,
          state: contract.state,
          referenceId: contract.referenceId,
          creationDate: contract.creationDate,
          lastModificationDate: contract.lastModificationDate
        }));
      });
    }
    return returnedResponseBody;
  }

  // Convert Header Format
  static convertOldToNew(contract) {
    const returnedResponseBody = contract;
    const newHeader = {};

    const msps = {};
    logger.info(contract);
    msps[contract.header.fromMsp.mspId] = {'signatures': contract.header.fromMsp.signatures.map((signature) => {
      return {
        id: signature.id,
        name: signature.name,
        role: signature.role
      };
    })};
    msps[contract.header.fromMsp.mspId].minSignatures = contract.header.fromMsp.minSignatures;
    msps[contract.header.fromMsp.mspId].nbOfsignatures = contract.header.fromMsp.nbOfsignatures;

    newHeader.type = contract.header.type;
    newHeader.version = contract.header.version;
    newHeader.msps = msps;

    msps[contract.header.toMsp.mspId] = {'signatures': contract.header.toMsp.signatures.map((signature) => {
      return {
        id: signature.id,
        name: signature.name,
        role: signature.role
      };
    })};
    msps[contract.header.toMsp.mspId].minSignatures = contract.header.toMsp.minSignatures;
    msps[contract.header.toMsp.mspId].nbOfsignatures = contract.header.toMsp.nbOfsignatures;

    logger.info(msps);
    returnedResponseBody.header = newHeader;
    return returnedResponseBody;
  }
}

module.exports = ContractMapper;
