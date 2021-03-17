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

  static defineGeneratedResult(getCalculateResultResp) {
    const returnedGeneratedResult = {
      fromDate: '',
      toDate: '',
      calculationEngineVersion: '',
      inbound: {
        tax: {
          rate: ''
        },
        currency: '',
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
        currency: '',
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


    getCalculateResultResp.intermediateResults
      .filter((intermediateResult) => ((intermediateResult.type === 'inbound') || (intermediateResult.type === 'outbound')))
      .forEach((intermediateResult) => {
        switch (intermediateResult.service) {
        case 'MOC Back Home':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.backHome += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC Local':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.local += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC International':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.international += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC EU':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EU += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC EEA':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.EEA += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC RoW':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.ROW += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC Premium':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.premium += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC Satellite':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.satellite += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC Video Telephony':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.videoTelephony += parseFloat(intermediateResult.dealValue);
          break;
        case 'MOC Special Destinations':
          returnedGeneratedResult[intermediateResult.type].services.voice.MOC.specialDestinations += parseFloat(intermediateResult.dealValue);
          break;
        case 'MTC':
          returnedGeneratedResult[intermediateResult.type].services.voice.MTC += parseFloat(intermediateResult.dealValue);
          break;
        case 'SMSMO':
          returnedGeneratedResult[intermediateResult.type].services.SMS.MO += parseFloat(intermediateResult.dealValue);
          break;
        case 'SMSMT':
          returnedGeneratedResult[intermediateResult.type].services.SMS.MT += parseFloat(intermediateResult.dealValue);
          break;
        case 'M2M':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'M2M'))[0].value += parseFloat(intermediateResult.dealValue);
          break;
        case 'NB-IoT':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'NB-IOT'))[0].value += parseFloat(intermediateResult.dealValue);
          break;
        case 'LTE-M':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'LTE-M'))[0].value += parseFloat(intermediateResult.dealValue);
          break;
        case 'VoLTE':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'VoLTE'))[0].value += parseFloat(intermediateResult.dealValue);
          break;
        case 'ViLTE':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'ViLTE'))[0].value += parseFloat(intermediateResult.dealValue);
          break;
        case 'IMS Signalling':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'signalling'))[0].value += parseFloat(intermediateResult.dealValue);
          break;
        case 'GPRS':
          returnedGeneratedResult[intermediateResult.type].services.data.filter((d) => (d.name === 'GPRS'))[0].value += parseFloat(intermediateResult.dealValue);
          break;
        case 'Network Access':
          returnedGeneratedResult[intermediateResult.type].services.access.networkAccess += parseFloat(intermediateResult.dealValue);
          break;
        default:
          returnedGeneratedResult.unexpectedServiceNames.push(intermediateResult.service);
        }
      });

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
        generatedResult: SettlementMapper.defineGeneratedResult(getCalculateResultResp),
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

module
  .exports = SettlementMapper;
