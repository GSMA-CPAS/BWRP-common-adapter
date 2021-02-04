/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/{usageId}/generate';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API with minimum contract details`, function() {
    const contractSent = {
      name: 'Contract name between B1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: 'C1'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
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
    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([contractSent])
        .then((initDbWithContractsResp) => {
          debugSetup('One contract was added in db ', initDbWithContractsResp);
          contractSent.id = initDbWithContractsResp[0].id;
          usageMinimumData.contractId = contractSent.id;
          usageMinimumData.mspOwner = contractSent.fromMsp.mspId;
          usageMinimumData.mspReceiver = contractSent.toMsp.mspId;
          debugSetup('==> init db with 1 usage');
          testsDbUtils.initDbWithUsages([usageMinimumData])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 1 usage : ', initDbWithUsagesResp.map((c) => c.id));
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
