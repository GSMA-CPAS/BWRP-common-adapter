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

const dataset = 'initial_dataset_on_discrepancy_service';
// const dataset = 'kong_dataset_on_discrepancy_service';
// const dataset = 'elira_dataset_on_discrepancy_service';
// const dataset = 'federico_dataset_on_discrepancy_service';

// const usageDiscrepancyFileName = undefined;
const usageDiscrepancyFileName = '0003_EXPECTED_JSON_DTAG_local_usage_discrepancy_body.json';
// const usageDiscrepancyFileName = '0003_EXPECTED_JSON_TMUS_local_usage_discrepancy_body.json';

const settlementDiscrepancyFileName = undefined;
// const settlementDiscrepancyFileName = '0003_EXPECTED_JSON_DTAG_local_settlement_discrepancy_body.json';
// const settlementDiscrepancyFileName = '0003_EXPECTED_JSON_TMUS_local_settlement_discrepancy_body.json';

const expectedUsageDiscrepancyFile = usageDiscrepancyFileName ? require(`../scenarios/0003_data/${dataset}/${usageDiscrepancyFileName}`) : undefined;
const expectedSettlementDiscrepancyFile = settlementDiscrepancyFileName ? require(`../scenarios/0003_data/${dataset}/${settlementDiscrepancyFileName}`) : undefined;

const USAGE_DISCREPANCY_SERVICE_ORDER_IN_GENERAL_INFORMATION = ['MOC', 'SMS', 'Data'];
const USAGE_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_GENERAL_INFORMATION = ['service', 'unit', 'inbound_own_usage', 'inbound_partner_usage', 'inbound_discrepancy', 'outbound_own_usage', 'outbound_partner_usage', 'outbound_discrepancy'];

const USAGE_DISCREPANCY_USAGE_SERVICE_ORDER = ['SMSMO', 'GPRS', 'MOC EU', 'MOC Local', 'VoLTE'];
const USAGE_DISCREPANCY_USAGE_FIELDS_ORDER = ['HTMN', 'VPMN', 'yearMonth', 'service', 'own_usage', 'partner_usage', 'delta_usage_abs', 'delta_usage_percent'];

const SETTLEMENT_DISCREPANCY_SERVICE_ORDER_IN_GENERAL_INFORMATION = ['Voice', 'SMS', 'Data'];
const SETTLEMENT_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_GENERAL_INFORMATION = ['bearer', 'service', 'unit', 'own_calculation', 'partner_calculation', 'delta_calculation_percent', 'own_usage', 'partner_usage', 'delta_usage_abs', 'delta_usage_percent'];

const SETTLEMENT_DISCREPANCY_SERVICE_ORDER_IN_DETAILS = ['MOC Back Home', 'MOC Local', 'MOC EU', 'MOC RoW', 'SMSMO', 'VoLTE'];
const SETTLEMENT_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_DETAILS = ['service', 'unit', 'own_calculation', 'partner_calculation', 'delta_calculation_percent', 'own_usage', 'partner_usage', 'delta_usage_abs', 'delta_usage_percent'];

const sortObjByKey = (value, order) => {
  if (typeof value !== 'object') {
    return value;
  } else if (Array.isArray(value)) {
    return value.map((content) => {
      return sortObjByKey(content, order);
    });
  } else {
    return Object.keys(value).sort((a, b) => {
      return compareValuesFromOrderRef(a, b, order);
    }).reduce((o, key) => {
      const v = value[key];
      o[key] = sortObjByKey(v, order);
      return o;
    }, {});
  }
};

const compareStringValues = (a, b) => {
  let returnedResult = 0;
  if ((a === undefined) && (b === undefined)) {
    returnedResult = 0;
  } else if (a === undefined) {
    returnedResult = 1;
  } else if (b === undefined) {
    returnedResult = -1;
  } else {
    returnedResult = a.localeCompare(b);
  }
  return returnedResult;
};

const compareValuesFromOrderRef = (a, b, order) => {
  const aIndex = order.indexOf(a);
  const bIndex = order.indexOf(b);
  let returnedResult = 0;
  if ((a === undefined) && (b === undefined)) {
    returnedResult = 0;
  } else if (a === undefined) {
    returnedResult = 1;
  } else if (b === undefined) {
    returnedResult = -1;
  } else if ((bIndex == -1) && (aIndex == -1)) {
    returnedResult = a.localeCompare(b);
  } else if (bIndex == -1) {
    returnedResult = -1;
  } else if (aIndex == -1) {
    returnedResult = 1;
  } else {
    // compare indexes
    if (aIndex > bIndex) {
      returnedResult = 1;
    } else if (aIndex < bIndex) {
      returnedResult = -1;
    } else {
      returnedResult = 0;
    }
  }
  return returnedResult;
};

if (expectedUsageDiscrepancyFile !== undefined) {
  expectedUsageDiscrepancyFile.general_information = expectedUsageDiscrepancyFile.general_information.sort((a, b) => {
    const serviceCompareResult = compareValuesFromOrderRef(a.service, b.service, USAGE_DISCREPANCY_SERVICE_ORDER_IN_GENERAL_INFORMATION);
    if (serviceCompareResult !== 0) {
      return serviceCompareResult;
    } else {
      return serviceCompareResult;
    }
  }).map((a) => {
    return sortObjByKey(a, USAGE_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_GENERAL_INFORMATION);
  });

  expectedUsageDiscrepancyFile.inbound = expectedUsageDiscrepancyFile.inbound.sort((a, b) => {
    const yearMonthCompareResult = compareStringValues(a.yearMonth, b.yearMonth);
    if (yearMonthCompareResult !== 0) {
      return yearMonthCompareResult;
    } else {
      const serviceCompareResult = compareValuesFromOrderRef(a.service, b.service, USAGE_DISCREPANCY_USAGE_SERVICE_ORDER);
      if (serviceCompareResult !== 0) {
        return serviceCompareResult;
      } else {
        const serviceCompareResult = compareStringValues(a.HTMN, b.HTMN);
        if (serviceCompareResult !== 0) {
          return serviceCompareResult;
        } else {
          const serviceCompareResult = compareStringValues(a.VPMN, b.VPMN);
          if (serviceCompareResult !== 0) {
            return serviceCompareResult;
          } else {
            return serviceCompareResult;
          }
        }
      }
    }
  }).map((a) => {
    return sortObjByKey(a, USAGE_DISCREPANCY_USAGE_FIELDS_ORDER);
  });

  expectedUsageDiscrepancyFile.outbound = expectedUsageDiscrepancyFile.outbound.sort((a, b) => {
    const yearMonthCompareResult = compareStringValues(a.yearMonth, b.yearMonth);
    if (yearMonthCompareResult !== 0) {
      return yearMonthCompareResult;
    } else {
      const serviceCompareResult = compareValuesFromOrderRef(a.service, b.service, USAGE_DISCREPANCY_USAGE_SERVICE_ORDER);
      if (serviceCompareResult !== 0) {
        return serviceCompareResult;
      } else {
        const serviceCompareResult = compareStringValues(a.HTMN, b.HTMN);
        if (serviceCompareResult !== 0) {
          return serviceCompareResult;
        } else {
          const serviceCompareResult = compareStringValues(a.VPMN, b.VPMN);
          if (serviceCompareResult !== 0) {
            return serviceCompareResult;
          } else {
            return serviceCompareResult;
          }
        }
      }
    }
  }).map((a) => {
    return sortObjByKey(a, USAGE_DISCREPANCY_USAGE_FIELDS_ORDER);
  });
  console.log(JSON.stringify(expectedUsageDiscrepancyFile, undefined, 2));
} else if (expectedSettlementDiscrepancyFile !== undefined) {
  expectedSettlementDiscrepancyFile.homePerspective.general_information = expectedSettlementDiscrepancyFile.homePerspective.general_information.sort((a, b) => {
    const serviceCompareResult = compareValuesFromOrderRef(a.bearer, b.bearer, SETTLEMENT_DISCREPANCY_SERVICE_ORDER_IN_GENERAL_INFORMATION);
    if (serviceCompareResult !== 0) {
      return serviceCompareResult;
    } else {
      return serviceCompareResult;
    }
  }).map((a) => {
    return sortObjByKey(a, SETTLEMENT_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_GENERAL_INFORMATION);
  });

  expectedSettlementDiscrepancyFile.partnerPerspective.general_information = expectedSettlementDiscrepancyFile.partnerPerspective.general_information.sort((a, b) => {
    const serviceCompareResult = compareValuesFromOrderRef(a.bearer, b.bearer, SETTLEMENT_DISCREPANCY_SERVICE_ORDER_IN_GENERAL_INFORMATION);
    if (serviceCompareResult !== 0) {
      return serviceCompareResult;
    } else {
      return serviceCompareResult;
    }
  }).map((a) => {
    return sortObjByKey(a, SETTLEMENT_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_GENERAL_INFORMATION);
  });

  expectedSettlementDiscrepancyFile.homePerspective.details = expectedSettlementDiscrepancyFile.homePerspective.details.sort((a, b) => {
    const serviceCompareResult = compareValuesFromOrderRef(a.service, b.service, SETTLEMENT_DISCREPANCY_SERVICE_ORDER_IN_DETAILS);
    if (serviceCompareResult !== 0) {
      return serviceCompareResult;
    } else {
      return serviceCompareResult;
    }
  }).map((a) => {
    return sortObjByKey(a, SETTLEMENT_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_DETAILS);
  });

  expectedSettlementDiscrepancyFile.partnerPerspective.details = expectedSettlementDiscrepancyFile.partnerPerspective.details.sort((a, b) => {
    const serviceCompareResult = compareValuesFromOrderRef(a.service, b.service, SETTLEMENT_DISCREPANCY_SERVICE_ORDER_IN_DETAILS);
    if (serviceCompareResult !== 0) {
      return serviceCompareResult;
    } else {
      return serviceCompareResult;
    }
  }).map((a) => {
    return sortObjByKey(a, SETTLEMENT_DISCREPANCY_SERVICE_FIELDS_ORDER_IN_DETAILS);
  });
  console.log(JSON.stringify(expectedSettlementDiscrepancyFile, undefined, 2));
}
