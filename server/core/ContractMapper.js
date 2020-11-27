'use strict';

const logger = require('../logger');

class ContractMapper {

  // Map the input POST contracts request to internal contract
  static getContractFromPostContractsRequest(body) {
    const returnedContract = {
      state: "DRAFT",
      name: body.header.name,
      type: body.header.type,
      version: body.header.version,
      fromMsp: {
        mspId: body.header.fromMSP.mspid,
        minSignatures: body.header.fromMSP.minSignatures,
        nbOfsignatures: body.header.fromMSP.nbOfsignatures,
        signatures: []
      },
      toMsp: {
        mspId: body.header.toMSP.mspid,
        minSignatures: body.header.toMSP.minSignatures,
        nbOfsignatures: body.header.toMSP.nbOfsignatures,
        signatures: []
      },
      body: body.body
    };

    if ((body.header.fromMSP.signatures !== undefined) && (Array.isArray(body.header.fromMSP.signatures))) {
      body.header.fromMSP.signatures.forEach(signature => {
        returnedContract.fromMsp.signatures.push({
          id: signature.id,
          name: signature.name,
          role: signature.role
        })
      });
    }
    
    if ((body.header.toMSP.signatures !== undefined) && (Array.isArray(body.header.toMSP.signatures))) {
      body.header.toMSP.signatures.forEach(signature => {
        returnedContract.toMsp.signatures.push({
          id: signature.id,
          name: signature.name,
          role: signature.role
        })
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
  static getResponseBodyForGetContract(contract, format = 'body') {
    const returnedResponseBody = {
      contractID: contract.id,
      header: {
        name: contract.name,
        type: contract.type,
        version: contract.version,
        fromMSP: {
          mspid: contract.fromMsp.mspId,
          minSignatures: contract.fromMsp.minSignatures,
          nbOfsignatures: contract.fromMsp.nbOfsignatures,
          signatures: contract.fromMsp.signatures.map(signature => {
            return {
              id: signature.id,
              name: signature.name,
              role: signature.role    
            }
          })
        },
        toMSP: {
          mspid: contract.toMsp.mspId,
          minSignatures: contract.toMsp.minSignatures,
          nbOfsignatures: contract.toMsp.nbOfsignatures,
          signatures: contract.toMsp.signatures.map(signature => {
            return {
              id: signature.id,
              name: signature.name,
              role: signature.role    
            }
          })
        }
      },
      state: contract.state,
      documentId: contract.documentId,
      // history: contract.history,
      creationDate: contract.creationDate,
      lastModificationDate: contract.lastModificationDate
    };

    if (format === 'rawData') {
      returnedResponseBody.rawData = contract.rawData;
    }

    if (format === 'body') {
      returnedResponseBody.body = contract.body;
    }

    return returnedResponseBody;
  }

  static getResponseBodyForSendContract(contract) {
    // By default, use mapper getResponseBodyForGetContract
    const returnedResponseBody = ContractMapper.getResponseBodyForGetContract(contract, 'rawData');
    return returnedResponseBody;
  }

  // Map the internal contracts to GET contracts response body
  static getResponseBodyForGetContracts(contracts) {
    const returnedResponseBody = [];
    if ((contracts !== undefined) && (Array.isArray(contracts))) {
      contracts.forEach(contract => {
        returnedResponseBody.push({
          contractID: contract.id,
          header: {
            name: contract.name,
            type: contract.type,
            version: contract.version,
            fromMSP: {
              mspid: contract.fromMsp.mspId
            },
            toMSP: {
              mspid: contract.toMsp.mspId
            }
          },
          state: contract.state,
          creationDate: contract.creationDate,
          lastModificationDate: contract.lastModificationDate    
        })
      });
    }
    return returnedResponseBody;
  }

}

module.exports = ContractMapper;