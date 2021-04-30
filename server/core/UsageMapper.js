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

class UsageMapper {
  // Map the input POST usages request to internal usage
  static getUsageFromPostUsagesRequest(contractId, body, mspOwner, mspReceiver) {
    const returnedUsage = {
      state: 'DRAFT',
      contractId: contractId,
      name: body.header.name,
      type: body.header.type,
      version: body.header.version,
      mspOwner: mspOwner,
      mspReceiver: mspReceiver,
      body: body.body,
    };

    return returnedUsage;
  }


  // Map the internal usage to POST usages or GET usages/id response body
  static getResponseBodyForGetUsage(usage) {
    const returnedResponseBody = {
      usageId: usage.id,
      contractId: usage.contractId,
      settlementId: usage.settlementId,
      header: {
        name: usage.name,
        type: usage.type,
        version: usage.version,
        mspOwner: usage.mspOwner
      },
      state: usage.state,
      referenceId: usage.referenceId,
      blockchainRef: usage.blockchainRef,
      mspOwner: usage.mspOwner,
      body: usage.body,
      // history: usage.history,
      creationDate: usage.creationDate ? usage.creationDate.toJSON() : usage.creationDate,
      lastModificationDate: usage.lastModificationDate ? usage.lastModificationDate.toJSON() : usage.lastModificationDate
    };

    if ( usage.partnerUsageId) {
      returnedResponseBody.partnerUsageId = usage.partnerUsageId;
    }
    if ( usage.tag) {
      returnedResponseBody.tag = usage.tag;
    }
    return returnedResponseBody;
  }

  // Map the internal usages to GET usages response body
  static getResponseBodyForGetUsages(usages) {
    const returnedResponseBody = [];
    if ((usages !== undefined) && (Array.isArray(usages))) {
      usages.forEach((usage) => {
        const usageResp = {
          usageId: usage.id,
          contractId: usage.contractId,
          settlementId: usage.settlementId,
          header: {
            name: usage.name,
            type: usage.type,
            version: usage.version
          },
          state: usage.state,
          referenceId: usage.referenceId,
          mspOwner: usage.mspOwner,
          creationDate: usage.creationDate ? usage.creationDate.toJSON() : usage.creationDate,
          lastModificationDate: usage.lastModificationDate ? usage.lastModificationDate.toJSON() : usage.lastModificationDate
        };
        if (usage.partnerUsageId) {
          usageResp.partnerUsageId = usage.partnerUsageId;
        }
        if (usage.tag) {
          usageResp.tag = usage.tag;
        }
        returnedResponseBody.push(usageResp);
      });
    }
    return returnedResponseBody;
  }

  static getResponseBodyForSendUsage(usage) {
    // By default, use mapper getResponseBodyForGetUsage
    const returnedResponseBody = UsageMapper.getResponseBodyForGetUsage(usage);
    return returnedResponseBody;
  }

  static getResponseBodyForRejectUsage(usage) {
    // By default, use mapper getResponseBodyForGetUsage
    const returnedResponseBody = UsageMapper.getResponseBodyForGetUsage(usage);
    return returnedResponseBody;
  }

  // Map the input PUT usage request to internal usage
  static getUsageFromPutUsagesRequest(current, body) {
    const returnedUsage = UsageMapper.getUsageFromPostUsagesRequest(current.contractId, body, current.mspOwner, current.mspReceiver);

    returnedUsage.id = current.id;

    return returnedUsage;
  }
}

module.exports = UsageMapper;
