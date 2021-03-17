/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;
const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());
const calculationServiceNock = nock(testsUtils.getCalculationServiceUrl());
const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/{usageId}/generate';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API with minimum contract details`, function() {
    const discountsOnContractSent = {
      'HOME': {
        serviceGroups: [
          {
            homeTadigs: ['HOR1'],
            visitorTadigs: ['HOR2'],
            services: [
              {
                service: 'SMSMO',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, linearPrice: 5}, {start: 1500, linearPrice: 3}]}}}
              },
              {
                service: 'MOC',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, fixedPrice: 1500}]}}}
              }
            ]
          }
        ]
      },
      'VISITOR': {
        serviceGroups: [
          {
            homeTadigs: ['HOR2'],
            visitorTadigs: ['HOR1'],
            services: [
              {
                service: 'SMSMO',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, fixedPrice: 5000}]}}}
              },
              {
                service: 'MOC',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, fixedPrice: 3000}]}}}
              }
            ]
          }
        ]
      }
    };
    const contractSent = {
      name: 'Contract name between B1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: 'C1'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        discounts: discountsOnContractSent,
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const usageMinimumData = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: []
      },
      state: 'DRAFT'
    };
    const usageSentData1 = {
      type: 'usage',
      version: '4.3.2',
      name: 'Usage data sent',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        inbound: [
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'SMS MO',
            usage: '5208.2115',
            units: 'SMS',
            charges: '104.16423',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'MOC Back Home',
            usage: '2149.896',
            units: 'min',
            charges: '322.4844',
            taxes: '0',
            currency: 'EUR'
          }
        ],
        outbound: [
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'SMS MO',
            usage: '21530.517',
            units: 'SMS',
            charges: '430.61034',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'GPRS',
            usage: '14696.6175',
            units: 'MB',
            charges: '4408.98525',
            taxes: '0',
            currency: 'EUR'
          }
        ]
      },
      state: 'SENT',
      referenceId: 'OPIPOUFTDRDDFCFYU',
      blockchainRef: {type: 'hlf', txId: 'TX-OPIPOUFTDRDDFCFYU', timestamp: new Date().toJSON()},
      rawData: 'Usg_raw-data-1'
    };
    const usageSentData2 = {
      type: 'usage',
      version: '4.3.2',
      name: 'Usage data sent - 2',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        inbound: [
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'SMS MO',
            usage: '5208.2115',
            units: 'SMS',
            charges: '104.16423',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'MOC Back Home',
            usage: '2149.896',
            units: 'min',
            charges: '322.4844',
            taxes: '0',
            currency: 'EUR'
          }
        ],
        outbound: [
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'SMS MO',
            usage: '21530.517',
            units: 'SMS',
            charges: '430.61034',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'GPRS',
            usage: '14696.6175',
            units: 'MB',
            charges: '4408.98525',
            taxes: '0',
            currency: 'EUR'
          }
        ]
      },
      state: 'SENT',
      referenceId: 'OPIPOUFTDRDDFCFYU',
      blockchainRef: {type: 'hlf', txId: 'TX-OPIPOUFTDRDDFCFYU', timestamp: new Date().toJSON()},
      rawData: 'Usg_raw-data-2'
    };
    const usageSentDataWithAlreadyExistingSettlementId = {
      type: 'usage',
      version: '4.3.2',
      name: 'Usage data sent',
      contractId: undefined,
      settlementId: 'one-value-of-settlement-id',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: []
      },
      state: 'SENT',
      referenceId: 'OPIPOUFTDRDDFCFYU',
      blockchainRef: {type: 'hlf', txId: 'TX-OPIPOUFTDRDDFCFYU', timestamp: new Date().toJSON()},
      rawData: 'Usg_raw-data-1'
    };
    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([contractSent])
        .then((initDbWithContractsResp) => {
          debugSetup('One contract was added in db ', initDbWithContractsResp);
          contractSent.id = initDbWithContractsResp[0].id;
          usageMinimumData.contractId = contractSent.id;
          usageMinimumData.mspOwner = contractSent.fromMsp.mspId;
          usageMinimumData.mspReceiver = contractSent.toMsp.mspId;
          usageSentData1.contractId = contractSent.id;
          usageSentData1.mspOwner = contractSent.fromMsp.mspId;
          usageSentData1.mspReceiver = contractSent.toMsp.mspId;
          usageSentData2.contractId = contractSent.id;
          usageSentData2.mspOwner = contractSent.fromMsp.mspId;
          usageSentData2.mspReceiver = contractSent.toMsp.mspId;
          usageSentDataWithAlreadyExistingSettlementId.contractId = contractSent.id;
          usageSentDataWithAlreadyExistingSettlementId.mspOwner = contractSent.fromMsp.mspId;
          usageSentDataWithAlreadyExistingSettlementId.mspReceiver = contractSent.toMsp.mspId;
          debugSetup('==> init db with 4 usages');
          testsDbUtils.initDbWithUsages([usageMinimumData, usageSentData1, usageSentData2, usageSentDataWithAlreadyExistingSettlementId])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 4 usages : ', initDbWithUsagesResp.map((c) => c.id));
              debugSetup('==> init db with 0 settlement');
              testsDbUtils.initDbWithSettlements([])
                .then((initDbWithSettlementsResp) => {
                  debugSetup('The db is initialized with 0 settlement : ', initDbWithSettlementsResp.map((c) => c.id));
                  debugSetup('==> done!');
                  done();
                })
                .catch((initDbWithSettlementsError) => {
                  debugSetup('Error initializing the db content : ', initDbWithSettlementsError);
                  debugSetup('==> failed!');
                  done(initDbWithSettlementsError);
                });
            })
            .catch((initDbWithUsagesError) => {
              debugSetup('Error initializing the db content : ', initDbWithUsagesError);
              debugSetup('==> failed!');
              done(initDbWithUsagesError);
            });
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('Put generate usage OK with minimum contract details', function(done) {
      calculationServiceNock.post('/calculate')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/calculate');
          expect(bodyReceived).to.be.an('object');
          expect(bodyReceived).to.have.property('discounts').that.is.an('object');
          expect(bodyReceived).to.have.property('usage').that.is.an('object');
          expect(bodyReceived.usage).to.have.property('inbound').that.is.an('array');
          expect(bodyReceived.usage.inbound.length).to.equals(0);
          bodyReceived.usage.inbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          expect(bodyReceived.usage).to.have.property('outbound').that.is.an('array');
          expect(bodyReceived.usage.outbound.length).to.equals(0);
          bodyReceived.usage.outbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              header: {
                version: '0.0.0',
                md5hash: 'd8a67bdb368d59766b362265530d32e8'
              },
              intermediateResults: [
                {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'},
                {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'},
                {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'},
                {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'}
              ]
            },
            undefined
          ];
        });

      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageMinimumData.id + '/generate/';
        debug('path : ', path);

        const sentBody = {};

        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['settlementId', 'contractId', 'header', 'body', 'mspOwner', 'state', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('contractId', contractSent.id);
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('mspOwner', usageMinimumData.mspOwner);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version']);
            expect(response.body.header).to.have.property('type', 'settlement');

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['generatedResult', 'usage']);

            expect(response.body.body.usage.body).to.deep.include(usageMinimumData.body);

            expect(response.body.body.generatedResult).to.have.property('intermediateResults').that.is.an('array');
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'} );
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'} );
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'} );
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'} );

            expect(calculationServiceNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put generate usage OK with mode=commit', function(done) {
      calculationServiceNock.post('/calculate')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/calculate');
          expect(bodyReceived).to.be.an('object');
          expect(bodyReceived).to.have.property('discounts').that.is.an('object');
          expect(bodyReceived).to.have.property('usage').that.is.an('object');
          expect(bodyReceived.usage).to.have.property('inbound').that.is.an('array');
          expect(bodyReceived.usage.inbound.length).to.equals(0);
          bodyReceived.usage.inbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          expect(bodyReceived.usage).to.have.property('outbound').that.is.an('array');
          expect(bodyReceived.usage.outbound.length).to.equals(0);
          bodyReceived.usage.outbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              header: {
                version: '0.0.0',
                md5hash: 'd8a67bdb368d59766b362265530d32e8'
              },
              intermediateResults: [
                {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'},
                {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'},
                {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'},
                {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'}
              ]
            },
            undefined
          ];
        });

      blockchainAdapterNock.post('/private-documents')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/private-documents');
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              fromMSP: 'DTAG',
              toMSP: 'TMUS',
              payload: 'payload',
              payloadHash: '239f59ed55e737c77147cf55ad0c1b030b6d7ee748a7426952f9b852d5a935e5',
              blockchainRef: {
                type: 'hlf',
                txID: 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb',
                timestamp: '2021-03-15T11:43:49Z'
              },
              referenceID: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
            },
            undefined
          ];
        });

      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageMinimumData.id + '/generate/?mode=commit';
        debug('path : ', path);

        const sentBody = {};

        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['referenceId', 'blockchainRef', 'settlementId', 'contractId', 'header', 'body', 'mspOwner', 'state', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('contractId', contractSent.id);
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('referenceId', 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb');
            expect(response.body).to.have.property('mspOwner', usageMinimumData.mspOwner);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version']);
            expect(response.body.header).to.have.property('type', 'settlement');

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId', 'timestamp']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb');
            expect(response.body.blockchainRef).to.have.property('timestamp').that.is.a('string');

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['generatedResult', 'usage']);
            expect(response.body.body.usage.body).to.deep.include(usageMinimumData.body);

            expect(response.body.body.generatedResult).to.have.property('intermediateResults').that.is.an('array');
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'} );
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'} );
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'} );
            expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'} );

            expect(calculationServiceNock.isDone(), 'Unconsumed nock error').to.be.true;
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put generate usage OK without mode on sent usage', function(done) {
      calculationServiceNock.post('/calculate')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/calculate');
          expect(bodyReceived).to.be.an('object');
          expect(bodyReceived).to.have.property('discounts').that.is.an('object');
          expect(bodyReceived).to.have.property('usage').that.is.an('object');
          expect(bodyReceived.usage).to.have.property('inbound').that.is.an('array');
          expect(bodyReceived.usage.inbound.length).to.equals(2);
          bodyReceived.usage.inbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          expect(bodyReceived.usage).to.have.property('outbound').that.is.an('array');
          expect(bodyReceived.usage.outbound.length).to.equals(2);
          bodyReceived.usage.outbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              header: {
                version: '0.0.0',
                md5hash: 'd8a67bdb368d59766b362265530d32e8'
              },
              intermediateResults: [
                {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'},
                {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'},
                {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'},
                {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'}
              ]
            },
            undefined
          ];
        });

      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageSentData1.id + '/generate/';
        debug('path : ', path);

        const getUsagePath = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageSentData1.id;

        const sentBody = {};
        chai.request(testsUtils.getServer())
          .get(`${getUsagePath}`)
          .send()
          .end((firstGetError, firstGetResponse) => {
            expect(firstGetError).to.be.null;
            expect(firstGetResponse).to.have.status(200);
            expect(firstGetResponse).to.be.json;
            expect(firstGetResponse.body).to.be.an('object');
            expect(firstGetResponse.body).to.not.have.property('settlementId');

            chai.request(testsUtils.getServer())
              .put(`${path}`)
              .send(sentBody)
              .end((error, response) => {
                debug('response.status: %s', JSON.stringify(response.status));
                debug('response.body: %s', JSON.stringify(response.body));
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response.body).to.exist;
                expect(response.body).to.be.an('object');
                expect(Object.keys(response.body)).have.members(['settlementId', 'contractId', 'usageId', 'header', 'body', 'mspOwner', 'state', 'creationDate', 'lastModificationDate']);

                expect(response.body).to.have.property('contractId', contractSent.id);
                expect(response.body).to.have.property('usageId', usageSentData1.id);
                expect(response.body).to.have.property('state', 'DRAFT');
                expect(response.body).to.have.property('mspOwner', usageSentData1.mspOwner);
                expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
                expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

                expect(response.body).to.have.property('header').that.is.an('object');
                expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version']);
                expect(response.body.header).to.have.property('type', 'settlement');

                expect(response.body).to.have.property('body').that.is.an('object');
                expect(Object.keys(response.body.body)).have.members(['generatedResult', 'usage']);
                expect(response.body.body.usage.body).to.deep.include(usageSentData1.body);

                expect(response.body.body.generatedResult).to.have.property('intermediateResults').that.is.an('array');
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'} );
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'} );
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'} );
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'} );

                expect(calculationServiceNock.isDone(), 'Unconsumed nock error').to.be.true;

                chai.request(testsUtils.getServer())
                  .get(`${getUsagePath}`)
                  .send()
                  .end((secondGetError, secondGetResponse) => {
                    expect(secondGetError).to.be.null;
                    expect(secondGetResponse).to.have.status(200);
                    expect(secondGetResponse).to.be.json;
                    expect(secondGetResponse.body).to.be.an('object');
                    expect(secondGetResponse.body).to.have.property('settlementId', response.body.settlementId);

                    done();
                  });
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put generate usage OK with mode=preview on sent usage', function(done) {
      calculationServiceNock.post('/calculate')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/calculate');
          expect(bodyReceived).to.be.an('object');
          expect(bodyReceived).to.have.property('discounts').that.is.an('object');
          expect(bodyReceived).to.have.property('usage').that.is.an('object');
          expect(bodyReceived.usage).to.have.property('inbound').that.is.an('array');
          expect(bodyReceived.usage.inbound.length).to.equals(2);
          bodyReceived.usage.inbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          expect(bodyReceived.usage).to.have.property('outbound').that.is.an('array');
          expect(bodyReceived.usage.outbound.length).to.equals(2);
          bodyReceived.usage.outbound.forEach((element) => {
            expect(element).to.be.an('object');
            expect(Object.keys(element)).have.members(['homeTadig', 'visitorTadig', 'service', 'usage', 'charges']);
          });
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              header: {
                version: '0.0.0',
                md5hash: 'd8a67bdb368d59766b362265530d32e8'
              },
              intermediateResults: [
                {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'},
                {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'},
                {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'},
                {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'}
              ]
            },
            undefined
          ];
        });

      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageSentData2.id + '/generate/?mode=preview';
        debug('path : ', path);

        const getUsagePath = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageSentData2.id;

        const sentBody = {};
        chai.request(testsUtils.getServer())
          .get(`${getUsagePath}`)
          .send()
          .end((firstGetError, firstGetResponse) => {
            expect(firstGetError).to.be.null;
            expect(firstGetResponse).to.have.status(200);
            expect(firstGetResponse).to.be.json;
            expect(firstGetResponse.body).to.be.an('object');
            expect(firstGetResponse.body).to.not.have.property('settlementId');

            chai.request(testsUtils.getServer())
              .put(`${path}`)
              .send(sentBody)
              .end((error, response) => {
                debug('response.status: %s', JSON.stringify(response.status));
                debug('response.body: %s', JSON.stringify(response.body));
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response.body).to.exist;
                expect(response.body).to.be.an('object');
                expect(Object.keys(response.body)).have.members(['contractId', 'usageId', 'header', 'body', 'mspOwner', 'state']);

                expect(response.body).to.not.have.property('settlementId');

                expect(response.body).to.have.property('contractId', contractSent.id);
                expect(response.body).to.have.property('usageId', usageSentData2.id);
                expect(response.body).to.have.property('state', 'DRAFT');
                expect(response.body).to.have.property('mspOwner', usageSentData2.mspOwner);
                expect(response.body).to.not.have.property('creationDate');
                expect(response.body).to.not.have.property('lastModificationDate');

                expect(response.body).to.have.property('header').that.is.an('object');
                expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version']);
                expect(response.body.header).to.have.property('type', 'settlement');

                expect(response.body).to.have.property('body').that.is.an('object');
                expect(Object.keys(response.body.body)).have.members(['generatedResult', 'usage']);
                expect(response.body.body.usage.body).to.deep.include(usageSentData2.body);

                expect(response.body.body.generatedResult).to.have.property('intermediateResults').that.is.an('array');
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '9000', type: 'inbound'} );
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR2'], visitorTadigs: ['HOR1'], dealValue: '7000', type: 'inbound'} );
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'SMSMO', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '4500', type: 'outbound'} );
                expect(response.body.body.generatedResult.intermediateResults).to.deep.include( {service: 'MOC', homeTadigs: ['HOR1'], visitorTadigs: ['HOR2'], dealValue: '2500', type: 'outbound'} );

                expect(calculationServiceNock.isDone(), 'Unconsumed nock error').to.be.true;

                chai.request(testsUtils.getServer())
                  .get(`${getUsagePath}`)
                  .send()
                  .end((secondGetError, secondGetResponse) => {
                    expect(secondGetError).to.be.null;
                    expect(secondGetResponse).to.have.status(200);
                    expect(secondGetResponse).to.be.json;
                    expect(secondGetResponse.body).to.be.an('object');
                    expect(secondGetResponse.body).to.not.have.property('settlementId');

                    done();
                  });
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put generate usage KO on sent usage with already existing settlmeentId', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageSentDataWithAlreadyExistingSettlementId.id + '/generate/?mode=preview';
        debug('path : ', path);

        const sentBody = {};
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(response.body.message).to.equal('Calculate settlement not allowed');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });
  });
});
