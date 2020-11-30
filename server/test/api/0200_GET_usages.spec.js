/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/';

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} `, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'SIGNED',
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
          name: 'test1',
          type: 'Normal',
          endDate: '2021-01-01T00:00:00.000Z',
          startDate: '2020-12-01T00:00:00.000Z'
        }
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contract2 = {
      name: 'Contract name between B1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: 'B1'
      },
      toMsp: {
        mspId: 'C1'
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
          name: 'test1',
          type: 'Normal',
          endDate: '2021-01-01T00:00:00.000Z',
          startDate: '2020-12-01T00:00:00.000Z'
        }
      },
      rawData: 'Ctr_raw-data-1'
    };
    const usage1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: undefined,
      mspOwner: 'mspOwner',
      body: {
        data: []
      },
      state: 'DRAFT'
    };

    before((done) => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then((removeAllContractsResp) => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);

          testsDbUtils.removeAllUsages({})
            .then((removeAllUsagesResp) => {
              debugSetup('All usages in db are removed : ', removeAllUsagesResp);

              testsDbUtils.initDbWithContracts([contract1, contract2])
                .then((initDbWithContractsResp) => {
                  debugSetup('Two contracts in db ', removeAllUsagesResp);
                  contract1.id = initDbWithContractsResp[0].id;
                  contract2.id = initDbWithContractsResp[1].id;
                  usage1.contractId = contract1.id;
                  usage1.mspOwner = contract1.fromMsp.mspId;
                  testsDbUtils.createUsage(usage1)
                    .then((createUsageResp) => {
                      debugSetup('One usage document linked to contract ', createUsageResp.contractId);

                      usage1.id = createUsageResp.id;
                      debugSetup('==> done!');
                      done();
                    })
                    .catch((createUsageError) => {
                      debugSetup('Error initializing the db content : ', createUsageError);
                      debugSetup('==> failed!');
                      done(createUsageError);
                    });
                })
                .catch((initDbWithContractsError) => {
                  debugSetup('Error initializing the db content : ', initDbWithContractsError);
                  debugSetup('==> failed!');
                  done(initDbWithContractsError);
                });
            })
            .catch((removeAllUsagesError) => {
              debugSetup('Error removing usages in db : ', removeAllUsagesError);
              debugSetup('==> failed!');
              done(removeAllUsagesError);
            });
        })
        .catch((removeAllContractsError) => {
          debugSetup('Error removing contracts in db : ', removeAllContractsError);
          debugSetup('==> failed!');
          done(removeAllContractsError);
        });
    });

    it('Get usages OK without contractId in DB', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/usages/';
        debug('GET path : %s', path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get usages OK without any usage for contractId in DB', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract2.id + '/usages/';
        debug('GET path : %s', path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get usages OK with 1 usage for contractId in DB', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/';
        debug('GET path : ' + path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);
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
