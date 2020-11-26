const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractID}/usages/{usageId}';

const DATE_REGEX = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');

describe("Tests GET " + route + " API OK", function () {

  describe("Setup and Test GET " + route + " API with minimum contract details", function () {
    const contract1 = {
      name: "Contract name between A1 and B1",
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: "A1"
      },
      toMsp: {
        mspId: "B1"
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
        discountModels: "someData",
        generalInformation: {
          name: "test1",
          type: "Normal",
          endDate: "2021-01-01T00:00:00.000Z",
          startDate: "2020-12-01T00:00:00.000Z"
        }
      },
      rawData: "Ctr_raw-data-1"
    };
    const contract2 = {
      name: "Contract name between B1 and C1",
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: "B1"
      },
      toMsp: {
        mspId: "C1"
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
        discountModels: "someData",
        generalInformation: {
          name: "test1",
          type: "Normal",
          endDate: "2021-01-01T00:00:00.000Z",
          startDate: "2020-12-01T00:00:00.000Z"
        }
      },
      rawData: "Ctr_raw-data-1"
    };
    const usage1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: contract1.id,
      mspOwner: 'mspOwner',
      body: {
        "data": [ {
          year: 2020,
          month: 1,
          hpmn: 'HPMN',
          vpmn: 'VPMN',
          service: 'service',
          value: 1,
          units: 'unit',
          charges: 'charge',
          taxes: 'taxes'
        }]
      },
      state: 'DRAFT'
    };

    before(done => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then(removeAllContractsResp => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);

          testsDbUtils.removeAllUsages({})
            .then(removeAllUsagesResp => {
              debugSetup('All usages in db are removed : ', removeAllUsagesResp);

              testsDbUtils.initDbWithContracts([contract1,contract2])
                .then(initDbWithContractsResp => {
                  debugSetup('Two contracts in db ', removeAllUsagesResp);
                  contract1.id = initDbWithContractsResp[0].id;
                  contract2.id = initDbWithContractsResp[1].id;
                  usage1.contractId = contract1.id;
                  usage1.mspOwner = contract1.fromMsp.mspId;
                  testsDbUtils.createUsage(usage1)
                    .then(createUsageResp => {
                      debugSetup('One usage document linked to contract ', createUsageResp.contractId);

                      usage1.id = createUsageResp.id;
                      debugSetup('==> done!');
                      done();
                    })
                    .catch(createUsageError => {
                      debugSetup('Error initializing the db content : ', createUsageError);
                      debugSetup('==> failed!');
                      done(createUsageError);
                    });
                })
                .catch(initDbWithContractsError => {
                  debugSetup('Error initializing the db content : ', initDbWithContractsError);
                  debugSetup('==> failed!');
                  done(initDbWithContractsError);
                });
            })
            .catch(removeAllUsagesError => {
              debugSetup('Error removing usages in db : ', removeAllUsagesError);
              debugSetup('==> failed!');
              done(removeAllUsagesError);
            });
        })
        .catch(removeAllContractsError => {
          debugSetup('Error removing contracts in db : ', removeAllContractsError);
          debugSetup('==> failed!');
          done(removeAllContractsError);
        });
    });

    it.only('GET usage OK', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract1.id + '/usages/' + usage1.id;
        debug("GET path : ", path);

        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(["usageId", "header", "state",  "body", "history", "creationDate", "lastModificationDate"]);

            expect(response.body).to.have.property('usageId', usage1.id);
            expect(response.body).to.have.property('state', usage1.state);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "mspOwner"]);
            expect(response.body.header).to.have.property('name', usage1.name);
            expect(response.body.header).to.have.property('type', usage1.type);
            expect(response.body.header).to.have.property('version', usage1.version);
            expect(response.body.header).to.have.property('mspOwner', usage1.mspOwner);


            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(["data"]);
            expect(response.body.body).to.deep.include(usage1.body);

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