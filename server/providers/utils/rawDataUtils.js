'use strict';

class RawDataUtils {
  static defineRawDataFromContract(c) {
    const rawDataObject = {
      header: {
        type: c.type,
        version: c.version,
        name: c.name,
        fromMsp: c.fromMsp ? c.fromMsp : {},
        toMsp: c.toMsp ? c.toMsp : {}
      },
      body: c.body
    };
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
    const contract = {
      type: rawDataObject.header.type,
      version: rawDataObject.header.version,
      name: rawDataObject.header.name,
      fromMsp: rawDataObject.header.fromMsp,
      toMsp: rawDataObject.header.toMsp,
      body: rawDataObject.body,
      rawData: rawDataObject.rawData
    };

    contract.fromMsp = contract.fromMsp ? contract.fromMsp : {};
    contract.fromMsp.mspId = fromMSP;
    contract.toMsp = contract.toMsp ? contract.toMsp : {};
    contract.toMsp.mspId = toMSP;
    contract.referenceId = id;
    contract.timestamp = timestamp;
    contract.state = 'RECEIVED';
    return contract;
  }

  static defineUsageFromRawDataObject(rawDataObject, fromMSP, toMSP, id, timestamp) {
    const usage = {
      contractReferenceId: rawDataObject.contractReferenceId,
      mspOwner: rawDataObject.mspOwner,
      mspReceiver: rawDataObject.mspReceiver,
      type: rawDataObject.header.type,
      version: rawDataObject.header.version,
      name: rawDataObject.header.name,
      body: rawDataObject.body,
      rawData: rawDataObject.rawData
    };
    usage.referenceId = id;
    usage.timestamp = timestamp;
    usage.state = 'RECEIVED';
    return usage;
  }

  static defineSettlementFromRawDataObject(rawDataObject, fromMSP, toMSP, id, timestamp) {
    const settlement = {
      contractReferenceId: rawDataObject.contractReferenceId,
      mspOwner: rawDataObject.mspOwner,
      mspReceiver: rawDataObject.mspReceiver,
      type: rawDataObject.header.type,
      version: rawDataObject.header.version,
      name: rawDataObject.header.name,
      body: rawDataObject.body,
      rawData: rawDataObject.rawData
    };
    settlement.referenceId = id;
    settlement.timestamp = timestamp;
    settlement.state = 'RECEIVED';
    return settlement;
  }

  static defineRawDataFromUsage(u) {
    const rawDataObject = {
      contractReferenceId: u.contractReferenceId,
      mspOwner: u.mspOwner,
      mspReceiver: u.mspReceiver,
      header: {
        type: u.type,
        version: u.version,
        name: u.name
      },
      body: u.body
    };
    const stringToEncode = JSON.stringify(rawDataObject);

    return Buffer.from(stringToEncode).toString('base64');
  }

  static defineRawDataFromSettlement(s) {
    const rawDataObject = {
      contractReferenceId: s.contractReferenceId,
      mspOwner: s.mspOwner,
      mspReceiver: s.mspReceiver,
      header: {
        type: s.type,
        version: s.version,
        name: s.name
      },
      body: s.body
    };
    const stringToEncode = JSON.stringify(rawDataObject);

    return Buffer.from(stringToEncode).toString('base64');
  }
}

module.exports = RawDataUtils;
