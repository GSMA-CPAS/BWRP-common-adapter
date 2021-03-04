/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/settlements/{settlementId}/discrepancy';

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
    const settlement1 = {
      type: 'settlement',
      version: '1.1.0',
      name: 'Settlement data',
      contractId: undefined,
      contractReferenceId: 'pdzaodzapdiozpadi',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          complexObject: {
            a: 'a',
            b: 'b'
          },
          otherValue: 'other'
        },
        usage: {
          name: 'usageName1',
          version: 'usageVersion1',
          state: 'usageState1',
          mspOwner: undefined,
          body: {
            bodyContent1: 'minutes',
            bodyContent2: {
              param1: 'value1',
              param2: 'value2'
            }
          },
        },
        data: [],
        otherData: 'otherDataContent'
      },
      state: 'DRAFT'
    };
    const settlementDraftFromUsageReceived1 = {
      type: 'settlement',
      version: '1.1.1',
      name: 'Settlement data draft from usage received',
      contractId: undefined,
      contractReferenceId: 'pdzaodzapdiozpadi',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          complexObject: {
            a: 'a',
            b: 'b'
          },
          otherValue: 'other'
        },
        usage: {
          name: 'usageName-2-EmbeddedInSettlement',
          version: '2.2.2',
          state: 'RECEIVED',
          mspOwner: undefined,
          body: {
            aaaaaa: 'minutes',
            bbbbbb: {
              cccccc: 'value1',
              dddddd: 'value2'
            }
          },
        },
        data: [],
        otherData: 'otherDataContent'
      },
      state: 'DRAFT'
    };
    const settlementReceived1 = {
      type: 'settlement',
      version: '1.1.2',
      name: 'Settlement data received',
      contractId: undefined,
      contractReferenceId: 'pdzaodzapdiozpadi',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          complexObject: {
            a: 'a',
            b: 'b'
          },
          otherValue: 'other'
        },
        usage: {
          name: 'usageName-3-EmbeddedInSettlement',
          version: '3.3.3',
          state: 'RECEIVED',
          mspOwner: undefined,
          body: {
            zzzz: 'hours',
            yyyy: {
              wwww: 'value1',
              vvvv: 'value2'
            }
          },
        },
        data: [],
        otherData: 'otherDataContent'
      },
      state: 'RECEIVED'
    };
    const settlement2 = {
      type: 'settlement',
      version: '1.2.0',
      name: 'Settlement data',
      contractId: undefined,
      contractReferenceId: 'xiazxzaosxoazpslazopdkxzepckeozdczelxpze',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: 'objectOrString',
        usage: {
          name: 'usageName1',
          version: 'usageVersion1',
          state: 'usageState1',
          mspOwner: undefined,
          body: {
            other: 'objectOrString',
          },
        }
      },
      state: 'SENT'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          debugSetup('Two contracts in db ', initDbWithContractsResp);
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
          settlement1.contractId = contract1.id;
          settlement1.mspOwner = contract1.fromMsp.mspId;
          settlement1.mspReceiver = contract1.toMsp.mspId;
          settlement1.body.usage.mspOwner = contract1.fromMsp.mspId;
          settlementDraftFromUsageReceived1.contractId = contract1.id;
          settlementDraftFromUsageReceived1.mspOwner = contract1.toMsp.mspId;
          settlementDraftFromUsageReceived1.mspReceiver = contract1.fromMsp.mspId;
          settlementDraftFromUsageReceived1.body.usage.mspOwner = contract1.toMsp.mspId;
          settlementReceived1.contractId = contract1.id;
          settlementReceived1.mspOwner = contract1.toMsp.mspId;
          settlementReceived1.mspReceiver = contract1.fromMsp.mspId;
          settlementReceived1.body.usage.mspOwner = contract1.toMsp.mspId;
          settlement2.contractId = contract2.id;
          settlement2.mspOwner = contract2.fromMsp.mspId;
          settlement2.mspReceiver = contract2.toMsp.mspId;
          settlement2.body.usage.mspOwner = contract2.fromMsp.mspId;
          debugSetup('==> init db with 0 usages');
          testsDbUtils.initDbWithUsages([])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 0 usages : ', initDbWithUsagesResp.map((c) => c.id));
              debugSetup('==> init db with 4 settlements');
              testsDbUtils.initDbWithSettlements([settlement1, settlement2, settlementDraftFromUsageReceived1, settlementReceived1])
                .then((initDbWithSettlementsResp) => {
                  debugSetup('First settlement document linked to contract ', initDbWithSettlementsResp[0].contractId);
                  debugSetup('Second settlement document linked to contract ', initDbWithSettlementsResp[1].contractId);
                  settlement1.id = initDbWithSettlementsResp[0].id;
                  settlement2.id = initDbWithSettlementsResp[1].id;
                  settlementDraftFromUsageReceived1.id = initDbWithSettlementsResp[2].id;
                  settlementReceived1.id = initDbWithSettlementsResp[3].id;
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

    it('Get settlement discrepancy OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlement1.contractId + '/settlements/' + settlement1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerSettlementId=${settlementDraftFromUsageReceived1.id}`)
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

    it('Get settlement discrepancy OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlement1.contractId + '/settlements/' + settlement1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerSettlementId=${settlementReceived1.id}`)
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

    it('Get settlement discrepancy KO when settlements do not have the same contract', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlement1.contractId + '/settlements/' + settlement1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerSettlementId=${settlement2.id}`)
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
