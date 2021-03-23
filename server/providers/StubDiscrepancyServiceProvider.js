'use strict';

const logger = require('../logger');

/* eslint-disable camelcase */

const STUB_DISCREPANCY = [
  {
    generatedDiscrepancy: {
      data1: 'a',
      data2: 'b',
      object1: {
        object1data10: 'z'
      }
    },
    otherData: ['8', 'test']
  }
];

const numberFormatter = (number) => {
  let d = 1;
  for (let i=0; i < 2; i++) {
    d += '0';
  }
  return Math.round(number * d) / d;
};

/* eslint-disable quotes */
const getStubReturnForGetUsageDiscrepancy = (homeUsage, partnerUsage) => {
  const usageDiscrepancy = {
    "general_information": [],
    "inbound": [],
    "outbound": []
  };

  if ((homeUsage !== undefined) && (homeUsage.body !== undefined) && (partnerUsage !== undefined) && (partnerUsage.body !== undefined)) {
    if ((Array.isArray(homeUsage.body.inbound)) && (Array.isArray(homeUsage.body.outbound)) && (Array.isArray(partnerUsage.body.inbound)) && (Array.isArray(partnerUsage.body.outbound))) {
      // The usages are defined with a valid format
      // This is no validated by the DB today
      const getOneWayUsageDiscrepancy = (homeOneWayServices, correspondingPartnerOneWayServices) => {
        const returnedOneWayUsageDiscrepancy = [];

        let partnerOneWayServicesToFind = correspondingPartnerOneWayServices;

        homeOneWayServices.forEach((homeOneWayService) => {
          const matchingFilterMethod = (partnerOneWayService) => {
            if (homeOneWayService.service !== partnerOneWayService.service) {
              return false;
            } else if (homeOneWayService.yearMonth !== partnerOneWayService.yearMonth) {
              return false;
            } else if (homeOneWayService.homeTadig !== partnerOneWayService.homeTadig) {
              return false;
            } else if (homeOneWayService.visitorTadig !== partnerOneWayService.visitorTadig) {
              return false;
            } else {
              return true;
            }
          };
          const matchingPartnerOneWayServices = partnerOneWayServicesToFind.filter((partnerOneWayService) => matchingFilterMethod(partnerOneWayService));
          const matchingPartnerOneWayService = (matchingPartnerOneWayServices.length !== 0) ? matchingPartnerOneWayServices[0] : {usage: '0'};

          // do not use already found matchingPartnerOneWayServices for next iterations
          partnerOneWayServicesToFind = partnerOneWayServicesToFind.filter((partnerOneWayService) => !matchingFilterMethod(partnerOneWayService));

          const usageDiscrepancyServiceToReturn = {
            "HTMN": homeOneWayService.homeTadig,
            "VPMN": homeOneWayService.visitorTadig,
            "yearMonth": homeOneWayService.yearMonth,
            "service": homeOneWayService.service,
            "own_usage": numberFormatter(parseFloat(homeOneWayService.usage)),
            "partner_usage": numberFormatter(parseFloat(matchingPartnerOneWayService.usage))
          };
          usageDiscrepancyServiceToReturn.delta_usage_abs = numberFormatter(usageDiscrepancyServiceToReturn.partner_usage - usageDiscrepancyServiceToReturn.own_usage);
          if (usageDiscrepancyServiceToReturn.own_usage != 0) {
            usageDiscrepancyServiceToReturn.delta_usage_percent = numberFormatter(100 * usageDiscrepancyServiceToReturn.delta_usage_abs / usageDiscrepancyServiceToReturn.own_usage);
          } else {
            usageDiscrepancyServiceToReturn.delta_usage_percent = numberFormatter(100);
          }
          returnedOneWayUsageDiscrepancy.push(usageDiscrepancyServiceToReturn);
        });

        // if there is some partnerOneWayServicesToFind not already found in homeOneWayServices
        partnerOneWayServicesToFind.forEach((partnerOneWayService) => {
          const homeOneWayService = {usage: '0'};

          const usageDiscrepancyServiceToReturn = {
            "HTMN": partnerOneWayService.homeTadig,
            "VPMN": partnerOneWayService.visitorTadig,
            "yearMonth": partnerOneWayService.yearMonth,
            "service": partnerOneWayService.service,
            "own_usage": numberFormatter(parseFloat(homeOneWayService.usage)),
            "partner_usage": numberFormatter(parseFloat(partnerOneWayService.usage))
          };
          usageDiscrepancyServiceToReturn.delta_usage_abs = numberFormatter(usageDiscrepancyServiceToReturn.partner_usage - usageDiscrepancyServiceToReturn.own_usage);
          if (usageDiscrepancyServiceToReturn.own_usage != 0) {
            usageDiscrepancyServiceToReturn.delta_usage_percent = numberFormatter(100 * usageDiscrepancyServiceToReturn.delta_usage_abs / usageDiscrepancyServiceToReturn.own_usage);
          } else {
            usageDiscrepancyServiceToReturn.delta_usage_percent = numberFormatter(100);
          }
          usageDiscrepancy.inbound.push(usageDiscrepancyServiceToReturn);
        });

        return returnedOneWayUsageDiscrepancy;
      };

      // now use this getOneWayUsageDiscrepancy method
      usageDiscrepancy.inbound = getOneWayUsageDiscrepancy(homeUsage.body.inbound, partnerUsage.body.outbound);
      usageDiscrepancy.outbound = getOneWayUsageDiscrepancy(homeUsage.body.outbound, partnerUsage.body.inbound);

      const getServiceFamily = (service) => {
        if (service.startsWith('MOC ')) {
          return 'MOC';
        } else if (service.startsWith('SMS')) {
          return 'SMS';
        } else {
          return 'Data';
        }
      };

      const MOC_general_information = {
        "service": "MOC",
        "unit": "min",
        "inbound_own_usage": usageDiscrepancy.inbound.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_usage);
        }, numberFormatter(0)),
        "inbound_partner_usage": usageDiscrepancy.inbound.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_usage);
        }, numberFormatter(0)),
        "inbound_discrepancy": numberFormatter(0),
        "outbound_own_usage": usageDiscrepancy.outbound.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_usage);
        }, numberFormatter(0)),
        "outbound_partner_usage": usageDiscrepancy.outbound.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_usage);
        }, numberFormatter(0)),
        "outbound_discrepancy": numberFormatter(0)
      };
      MOC_general_information.inbound_discrepancy = numberFormatter(MOC_general_information.inbound_partner_usage - MOC_general_information.inbound_own_usage);
      MOC_general_information.outbound_discrepancy = numberFormatter(MOC_general_information.outbound_partner_usage - MOC_general_information.outbound_own_usage);

      const SMS_general_information = {
        "service": "SMS",
        "unit": "#",
        "inbound_own_usage": usageDiscrepancy.inbound.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_usage);
        }, numberFormatter(0)),
        "inbound_partner_usage": usageDiscrepancy.inbound.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_usage);
        }, numberFormatter(0)),
        "inbound_discrepancy": numberFormatter(0),
        "outbound_own_usage": usageDiscrepancy.outbound.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_usage);
        }, numberFormatter(0)),
        "outbound_partner_usage": usageDiscrepancy.outbound.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_usage);
        }, numberFormatter(0)),
        "outbound_discrepancy": numberFormatter(0)
      };
      SMS_general_information.inbound_discrepancy = numberFormatter(SMS_general_information.inbound_partner_usage - SMS_general_information.inbound_own_usage);
      SMS_general_information.outbound_discrepancy = numberFormatter(SMS_general_information.outbound_partner_usage - SMS_general_information.outbound_own_usage);

      const Data_general_information = {
        "service": "Data",
        "unit": "min",
        "inbound_own_usage": usageDiscrepancy.inbound.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_usage);
        }, numberFormatter(0)),
        "inbound_partner_usage": usageDiscrepancy.inbound.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_usage);
        }, numberFormatter(0)),
        "inbound_discrepancy": numberFormatter(0),
        "outbound_own_usage": usageDiscrepancy.outbound.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_usage);
        }, numberFormatter(0)),
        "outbound_partner_usage": usageDiscrepancy.outbound.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_usage);
        }, numberFormatter(0)),
        "outbound_discrepancy": numberFormatter(0)
      };
      Data_general_information.inbound_discrepancy = numberFormatter(Data_general_information.inbound_partner_usage - Data_general_information.inbound_own_usage);
      Data_general_information.outbound_discrepancy = numberFormatter(Data_general_information.outbound_partner_usage - Data_general_information.outbound_own_usage);

      usageDiscrepancy.general_information = [
        MOC_general_information,
        SMS_general_information,
        Data_general_information
      ];
    }
  }

  return usageDiscrepancy;
};
/* eslint-enable quotes */

/* eslint-disable quotes */
const getStubReturnForGetSettlementDiscrepancy = (homeSettlement, partnerSettlement) => {
  const settlementDiscrepancy = {
    "homePerspective": {
      "general_information": [],
      "details": []
    },
    "partnerPerspective": {
      "general_information": [],
      "details": []
    }
  };

  const numberFormatter = (number) => {
    let d = 1;
    for (let i=0; i < 2; i++) {
      d += "0";
    }
    return Math.round(number * d) / d;
  };

  const serviceNames = ['MOC Back Home', 'MOC Local', 'MOC International', 'MOC EU', 'MOC EEA', 'MOC RoW', 'MOC Premium', 'MOC Satellite', 'MOC Video Telephony', 'MOC Special Destinations', 'MTC', 'SMSMO', 'SMSMT', 'M2M', 'NB-IoT', 'LTE-M', 'VoLTE', 'ViLTE', 'IMS Signalling', 'GPRS', 'Network Access'];

  const failsafeGetServiceSettlement = (oneWaySettlement, key) => {
    try {
      switch (key) {
      case 'MOC Back Home':
        return oneWaySettlement.services.voice.MOC.backHome;
      case 'MOC Local':
        return oneWaySettlement.services.voice.MOC.local;
      case 'MOC International':
        return oneWaySettlement.services.voice.MOC.international;
      case 'MOC EU':
        return oneWaySettlement.services.voice.MOC.EU;
      case 'MOC EEA':
        return oneWaySettlement.services.voice.MOC.EEA;
      case 'MOC RoW':
        return oneWaySettlement.services.voice.MOC.ROW;
      case 'MOC Premium':
        return oneWaySettlement.services.voice.MOC.premium;
      case 'MOC Satellite':
        return oneWaySettlement.services.voice.MOC.satellite;
      case 'MOC Video Telephony':
        return oneWaySettlement.services.voice.MOC.videoTelephony;
      case 'MOC Special Destinations':
        return oneWaySettlement.services.voice.MOC.specialDestinations;
      case 'MTC':
        return oneWaySettlement.services.voice.MTC;
      case 'SMSMO':
        return oneWaySettlement.services.SMS.MO;
      case 'SMSMT':
        return oneWaySettlement.services.SMS.MT;
      case 'M2M':
        return oneWaySettlement.services.data.filter((d) => (d.name === 'M2M'))[0].value;
      case 'NB-IoT':
        return oneWaySettlement.services.data.filter((d) => (d.name === 'NB-IOT'))[0].value;
      case 'LTE-M':
        return oneWaySettlement.services.data.filter((d) => (d.name === 'LTE-M'))[0].value;
      case 'VoLTE':
        return oneWaySettlement.services.data.filter((d) => (d.name === 'VoLTE'))[0].value;
      case 'ViLTE':
        return oneWaySettlement.services.data.filter((d) => (d.name === 'ViLTE'))[0].value;
      case 'IMS Signalling':
        return oneWaySettlement.services.data.filter((d) => (d.name === 'signalling'))[0].value;
      case 'GPRS':
        return oneWaySettlement.services.data.filter((d) => (d.name === 'GPRS'))[0].value;
      case 'Network Access':
        return oneWaySettlement.services.access.networkAccess;
      default:
        return 0;
      }
    } catch (e) {
      return 0;
    }
  };

  if ((homeSettlement !== undefined) && (homeSettlement.body !== undefined) && (homeSettlement.body.generatedResult !== undefined) && (partnerSettlement !== undefined) && (partnerSettlement.body !== undefined) && (partnerSettlement.body.generatedResult !== undefined) ) {
    if ((homeSettlement.body.generatedResult.inbound !== undefined) && (homeSettlement.body.generatedResult.outbound !== undefined) && (partnerSettlement.body.generatedResult.inbound !== undefined) && (partnerSettlement.body.generatedResult.outbound !== undefined) ) {
      // The settlements are defined with a valid format
      // This is no validated by the DB today
      const getOneWaysettlementDiscrepancy = (homeOneWayServices, correspondingPartnerOneWayServices) => {
        const returnedOneWaySettlementDiscrepancy = [];

        serviceNames.forEach((serviceName) => {
          const homeServiceValue = failsafeGetServiceSettlement(homeOneWayServices, serviceName);
          const partnerServiceValue = failsafeGetServiceSettlement(correspondingPartnerOneWayServices, serviceName);
          if ((homeServiceValue !== 0) || (partnerServiceValue !== 0)) {
            const discrepancyCalculation = {
              service: serviceName,
              unit: "min",
              own_calculation: numberFormatter(homeServiceValue),
              partner_calculation: numberFormatter(partnerServiceValue),
              delta_calculation_percent: numberFormatter(0)
            };
            if (discrepancyCalculation.own_calculation != 0) {
              discrepancyCalculation.delta_calculation_percent = numberFormatter(100 * (discrepancyCalculation.partner_calculation - discrepancyCalculation.own_calculation) / discrepancyCalculation.own_calculation);
            } else {
              discrepancyCalculation.delta_calculation_percent = numberFormatter(100);
            }
            returnedOneWaySettlementDiscrepancy.push(discrepancyCalculation);
          }
        });

        return returnedOneWaySettlementDiscrepancy;
      };

      // now use this getOneWaysettlementDiscrepancy method
      settlementDiscrepancy.homePerspective.details = getOneWaysettlementDiscrepancy(homeSettlement.body.generatedResult.inbound, partnerSettlement.body.generatedResult.outbound);
      settlementDiscrepancy.partnerPerspective.details = getOneWaysettlementDiscrepancy(homeSettlement.body.generatedResult.outbound, partnerSettlement.body.generatedResult.inbound);

      const getServiceFamily = (service) => {
        if (service.startsWith('MOC ')) {
          return 'MOC';
        } else if (service.startsWith('SMS')) {
          return 'SMS';
        } else {
          return 'Data';
        }
      };

      const homePerspective_Voice_general_information = {
        "bearer": "Voice",
        "unit": "min",
        "own_calculation": settlementDiscrepancy.homePerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_calculation);
        }, numberFormatter(0)),
        "partner_calculation": settlementDiscrepancy.homePerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_calculation);
        }, numberFormatter(0)),
        "delta_calculation_percent": numberFormatter(0)
      };
      if (homePerspective_Voice_general_information.own_calculation != 0) {
        homePerspective_Voice_general_information.delta_calculation_percent = numberFormatter(100 * (homePerspective_Voice_general_information.partner_calculation - homePerspective_Voice_general_information.own_calculation) / homePerspective_Voice_general_information.own_calculation);
      } else {
        homePerspective_Voice_general_information.delta_calculation_percent = numberFormatter(100);
      }

      const homePerspective_SMS_general_information = {
        "bearer": "SMS",
        "unit": "#",
        "own_calculation": settlementDiscrepancy.homePerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_calculation);
        }, numberFormatter(0)),
        "partner_calculation": settlementDiscrepancy.homePerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_calculation);
        }, numberFormatter(0)),
        "delta_calculation_percent": numberFormatter(0)
      };
      if (homePerspective_SMS_general_information.own_calculation != 0) {
        homePerspective_SMS_general_information.delta_calculation_percent = numberFormatter(100 * (homePerspective_SMS_general_information.partner_calculation - homePerspective_SMS_general_information.own_calculation) / homePerspective_SMS_general_information.own_calculation);
      } else {
        homePerspective_SMS_general_information.delta_calculation_percent = numberFormatter(100);
      }

      const homePerspective_Data_general_information = {
        "bearer": "Data",
        "unit": "min",
        "own_calculation": settlementDiscrepancy.homePerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_calculation);
        }, numberFormatter(0)),
        "partner_calculation": settlementDiscrepancy.homePerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_calculation);
        }, numberFormatter(0)),
        "delta_calculation_percent": numberFormatter(0)
      };
      if (homePerspective_Data_general_information.own_calculation != 0) {
        homePerspective_Data_general_information.delta_calculation_percent = numberFormatter(100 * (homePerspective_Data_general_information.partner_calculation - homePerspective_Data_general_information.own_calculation) / homePerspective_Data_general_information.own_calculation);
      } else {
        homePerspective_Data_general_information.delta_calculation_percent = numberFormatter(100);
      }

      settlementDiscrepancy.homePerspective.general_information = [
        homePerspective_Voice_general_information,
        homePerspective_SMS_general_information,
        homePerspective_Data_general_information
      ];


      const partnerPerspective_Voice_general_information = {
        "bearer": "Voice",
        "unit": "min",
        "own_calculation": settlementDiscrepancy.partnerPerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_calculation);
        }, numberFormatter(0)),
        "partner_calculation": settlementDiscrepancy.partnerPerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'MOC');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_calculation);
        }, numberFormatter(0)),
        "delta_calculation_percent": numberFormatter(0)
      };
      if (partnerPerspective_Voice_general_information.own_calculation != 0) {
        partnerPerspective_Voice_general_information.delta_calculation_percent = numberFormatter(100 * (partnerPerspective_Voice_general_information.partner_calculation - partnerPerspective_Voice_general_information.own_calculation) / partnerPerspective_Voice_general_information.own_calculation);
      } else {
        partnerPerspective_Voice_general_information.delta_calculation_percent = numberFormatter(100);
      }

      const partnerPerspective_SMS_general_information = {
        "bearer": "SMS",
        "unit": "#",
        "own_calculation": settlementDiscrepancy.partnerPerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_calculation);
        }, numberFormatter(0)),
        "partner_calculation": settlementDiscrepancy.partnerPerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'SMS');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_calculation);
        }, numberFormatter(0)),
        "delta_calculation_percent": numberFormatter(0)
      };
      if (partnerPerspective_SMS_general_information.own_calculation != 0) {
        partnerPerspective_SMS_general_information.delta_calculation_percent = numberFormatter(100 * (partnerPerspective_SMS_general_information.partner_calculation - partnerPerspective_SMS_general_information.own_calculation) / partnerPerspective_SMS_general_information.own_calculation);
      } else {
        partnerPerspective_SMS_general_information.delta_calculation_percent = numberFormatter(100);
      }

      const partnerPerspective_Data_general_information = {
        "bearer": "Data",
        "unit": "min",
        "own_calculation": settlementDiscrepancy.partnerPerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.own_calculation);
        }, numberFormatter(0)),
        "partner_calculation": settlementDiscrepancy.partnerPerspective.details.filter((service) => {
          return (getServiceFamily(service.service) === 'Data');
        }).reduce((a, b) => {
          return numberFormatter(a + b.partner_calculation);
        }, numberFormatter(0)),
        "delta_calculation_percent": numberFormatter(0)
      };
      if (partnerPerspective_Data_general_information.own_calculation != 0) {
        partnerPerspective_Data_general_information.delta_calculation_percent = numberFormatter(100 * (partnerPerspective_Data_general_information.partner_calculation - partnerPerspective_Data_general_information.own_calculation) / partnerPerspective_Data_general_information.own_calculation);
      } else {
        partnerPerspective_Data_general_information.delta_calculation_percent = numberFormatter(100);
      }

      settlementDiscrepancy.partnerPerspective.general_information = [
        partnerPerspective_Voice_general_information,
        partnerPerspective_SMS_general_information,
        partnerPerspective_Data_general_information
      ];
    }
  }

  return settlementDiscrepancy;
};
/* eslint-enable quotes */

const defineUsageToSendToDiscrepancyService = (usage) => {
  // to remove rawData, history, __v, ...
  return {
    storageKeys: usage.storageKeys,
    state: usage.state,
    contractId: usage.contractId,
    name: usage.name,
    type: usage.type,
    version: usage.version,
    mspOwner: usage.mspOwner,
    mspReceiver: usage.mspReceiver,
    body: usage.body,
    id: usage.id,
    creationDate: usage.creationDate,
    lastModificationDate: usage.lastModificationDate,
    contractReferenceId: usage.contractReferenceId,
    blockchainRef: usage.blockchainRef,
    referenceId: usage.referenceId,
    settlementId: usage.settlementId,
  };
};

class DiscrepancyServiceProvider {
  constructor() {
    logger.info('[StubDiscrepancyServiceProvider::constructor] You\'re running a Stub version of DiscrepancyServiceProvider');
  }

  /**
   *
   * @param {Object} usage
   * @param {Object} settlement
   * @return {Promise<Object>}
   */
  async createDiscrepancy(usage, settlement) {
    try {
      const response = STUB_DISCREPANCY[0];
      response.localUsage = defineUsageToSendToDiscrepancyService(usage);
      response.remoteUsage = defineUsageToSendToDiscrepancyService(settlement.body.usage);
      return response;
    } catch (error) {
      logger.error('[StubDiscrepancyServiceProvider::createDiscrepancy] failed to create discrepancy', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} settlement
   * @param {Object} settlementToCompare
   * @return {Promise<Object>}
   */
  async getSettlementDiscrepancy(settlement, settlementToCompare) {
    try {
      const response = getStubReturnForGetSettlementDiscrepancy(settlement, settlementToCompare);
      // const response = STUB_DISCREPANCY[0];
      // response.localUsage = defineUsageToSendToDiscrepancyService(settlement.body.usage);
      // response.remoteUsage = defineUsageToSendToDiscrepancyService(settlementToCompare.body.usage);
      return response;
    } catch (error) {
      logger.error('[StubDiscrepancyServiceProvider::getSettlementDiscrepancy] failed to get discrepancy', error.message);
      throw error;
    }
  }

  /**
   *
   * @param {Object} usage
   * @param {Object} usageToCompare
   * @return {Promise<Object>}
   */
  async getUsageDiscrepancy(usage, usageToCompare) {
    try {
      const response = getStubReturnForGetUsageDiscrepancy(usage, usageToCompare);
      // const response = STUB_DISCREPANCY[0];
      // response.localUsage = defineUsageToSendToDiscrepancyService(usage);
      // response.remoteUsage = defineUsageToSendToDiscrepancyService(usageToCompare);
      return response;
    } catch (error) {
      logger.error('[StubDiscrepancyServiceProvider::getUsageDiscrepancy] failed to get discrepancy', error.message);
      throw error;
    }
  }
}
/* eslint-enable camelcase */

module.exports = DiscrepancyServiceProvider;
