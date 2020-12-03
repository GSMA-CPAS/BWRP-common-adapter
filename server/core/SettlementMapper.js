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
}

module.exports = SettlementMapper;
