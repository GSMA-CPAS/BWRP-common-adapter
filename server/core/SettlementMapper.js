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
        // returnedResponseBody.body.generatedResult = settlement.body.generatedResult;
        // remove generatedResult field and set this generatedResult in body
        returnedResponseBody.body = settlement.body.generatedResult;
      }
      // remove usage field
      /*
      if (settlement.body.usage !== undefined) {
        returnedResponseBody.body.usage = {
          name: settlement.body.usage.name,
          version: settlement.body.usage.version,
          state: settlement.body.usage.state,
          mspOwner: settlement.body.usage.mspOwner,
          body: settlement.body.usage.body,
        };
      }
      */
    }
    if ( settlement.tag) {
      returnedResponseBody.tag = settlement.tag;
    }
    return returnedResponseBody;
  }

  // Map the internal settlements to GET settlements response body
  static getResponseBodyForGetSettlements(settlements) {
    const returnedResponseBody = [];
    if ((settlements !== undefined) && (Array.isArray(settlements))) {
      settlements.forEach((settlement) => {
        const settlementResp = {
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
        };
        if ( settlement.tag) {
          settlementResp.tag = settlement.tag;
        }
        returnedResponseBody.push(settlementResp);
      });
    }
    return returnedResponseBody;
  }

  static defineGeneratedResult(getCalculateResultResp, usage) {
    const returnedGeneratedResult = {
      fromDate: undefined,
      toDate: undefined,
      calculationEngineVersion: undefined,
      inbound: {
        tax: {
          rate: ''
        },
        currency: 'EURO',
        services: {
          voice: {
            'MOC': {
              'local': 0,
              'backHome': 0,
              'international': 0,
              'premium': 0,
              'ROW': 0,
              'EU': 0,
              'EEA': 0,
              'satellite': 0,
              'videoTelephony': 0,
              'specialDestinations': 0
            },
            'MTC': 0
          },
          SMS: {
            MO: 0,
            MT: 0
          },
          data: [
            {
              'name': 'GPRS',
              'value': 0
            },
            {
              'name': 'M2M',
              'value': 0.00
            },
            {
              'name': 'NB-IOT',
              'value': 0
            },
            {
              'name': 'LTE-M',
              'value': 0
            },
            {
              'name': 'VoLTE',
              'value': 0
            },
            {
              'name': 'ViLTE',
              'value': 0
            },
            {
              'name': 'signalling',
              'value': 0.00
            }],
          access: {
            networkAccess: 0
          }
        }
      },
      outbound: {
        tax: {
          rate: ''
        },
        currency: 'EURO',
        services: {
          voice: {
            'MOC': {
              'local': 0,
              'backHome': 0,
              'international': 0,
              'premium': 0,
              'ROW': 0,
              'EU': 0,
              'EEA': 0,
              'satellite': 0,
              'videoTelephony': 0,
              'specialDestinations': 0
            },
            'MTC': 0
          },
          SMS: {
            MO: 0,
            MT: 0
          },
          data: [
            {
              'name': 'GPRS',
              'value': 0
            },
            {
              'name': 'M2M',
              'value': 0.00
            },
            {
              'name': 'NB-IOT',
              'value': 0
            },
            {
              'name': 'LTE-M',
              'value': 0
            },
            {
              'name': 'VoLTE',
              'value': 0
            },
            {
              'name': 'ViLTE',
              'value': 0
            },
            {
              'name': 'signalling',
              'value': 0.00
            }],
          access: {
            networkAccess: 0
          }
        }
      },
      unexpectedServiceNames: [],
    };
    const yearMonthArray = getCalculateResultResp.intermediateResults
      .filter((intermediateResult) => (intermediateResult.yearMonth)).map((intermediateResult) => parseInt(intermediateResult.yearMonth));

    returnedGeneratedResult.fromDate = Math.min(...yearMonthArray);
    returnedGeneratedResult.toDate = Math.max(...yearMonthArray);


    getCalculateResultResp.intermediateResults
      .filter((intermediateResult) => ((intermediateResult.type === 'inbound') || (intermediateResult.type === 'outbound')))
      .forEach((intermediateResult) => {
        switch (intermediateResult.service) {
        case 'MOC Back Home':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.backHome += intermediateResult.dealValue;
          break;
        case 'MOC Local':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.local += intermediateResult.dealValue;
          break;
        case 'MOC International':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.international += intermediateResult.dealValue;
          break;
        case 'MOC EU':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EU += intermediateResult.dealValue;
          break;
        case 'MOC EEA':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EEA += intermediateResult.dealValue;
          break;
        case 'MOC RoW':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.ROW += intermediateResult.dealValue;
          break;
        case 'MOC Premium':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.premium += intermediateResult.dealValue;
          break;
        case 'MOC Satellite':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.satellite += intermediateResult.dealValue;
          break;
        case 'MOC Video Telephony':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.videoTelephony += intermediateResult.dealValue;
          break;
        case 'MOC Special Destinations':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.specialDestinations += intermediateResult.dealValue;
          break;
        case 'MTC':
          returnedGeneratedResult[intermediateResult.type].services.voice.MTC += intermediateResult.dealValue;
          break;
        case 'SMS MO':
        case 'SMSMO':
          returnedGeneratedResult[intermediateResult.type].services.SMS.MO += intermediateResult.dealValue;
          break;
        case 'SMS MT':
        case 'SMSMT':
          returnedGeneratedResult[intermediateResult.type].services.SMS.MT += intermediateResult.dealValue;
          break;
        case 'M2M':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'M2M'))[0].value += intermediateResult.dealValue;
          break;
        case 'NB-IoT':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'NB-IOT'))[0].value += intermediateResult.dealValue;
          break;
        case 'LTE-M':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'LTE-M'))[0].value += intermediateResult.dealValue;
          break;
        case 'VoLTE':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'VoLTE'))[0].value += intermediateResult.dealValue;
          break;
        case 'ViLTE':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'ViLTE'))[0].value += intermediateResult.dealValue;
          break;
        case 'IMS Signalling':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'signalling'))[0].value += intermediateResult.dealValue;
          break;
        case 'GPRS':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'GPRS'))[0].value += intermediateResult.dealValue;
          break;
        case 'Network Access':
          returnedGeneratedResult[intermediateResult.type].services.access.networkAccess += intermediateResult.dealValue;
          break;
        default:
          returnedGeneratedResult.unexpectedServiceNames.push(intermediateResult.service);
        }
      });

    if (( getCalculateResultResp.header ) && ( getCalculateResultResp.header.version )) {
      returnedGeneratedResult.calculationEngineVersion = getCalculateResultResp.header.version;
    }

    return returnedGeneratedResult;
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
        generatedResult: SettlementMapper.defineGeneratedResult(getCalculateResultResp, usage),
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

  static getResponseBodyForRejectSettlement(settlement) {
    // By default, use mapper getResponseBodyForGetSettlement
    const returnedResponseBody = SettlementMapper.getResponseBodyForGetSettlement(settlement, 'JSON');
    return returnedResponseBody;
  }
}

module
  .exports = SettlementMapper;
