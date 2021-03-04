'use strict';

class SettlementMapper {
  // Map the internal settlement to  GET settlements/id response body
  static getResponseBodyForGetSettlement(settlement, format = 'JSON') {
    let returnedResponseBody = {};
    if (format === 'RAW') {
      returnedResponseBody = {
        settlementId: settlement.id,
        contractId: settlement.contractId,
        usageId: settlement.usageId,
        state: settlement.state,
        referenceId: settlement.referenceId,
        blockchainRef: settlement.blockchainRef,
        mspOwner: settlement.mspOwner,
        raw: settlement.rawData,
        creationDate: settlement.creationDate,
        lastModificationDate: settlement.lastModificationDate,
      };
    } else if (format === 'JSON') {
      returnedResponseBody = {
        settlementId: settlement.id,
        contractId: settlement.contractId,
        usageId: settlement.usageId,
        header: {
          name: settlement.name,
          type: settlement.type,
          version: settlement.version,
        },
        state: settlement.state,
        referenceId: settlement.referenceId,
        blockchainRef: settlement.blockchainRef,
        mspOwner: settlement.mspOwner,
        body: {},
        // history: usage.history,
        creationDate: settlement.creationDate,
        lastModificationDate: settlement.lastModificationDate
      };

      if (settlement.body.generatedResult !== undefined) {
        returnedResponseBody.body.generatedResult = settlement.body.generatedResult;
      }
      if (settlement.body.usage !== undefined) {
        returnedResponseBody.body.usage = {
          name: settlement.body.usage.name,
          version: settlement.body.usage.version,
          state: settlement.body.usage.state,
          mspOwner: settlement.body.usage.mspOwner,
          body: settlement.body.usage.body,
        };
      }
    }
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

  static getResponseBodyForSendSettlement(settlement) {
    // By default, use mapper getResponseBodyForGetSettlement
    const returnedResponseBody = SettlementMapper.getResponseBodyForGetSettlement(settlement, 'JSON');
    return returnedResponseBody;
  }
}

module.exports = SettlementMapper;
