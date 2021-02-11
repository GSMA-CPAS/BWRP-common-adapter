/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const testedRawDataUtils = require('../../providers/utils/rawDataUtils');

const expect = require('chai').expect;

describe('Unit Tests for rawDataUtils', function() {
  it('Should generate a contract rawData and decode the contract from this rawData', function(done) {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: 'A1'
      },
      toMsp: {
        mspId: 'B1'
      },
      body: {
        bankDetails: {
          A1: {
            iban: null,
            bankName: null,
            currency: null
          },
          B1: {
            iban: null,
            bankName: null,
            currency: null
          }
        },
        discountModels: 'someData',
        generalInformation: {
          name: 'test3',
          type: 'Normal',
          endDate: '2021-01-01T00:00:00.000Z',
          startDate: '2020-12-01T00:00:00.000Z'
        }
      },
      rawData: 'Ctr_raw-data-1'
    };

    const rawDataForContract1 = testedRawDataUtils.defineRawDataFromContract(contract1);

    const blockchainResp = {
      data: rawDataForContract1,
      fromMSP: 'A1',
      toMSP: 'B1',
      id: 'referenceIddzayudgzadazhduazdza',
      timeStamp: '156262878176626327'
    };

    const rawDataObjectForContract1 = testedRawDataUtils.defineRawDataObjectFromRawData(blockchainResp.data);

    const rawDataContractForContract1 = testedRawDataUtils.defineContractFromRawDataObject(rawDataObjectForContract1, blockchainResp.fromMSP, blockchainResp.toMSP, blockchainResp.id, blockchainResp.timeStamp);

    expect(rawDataContractForContract1).to.be.an('object');
    expect(rawDataContractForContract1).to.have.property('name', contract1.name);
    expect(rawDataContractForContract1).to.have.property('state', 'RECEIVED');
    expect(rawDataContractForContract1).to.have.property('type', contract1.type);
    expect(rawDataContractForContract1).to.have.property('version', contract1.version);

    expect(rawDataContractForContract1).to.have.property('rawData', rawDataForContract1);
    expect(rawDataContractForContract1).to.have.property('referenceId', blockchainResp.id);
    expect(rawDataContractForContract1).to.have.property('timestamp', blockchainResp.timeStamp);

    expect(rawDataContractForContract1).to.have.property('fromMsp').that.is.an('object');
    expect(rawDataContractForContract1.fromMsp).to.have.property('mspId', blockchainResp.fromMSP);

    expect(rawDataContractForContract1).to.have.property('toMsp').that.is.an('object');
    expect(rawDataContractForContract1.toMsp).to.have.property('mspId', blockchainResp.toMSP);

    expect(rawDataContractForContract1).to.have.property('body').that.is.an('object');
    expect(rawDataContractForContract1.body).to.deep.include(contract1.body);

    debug('rawDataContractForContract1 = ', rawDataContractForContract1);

    done();
  });

  it('Should generate a usage rawData and decode the usage from this rawData', function(done) {
    const usage1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'usage data',
      contractId: 'azerty-1234',
      contractReferenceId: 'blockchain-contract-ref-id-898786785654',
      mspOwner: 'H23',
      mspReceiver: 'J89',
      body: {
        usageData: {
          A1: {
            iban: null,
            bankName: null,
            currency: null
          },
          B1: {
            iban: null,
            bankName: null,
            currency: null
          }
        },
        otherDataModels: 'someData',
        generalData: {
          name: 'test3',
          type: 'Normal',
          endDate: '2021-01-01T00:00:00.000Z',
          startDate: '2020-12-01T00:00:00.000Z'
        }
      },
      state: 'DRAFT'
    };

    const rawDataForUsage1 = testedRawDataUtils.defineRawDataFromUsage(usage1);

    const blockchainResp = {
      data: rawDataForUsage1,
      fromMSP: 'H23',
      toMSP: 'J89',
      id: 'referenceIddzayudgzadazhduazdza',
      timeStamp: '156262878176626327'
    };

    const rawDataObjectForUsage1 = testedRawDataUtils.defineRawDataObjectFromRawData(blockchainResp.data);

    const rawDataUsageForUsage1 = testedRawDataUtils.defineSettlementFromRawDataObject(rawDataObjectForUsage1, blockchainResp.fromMSP, blockchainResp.toMSP, blockchainResp.id, blockchainResp.timeStamp);

    expect(rawDataUsageForUsage1).to.be.an('object');
    expect(rawDataUsageForUsage1).to.have.property('name', usage1.name);
    expect(rawDataUsageForUsage1).to.have.property('state', 'RECEIVED');
    expect(rawDataUsageForUsage1).to.have.property('type', usage1.type);
    expect(rawDataUsageForUsage1).to.have.property('version', usage1.version);

    expect(rawDataUsageForUsage1).to.have.property('rawData', rawDataForUsage1);
    expect(rawDataUsageForUsage1).to.have.property('referenceId', blockchainResp.id);
    expect(rawDataUsageForUsage1).to.have.property('timestamp', blockchainResp.timeStamp);

    expect(rawDataUsageForUsage1).to.have.property('mspOwner', usage1.mspOwner);
    expect(rawDataUsageForUsage1).to.have.property('mspReceiver', usage1.mspReceiver);

    expect(rawDataUsageForUsage1).to.have.property('body').that.is.an('object');
    expect(rawDataUsageForUsage1.body).to.deep.include(usage1.body);

    debug('rawDataUsageForUsage1 = ', rawDataUsageForUsage1);

    done();
  });

  it('Should generate a settlement rawData and decode the settlement from this rawData', function(done) {
    const settlement1 = {
      type: 'settlement',
      version: '1.1.0',
      name: 'Settlement data',
      contractId: 'azerty-1234',
      contractReferenceId: 'blockchain-contract-ref-id-898786785654',
      mspOwner: 'H23',
      mspReceiver: 'J89',
      body: {
        settlementData: {
          A1: {
            iban: null,
            bankName: null,
            currency: null
          },
          B1: {
            iban: null,
            bankName: null,
            currency: null
          }
        },
        discountModels: 'someData',
        generalInformation: {
          name: 'test3',
          type: 'Normal',
          endDate: '2021-01-01T00:00:00.000Z',
          startDate: '2020-12-01T00:00:00.000Z'
        }
      },
      state: 'DRAFT'
    };

    const rawDataForSettlement1 = testedRawDataUtils.defineRawDataFromSettlement(settlement1);

    const blockchainResp = {
      data: rawDataForSettlement1,
      fromMSP: 'H23',
      toMSP: 'J89',
      id: 'referenceIddzayudgzadazhduazdza',
      timeStamp: '156262878176626327'
    };

    const rawDataObjectForSettlement1 = testedRawDataUtils.defineRawDataObjectFromRawData(blockchainResp.data);

    const rawDataSettlementForSettlement1 = testedRawDataUtils.defineSettlementFromRawDataObject(rawDataObjectForSettlement1, blockchainResp.fromMSP, blockchainResp.toMSP, blockchainResp.id, blockchainResp.timeStamp);

    expect(rawDataSettlementForSettlement1).to.be.an('object');
    expect(rawDataSettlementForSettlement1).to.have.property('name', settlement1.name);
    expect(rawDataSettlementForSettlement1).to.have.property('state', 'RECEIVED');
    expect(rawDataSettlementForSettlement1).to.have.property('type', settlement1.type);
    expect(rawDataSettlementForSettlement1).to.have.property('version', settlement1.version);

    expect(rawDataSettlementForSettlement1).to.have.property('rawData', rawDataForSettlement1);
    expect(rawDataSettlementForSettlement1).to.have.property('referenceId', blockchainResp.id);
    expect(rawDataSettlementForSettlement1).to.have.property('timestamp', blockchainResp.timeStamp);

    expect(rawDataSettlementForSettlement1).to.have.property('mspOwner', settlement1.mspOwner);
    expect(rawDataSettlementForSettlement1).to.have.property('mspReceiver', settlement1.mspReceiver);

    expect(rawDataSettlementForSettlement1).to.have.property('body').that.is.an('object');
    expect(rawDataSettlementForSettlement1.body).to.deep.include(settlement1.body);

    debug('rawDataSettlementForSettlement1 = ', rawDataSettlementForSettlement1);

    done();
  });
});
