/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/{usageId}/discrepancy';

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API`, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'B1'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contract2 = {
      name: 'Contract name between B1 and C1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: 'C1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const usage1 = {
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
    const usageReceived1 = {
      type: 'usage',
      version: '1.1.1',
      name: 'Usage data received',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: []
      },
      state: 'RECEIVED'
    };
    const usage2 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'DRAFT'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          debugSetup('Two contracts in db ', initDbWithContractsResp);
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
          usage1.contractId = contract1.id;
          usage1.mspOwner = contract1.fromMsp.mspId;
          usage1.mspReceiver = contract1.toMsp.mspId;
          usageReceived1.contractId = contract1.id;
          usageReceived1.mspOwner = contract1.toMsp.mspId;
          usageReceived1.mspReceiver = contract1.fromMsp.mspId;
          usage2.contractId = contract2.id;
          usage2.mspOwner = contract2.fromMsp.mspId;
          usage2.mspReceiver = contract2.toMsp.mspId;
          debugSetup('==> init db with 3 usages');
          testsDbUtils.initDbWithUsages([usage1, usage2, usageReceived1])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 3 usages : ', initDbWithUsagesResp.map((c) => c.id));
              debugSetup('==> init db with 0 settlements');
              testsDbUtils.initDbWithSettlements([])
                .then((initDbWithSettlementsResp) => {
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

    it('Get usage discrepancy OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + usage1.contractId + '/usages/' + usage1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerUsageId=${usageReceived1.id}`)
          .send()
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['generatedDiscrepancy', 'otherData', 'localUsage', 'remoteUsage']);

            expect(response.body).to.have.property('otherData').that.is.an('array').that.include('test', '8');
            expect(response.body).to.have.property('generatedDiscrepancy').that.is.an('object');
            expect(Object.keys(response.body.generatedDiscrepancy)).have.members(['data1', 'data2', 'object1']);

            expect(response.body.generatedDiscrepancy).to.have.property('data1', 'a');
            expect(response.body.generatedDiscrepancy).to.have.property('data2', 'b');
            expect(response.body.generatedDiscrepancy).to.have.property('object1').that.is.an('object');
            expect(Object.keys(response.body.generatedDiscrepancy.object1)).have.members(['object1data10']);
            expect(response.body.generatedDiscrepancy.object1).to.have.property('object1data10', 'z');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get usage discrepancy KO when usages do not have the same contract', function(done) {
      try {
        const path = globalVersion + '/contracts/' + usage1.contractId + '/usages/' + usage1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerUsageId=${usage2.id}`)
          .send()
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body.message).to.equal('Resource not found');

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
