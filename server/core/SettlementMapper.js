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
              'local': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'backHome': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'international': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'premium': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'ROW': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'EU': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'EEA': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'satellite': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'videoTelephony': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'specialDestinations': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            'MTC': {dealValue: 0, shortOfCommitment: 0, usage: 0}
          },
          SMS: {
            MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
            MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
          },
          data: [
            {
              'name': 'GPRS',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'M2M',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'NB-IOT',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'LTE-M',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'VoLTE',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'ViLTE',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'signalling',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            }],
          access: {
            networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}
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
              'local': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'backHome': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'international': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'premium': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'ROW': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'EU': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'EEA': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'satellite': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'videoTelephony': {dealValue: 0, shortOfCommitment: 0, usage: 0},
              'specialDestinations': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            'MTC': {dealValue: 0, shortOfCommitment: 0, usage: 0}
          },
          SMS: {
            MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
            MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
          },
          data: [
            {
              'name': 'GPRS',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'M2M',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'NB-IOT',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'LTE-M',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'VoLTE',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'ViLTE',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            },
            {
              'name': 'signalling',
              'value': {dealValue: 0, shortOfCommitment: 0, usage: 0}
            }],
          access: {
            networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}
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
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.backHome.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.backHome.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.backHome.usage += intermediateResult.usage;
          break;
        case 'MOC Local':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.local.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.local.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.local.usage += intermediateResult.usage;
          break;
        case 'MOC International':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.international.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.international.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.international.usage += intermediateResult.usage;
          break;
        case 'MOC EU':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EU.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EU.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EU.usage += intermediateResult.usage;
          break;
        case 'MOC EEA':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EEA.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EEA.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EEA.usage += intermediateResult.usage;
          break;
        case 'MOC RoW':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.ROW.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.ROW.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.ROW.usage += intermediateResult.usage;
          break;
        case 'MOC Premium':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.premium.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.premium.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.premium.usage += intermediateResult.usage;
          break;
        case 'MOC Satellite':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.satellite.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.satellite.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.satellite.usage += intermediateResult.usage;
          break;
        case 'MOC Video Telephony':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.videoTelephony.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.videoTelephony.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.videoTelephony.usage += intermediateResult.usage;
          break;
        case 'MOC Special Destinations':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.specialDestinations.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.specialDestinations.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.specialDestinations.usage += intermediateResult.usage;
          break;
        case 'MTC':
          returnedGeneratedResult[intermediateResult.type].services.voice.MTC.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.voice.MTC.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.voice.MTC.usage += intermediateResult.usage;
          break;
        case 'SMS MO':
        case 'SMSMO':
          returnedGeneratedResult[intermediateResult.type].services.SMS.MO.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.SMS.MO.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.SMS.MO.usage += intermediateResult.usage;
          break;
        case 'SMS MT':
        case 'SMSMT':
          returnedGeneratedResult[intermediateResult.type].services.SMS.MT.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.SMS.MT.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.SMS.MT.usage += intermediateResult.usage;
          break;
        case 'M2M':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'M2M'))[0].value.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'M2M'))[0].value.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'M2M'))[0].value.usage += intermediateResult.usage;
          break;
        case 'NB-IoT':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'NB-IOT'))[0].value.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'NB-IOT'))[0].value.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'NB-IOT'))[0].value.usage += intermediateResult.usage;
          break;
        case 'LTE-M':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'LTE-M'))[0].value.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'LTE-M'))[0].value.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'LTE-M'))[0].value.usage += intermediateResult.usage;
          break;
        case 'VoLTE':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'VoLTE'))[0].value.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'VoLTE'))[0].value.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'VoLTE'))[0].value.usage += intermediateResult.usage;
          break;
        case 'ViLTE':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'ViLTE'))[0].value.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'ViLTE'))[0].value.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'ViLTE'))[0].value.usage += intermediateResult.usage;
          break;
        case 'IMS Signalling':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'signalling'))[0].value.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'signalling'))[0].value.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'signalling'))[0].value.usage += intermediateResult.usage;
          break;
        case 'GPRS':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'GPRS'))[0].value.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'GPRS'))[0].value.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'GPRS'))[0].value.usage += intermediateResult.usage;
          break;
        case 'Network Access':
          returnedGeneratedResult[intermediateResult.type].services.access.networkAccess.dealValue += intermediateResult.dealValue;
          returnedGeneratedResult[intermediateResult.type].services.access.networkAccess.shortOfCommitment += intermediateResult.shortOfCommitment;
          returnedGeneratedResult[intermediateResult.type].services.access.networkAccess.usage += intermediateResult.usage;
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
