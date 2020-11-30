'use strict';

class UsageMapper {
  // Map the input POST usages request to internal usage
  static getUsageFromPostUsagesRequest(contractId, body, mspOwner) {
    const returnedUsage = {
      state: 'DRAFT',
      contractId: contractId,
      name: body.header.name,
      type: body.header.type,
      version: body.header.version,
      mspOwner: mspOwner,
      body: body.body,
    };

    return returnedUsage;
  }


  // Map the internal usage to POST usages or GET usages/id response body
  static getResponseBodyForGetUsage(usage) {
    const returnedResponseBody = {
      usageId: usage.id,
      contractId: usage.contractId,
      header: {
        name: usage.name,
        type: usage.type,
        version: usage.version,
        mspOwner: usage.mspOwner
      },
      state: usage.state,
      body: usage.body,
      // history: usage.history,
      creationDate: usage.creationDate,
      lastModificationDate: usage.lastModificationDate
    };

    return returnedResponseBody;
  }

  // Map the internal usages to GET usages response body
  static getResponseBodyForGetUsages(usages) {
    const returnedResponseBody = [];
    if ((usages !== undefined) && (Array.isArray(usages))) {
      usages.forEach((usage) => {
        returnedResponseBody.push({
          usageId: usage.id,
          contractId: usage.contractId,
          header: {
            name: usage.name,
            type: usage.type,
            version: usage.version,
            mspOwner: usage.mspOwner

          },
          state: usage.state,
          creationDate: usage.creationDate,
          lastModificationDate: usage.lastModificationDate
        });
      });
    }
    return returnedResponseBody;
  }

  // Map the input PUT usage request to internal usage
  static getUsageFromPutUsagesRequest(current, body) {
    const returnedUsage = UsageMapper.getUsageFromPostUsagesRequest(current.contractId, body, current.mspOwner);

    returnedUsage.id = current.id;

    return returnedUsage;
  }
}

module.exports = UsageMapper;
