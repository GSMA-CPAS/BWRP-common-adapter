'use strict';

class SettlementMapper {
  // Map the internal settlement to  GET settlements/id response body
  static getResponseBodyForGetSettlement(settlement) {
    const returnedResponseBody = {
      settlementId: settlement.id,
      contractId: settlement.contractId,
      header: {
        name: settlement.name,
        type: settlement.type,
        version: settlement.version,
      },
      state: settlement.state,
      body: settlement.body,
      // history: usage.history,
      creationDate: settlement.creationDate,
      lastModificationDate: settlement.lastModificationDate
    };

    return returnedResponseBody;
  }

  // Map the internal settlements to GET settlements response body
  static getResponseBodyForGetSettlements(settlements) {
    const returnedResponseBody = [];
    if ((settlements !== undefined) && (Array.isArray(settlements))) {
      settlements.forEach((settlement) => {
        returnedResponseBody.push({
          settlementId: settlement.id,
          contractId: settlement.contractId,
          header: {
            name: settlement.name,
            type: settlement.type,
            version: settlement.version,
          },
          state: settlement.state,
          creationDate: settlement.creationDate,
          lastModificationDate: settlement.lastModificationDate
        });
      });
    }
    return returnedResponseBody;
  }

  // Map the input calculation result usage and contract  to internal usage
  static getSettlementForGenerateUsageById(usage, contract, getCalculateResultResp) {
    const returnedSettlement = {
      state: 'DRAFT',
      contractId: contract.id,
      name: 'Settlement for contract ' + contract.id,
      type: 'settlement',
      version: '1.0.0',
      mspOwner: usage.mspOwner,
      mspReceiver: usage.mspReceiver,
      body: {
        generatedResult: getCalculateResultResp,
        usage: {
          name: usage.name,
          version: usage.version,
          state: usage.state,
          mspOwner: usage.mspOwner,
          body: usage.body,
        }
      }
    };
    if (contract.referenceId !== undefined) {
      returnedSettlement.contractReferenceId = contract.referenceId;
    }

    return returnedSettlement;
  }
}

module.exports = SettlementMapper;
