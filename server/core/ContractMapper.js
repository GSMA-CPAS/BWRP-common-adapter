'use strict';

class ContractMapper {
  // Map the input POST contracts request to internal contract
  static getContractFromPostContractsRequest(body) {
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
        creationDate: contract.creationDate,
        lastModificationDate: contract.lastModificationDate
      };
    }
    return returnedResponseBody;
  }

  static getResponseBodyForSendContract(contract) {
    // By default, use mapper getResponseBodyForGetContract
    const returnedResponseBody = ContractMapper.getResponseBodyForGetContract(contract, 'JSON');
    return returnedResponseBody;
  }

  // Map the internal contracts to GET contracts response body
  static getResponseBodyForGetContracts(contracts) {
    const returnedResponseBody = [];
    if ((contracts !== undefined) && (Array.isArray(contracts))) {
      contracts.forEach((contract) => {
        returnedResponseBody.push({
          contractId: contract.id,
          header: {
            name: contract.name,
            type: contract.type,
            version: contract.version,
            fromMsp: {
              mspId: contract.fromMsp.mspId
            },
            toMsp: {
              mspId: contract.toMsp.mspId
            }
          },
          state: contract.state,
          referenceId: contract.referenceId,
          creationDate: contract.creationDate,
          lastModificationDate: contract.lastModificationDate
        });
      });
    }
    return returnedResponseBody;
  }
}

module.exports = ContractMapper;
