
// const expectedUsageDiscrepancyFile = require(`../scenarios/0003_data/initial_dataset/0003_EXPECTED_JSON_DTAG_local_usage_discrepancy_body.json`);
const expectedUsageDiscrepancyFile = require(`../scenarios/0003_data/initial_dataset_on_discrepancy_service/0003_EXPECTED_JSON_TMUS_local_usage_discrepancy_body.json`);

const GENERAL_INFORMATION_SERVICE_ORDER = ['MOC', 'SMS', 'Data'];
const GENERAL_INFORMATION_SERVICE_FIELDS_ORDER = ['service', 'unit', 'inbound_own_usage', 'inbound_partner_usage', 'inbound_discrepancy', 'outbound_own_usage', 'outbound_partner_usage', 'outbound_discrepancy'];

const GENERAL_INFORMATION_USAGE_SERVICE_ORDER = ['MOC EU', 'MOC Local', 'SMSMO', 'VoLTE'];
const GENERAL_INFORMATION_USAGE_FIELDS_ORDER = ['HTMN', 'VPMN', 'yearMonth', 'service', 'own_usage', 'partner_usage', 'delta_usage_abs', 'delta_usage_percent'];

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
  return a.localeCompare(b);
};

const compareValuesFromOrderRef = (a, b, order) => {
  const aIndex = order.indexOf(a);
  const bIndex = order.indexOf(b);
  let returnedResult = 0;
  if ((bIndex == -1) && (aIndex == -1)) {
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

expectedUsageDiscrepancyFile.general_information = expectedUsageDiscrepancyFile.general_information.sort((a, b) => {
  const serviceCompareResult = compareValuesFromOrderRef(a.service, b.service, GENERAL_INFORMATION_SERVICE_ORDER);
  if (serviceCompareResult !== 0) {
    return serviceCompareResult;
  } else {
    return serviceCompareResult;
  }
}).map((a) => {
  return sortObjByKey(a, GENERAL_INFORMATION_SERVICE_FIELDS_ORDER);
});

expectedUsageDiscrepancyFile.inbound = expectedUsageDiscrepancyFile.inbound.sort((a, b) => {
  const yearMonthCompareResult = compareStringValues(a.yearMonth, b.yearMonth);
  if (yearMonthCompareResult !== 0) {
    return yearMonthCompareResult;
  } else {
    const serviceCompareResult = compareValuesFromOrderRef(a.service, b.service, GENERAL_INFORMATION_USAGE_SERVICE_ORDER);
    if (serviceCompareResult !== 0) {
      return serviceCompareResult;
    } else {
      return serviceCompareResult;
    }
  }
}).map((a) => {
  return sortObjByKey(a, GENERAL_INFORMATION_USAGE_FIELDS_ORDER);
});

console.log(JSON.stringify(expectedUsageDiscrepancyFile, undefined, 2));

