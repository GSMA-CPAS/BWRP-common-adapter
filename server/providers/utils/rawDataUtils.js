'use strict';

class RawDataUtils {
  static defineRawDataFromContract(c) {
    const rawDataObject = {};
    rawDataObject.type = c.type;
    rawDataObject.version = c.version;
    rawDataObject.name = c.name;
    rawDataObject.fromMsp = c.fromMsp ? c.fromMsp : {}; // to keep signatures if specified
    rawDataObject.toMsp = c.toMsp ? c.toMsp : {}; // to keep signatures if specified
    rawDataObject.body = c.body;
    const stringToEncode = JSON.stringify(rawDataObject);

    return Buffer.from(stringToEncode).toString('base64');
  }

  static defineRawDataObjectFromRawData(d) {
    const stringToParse = Buffer.from(d, 'base64').toString();
    const returnedObject = JSON.parse(stringToParse);
    returnedObject.rawData = d;
    return returnedObject;
  }

  static defineContractFromRawDataObject(rawDataObject, fromMSP, toMSP, id, timestamp) {
    const contract = rawDataObject;

    contract.fromMsp = contract.fromMsp ? contract.fromMsp : {};
    contract.fromMsp.mspId = fromMSP;
    contract.toMsp = contract.toMsp ? contract.toMsp : {};
    contract.toMsp.mspId = toMSP;
    contract.documentId = id;
    contract.timestamp = timestamp;
    contract.state = 'RECEIVED';
    return contract;
  }

  static defineUsageFromRawDataObject(rawDataObject, fromMSP, toMSP, id, timestamp) {
    const usage = rawDataObject;
    usage.timestamp = timestamp;
    return usage;
  }

  static defineSettlementFromRawDataObject(rawDataObject, fromMSP, toMSP, id, timestamp) {
    const settlement = rawDataObject;
    settlement.timestamp = timestamp;
    return settlement;
  }
}

module.exports = RawDataUtils;
