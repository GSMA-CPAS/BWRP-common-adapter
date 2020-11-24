'use strict';

const logger = require('../logger');
const { deleteContractByID } = require('../services/ContractService');

class ContractMapper {

  // Map the input POST contracts request to internal contract
  static getContractFromRequest(req) {
    const returnedContract = {
      state: "DRAFT",
      name: req.body.header.name,
      type: req.body.header.type,
      version: req.body.header.version,
      fromMsp: {
        mspId: req.body.header.fromMSP.mspid,
        minSignatures: req.body.header.fromMSP.minSignatures,
        nbOfsignatures: req.body.header.fromMSP.nbOfsignatures,
        signatures: []
      },
      toMsp: {
        mspId: req.body.header.toMSP.mspid,
        minSignatures: req.body.header.toMSP.minSignatures,
        nbOfsignatures: req.body.header.toMSP.nbOfsignatures,
        signatures: []
      },
      body: req.body.body
    };

    if ((req.body.header.fromMSP.signatures !== undefined) && (Array.isArray(req.body.header.fromMSP.signatures))) {
      req.body.header.fromMSP.signatures.forEach(signature => {
        returnedContract.fromMsp.signatures.push({
          id: signature.id,
          name: signature.name,
          role: signature.role
        })
      });
    }
    
    if ((req.body.header.toMSP.signatures !== undefined) && (Array.isArray(req.body.header.toMSP.signatures))) {
      req.body.header.toMSP.signatures.forEach(signature => {
        returnedContract.toMsp.signatures.push({
          id: signature.id,
          name: signature.name,
          role: signature.role
        })
      });
    }

    return returnedContract;
  }

  // Map the internal contract to POST contracts or GET contract/id response body
  static getResponseBodyForGetContract(contract) {
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
      body: contract.body,
      history: contract.history,
      creationDate: contract.creationDate,
      lastModificationDate: contract.lastModificationDate
    };

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