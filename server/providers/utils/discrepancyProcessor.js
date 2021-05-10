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
const logger = require('../../logger');


const GROUPED_RESULT_A = {};
const GROUPED_RESULT_B = {};
const SERVICE_LIST = {};

class discrepancyProcessor {

  constructor() {
  }

  static processUsageA(d) {
    logger.info(d.body);
    const inbound = {services: {}};
    // for (const service in d.body.inbound) {
    for (let i = 0; i < d.body.inbound.length; i++) {
      const tmp = d.body.inbound[i];
      if (inbound.services[tmp.service] == undefined) {
        SERVICE_LIST[tmp.service] = true;
        inbound.services[tmp.service] = { totalUsages: 0.00, totalCharges: 0.00 };
      }
      if ( tmp.usage != undefined ) {
        inbound.services[tmp.service]['totalUsages'] += parseFloat(tmp.usage);
      }
      if ( tmp.charges != undefined ) {
        inbound.services[tmp.service]['totalCharges'] += parseFloat(tmp.charges);
      }
    }
    GROUPED_RESULT_A.inbound = inbound;

    const outbound = {services: {}};
    for (let i = 0; i < d.body.outbound.length; i++) {
      const tmp = d.body.outbound[i];
      if (outbound.services[tmp.service] == undefined) {
        SERVICE_LIST[tmp.service] = true;
        outbound.services[tmp.service] = { totalUsages: 0.00, totalCharges: 0.00 };
      }
      if ( tmp.usage != undefined ) {
        outbound.services[tmp.service]['totalUsages'] += parseFloat(tmp.usage);
      }
      if ( tmp.charges != undefined ) {
        outbound.services[tmp.service]['totalCharges'] += parseFloat(tmp.charges);
      }
    }
    GROUPED_RESULT_A.outbound = outbound;
    logger.info('==========');
    logger.info(JSON.stringify(GROUPED_RESULT_A));
  }

  static processUsageB(d) {
    const inbound = {services: {}};
    for (let i = 0; i < d.body.inbound.length; i++) {
      const tmp = d.body.inbound[i];
      if (inbound.services[tmp.service] == undefined) {
        SERVICE_LIST[tmp.service] = true;
        inbound.services[tmp.service] = { totalUsages: 0.00, totalCharges: 0.00 };
      }
      if ( tmp.usage != undefined ) {
        inbound.services[tmp.service]['totalUsages'] += parseFloat(tmp.usage);
      }
      if ( tmp.charges != undefined ) {
        inbound.services[tmp.service]['totalCharges'] += parseFloat(tmp.charges);
      }
    }
    GROUPED_RESULT_B.inbound = inbound;

    const outbound = {services: {}};
    for (let i = 0; i < d.body.outbound.length; i++) {
      const tmp = d.body.outbound[i];
      if (outbound.services[tmp.service] == undefined) {
        SERVICE_LIST[tmp.service] = true;
        outbound.services[tmp.service] = { totalUsages: 0.00, totalCharges: 0.00 };
      }
      if ( tmp.usage != undefined ) {
        outbound.services[tmp.service]['totalUsages'] += parseFloat(tmp.usage);
      }
      if ( tmp.charges != undefined ) {
        outbound.services[tmp.service]['totalCharges'] += parseFloat(tmp.charges);
      }
    }
    GROUPED_RESULT_B.outbound = outbound;
    logger.info('==========');
    logger.info(JSON.stringify(GROUPED_RESULT_B));
    
  }

  static getMockResults() {
    logger.info('==========Mock REsult');
    const response = {
      homePerspective: {},
      partnerPerspective: {},
    };

    for (const service in SERVICE_LIST) {
      if (SERVICE_LIST[service]) {
        let ownCalculation = 0;
        let partnerCalculation = 0;
        let deltaCalculationPercent = 0;
        let unit = '';
        let subservice = '';
        logger.info('==========' + service);
        switch (service) {
        case 'SMSMO':
          unit = '#';
          subservice = 'sms';
          break;

        case 'MOC':
          unit = 'min';
          subservice = 'data';
          break;

        case 'VOLTE':
          unit = 'min1';
          subservice = 'voice';
          break;

        case 'MOC EU':
          unit = 'min2';
          subservice = 'data';
          break;
        }


        if (response.homePerspective[subservice] == undefined) {
          response.homePerspective[subservice] = {
            unit: unit,
            own_calculation: 0,
            partner_calculation: 0,
            delta_calculation_percent: 0,
            subservices : {}
          };
        }
        if (GROUPED_RESULT_A.inbound.services[service] != undefined) {   
          ownCalculation = GROUPED_RESULT_A.inbound.services[service].totalCharges;
        }

        if (GROUPED_RESULT_B.outbound.services[service] != undefined) {
          partnerCalculation = GROUPED_RESULT_B.outbound.services[service].totalCharges;
        }
        if (ownCalculation == 0) {
          deltaCalculationPercent = 100;
        } else {
          deltaCalculationPercent = ((ownCalculation - partnerCalculation) / ownCalculation ) * -100;
        }

        response.homePerspective[subservice].subservices[service] = {
          unit: unit,
          own_calculation: ownCalculation,
          partner_calculation: partnerCalculation,
          delta_calculation_percent: deltaCalculationPercent
        }

        response.homePerspective[subservice].own_calculation += ownCalculation;
        response.homePerspective[subservice].partner_calculation += partnerCalculation;

        ownCalculation = 0;
        partnerCalculation = 0;
        deltaCalculationPercent = 0;

        if (response.partnerPerspective[subservice] == undefined) {
          response.partnerPerspective[subservice] = {
            unit: unit,
            own_calculation: 0,
            partner_calculation: 0,
            delta_calculation_percent: 0,
            subservices : {}
          };
        }

        if (GROUPED_RESULT_B.inbound.services[service] != undefined) {
          ownCalculation = GROUPED_RESULT_B.inbound.services[service].totalCharges;
        }

        if (GROUPED_RESULT_A.outbound.services[service] != undefined) {
          partnerCalculation = GROUPED_RESULT_A.outbound.services[service].totalCharges;
        }
        if (ownCalculation == 0) {
          deltaCalculationPercent = 100;
        } else {
          deltaCalculationPercent = ((ownCalculation - partnerCalculation) / ownCalculation ) * -100;
        }

        response.partnerPerspective[subservice].subservices[service] = {
          unit: unit,
          own_calculation: ownCalculation,
          partner_calculation: partnerCalculation,
          delta_calculation_percent: deltaCalculationPercent
        }

        response.partnerPerspective[subservice].own_calculation += ownCalculation;
        response.partnerPerspective[subservice].partner_calculation += partnerCalculation;

      }
    }

    for (const service in response.homePerspective) {
      if (response.homePerspective[service]) {
        let delta = 0;
        if (response.homePerspective[service].own_calculation == 0) {
          delta = 100;
        } else {
          delta = ((response.homePerspective[service].own_calculation - response.homePerspective[service].partner_calculation) / response.homePerspective[service].own_calculation ) * -100;
        }
        response.homePerspective[service].delta_calculation_percent = delta;
      }
    }

    for (const service in response.partnerPerspective) {
      if (response.partnerPerspective[service]) {
        let delta = 0;
        if (response.partnerPerspective[service].own_calculation == 0) {
          delta = 100;
        } else {
          delta = ((response.partnerPerspective[service].own_calculation - response.partnerPerspective[service].partner_calculation) / response.partnerPerspective[service].own_calculation ) * -100;
        }
        response.partnerPerspective[service].delta_calculation_percent = delta;
      }
    }

    logger.info('=====2=====' + JSON.stringify(response));
    return response;
  }



  static getMockResults2() {
    logger.info('==========Mock REsult2');
    const response = {
      homePerspective: {},
      partnerPerspective: {},
    };

    for (const service in SERVICE_LIST) {
      if (SERVICE_LIST[service]) {
        let ownUsages = 0;
        let partnerUsages = 0;
        let deltaUsagesPercent = 0;
        let unit = '';
        let subservice = '';
        switch (service) {
        case 'SMSMO':
          unit = '#';
          subservice = 'sms';
          break;

        case 'MOC':
          unit = 'min';
          subservice = 'data';
          break;

        case 'VOLTE':
          unit = 'min1';
          subservice = 'voice';
          break;

        case 'MOC EU':
          unit = 'min2';
          subservice = 'data';
          break;
        }


        if (response.homePerspective[subservice] == undefined) {
          response.homePerspective[subservice] = {
            unit: unit,
            own_usages: 0,
            partner_usages: 0,
            delta_usages_percent: 0,
            subservices : {}
          };
        }
        if (GROUPED_RESULT_A.inbound.services[service] != undefined) {   
          ownUsages = GROUPED_RESULT_A.inbound.services[service].totalUsages;
        }

        if (GROUPED_RESULT_B.outbound.services[service] != undefined) {
          partnerUsages = GROUPED_RESULT_B.outbound.services[service].totalCharges;
        }
        if (ownUsages == 0) {
          deltaUsagesPercent = 100;
        } else {
          deltaUsagesPercent = ((ownUsages - partnerUsages) / ownUsages ) * -100;
        }

        response.homePerspective[subservice].subservices[service] = {
          unit: unit,
          own_usages: ownUsages,
          partner_usages: partnerUsages,
          delta_usages_percent: deltaUsagesPercent
        }

        response.homePerspective[subservice].own_usages += ownUsages;
        response.homePerspective[subservice].partner_usages += partnerUsages;

        ownUsages = 0;
        partnerUsages = 0;
        deltaUsagesPercent = 0;

        if (response.partnerPerspective[subservice] == undefined) {
          response.partnerPerspective[subservice] = {
            unit: unit,
            own_usages: 0,
            partner_usages: 0,
            delta_usages_percent: 0,
            subservices : {}
          };
        }

        if (GROUPED_RESULT_B.inbound.services[service] != undefined) {
          ownUsages = GROUPED_RESULT_B.inbound.services[service].totalUsages;
        }

        if (GROUPED_RESULT_A.outbound.services[service] != undefined) {
          partnerUsages = GROUPED_RESULT_A.outbound.services[service].totalUsages;
        }
        if (ownUsages == 0) {
          deltaUsagesPercent = 100;
        } else {
          deltaUsagesPercent = ((ownUsages - partnerUsages) / ownUsages ) * -100;
        }

        response.partnerPerspective[subservice].subservices[service] = {
          unit: unit,
          own_usages: ownUsages,
          partner_usages: partnerUsages,
          delta_usasges_percent: deltaUsagesPercent
        }

        response.partnerPerspective[subservice].own_usages += ownUsages;
        response.partnerPerspective[subservice].partner_usages += partnerUsages;

      }
    }

    for (const service in response.homePerspective) {
      if (response.homePerspective[service]) {
        let delta = 0;
        if (response.homePerspective[service].own_usages == 0) {
          delta = 100;
        } else {
          delta = ((response.homePerspective[service].own_usages - response.homePerspective[service].partner_usages) / response.homePerspective[service].own_usages ) * -100;
        }
        response.homePerspective[service].delta_usages_percent = delta;
      }
    }

    for (const service in response.partnerPerspective) {
      if (response.partnerPerspective[service]) {
        let delta = 0;
        if (response.partnerPerspective[service].own_usages == 0) {
          delta = 100;
        } else {
          delta = ((response.partnerPerspective[service].own_usages - response.partnerPerspective[service].partner_usages) / response.partnerPerspective[service].own_usages ) * -100;
        }
        response.partnerPerspective[service].delta_usages_percent = delta;
      }
    }

    logger.info('=====3=====' + JSON.stringify(response));
    return response;
  }


}

module.exports = discrepancyProcessor;