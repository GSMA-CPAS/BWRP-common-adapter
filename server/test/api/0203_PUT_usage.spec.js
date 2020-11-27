const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/{usageId}';

const DATE_REGEX = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');

describe("Tests PUT " + route + " API OK", function () {

  describe("Setup and Test PUT " + route + " API", function () {
    const contract_draft = {
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
    const contract_sent = {
      name: "Contract name between B1 and C1",
      state: 'SENT',
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
    const contract_received = {
      name: "Contract name between B1 and C1",
      state: 'RECEIVED',
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
    const usage_minimum_data = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: undefined,
      mspOwner: undefined,
      body: {
        data: []
      },
      state: 'DRAFT'
    };
    const usage_more_data = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      body: {
        data: [{
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
    const usage_sent = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      body: {
        data: [{
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
      state: 'SENT'
    };

    before(done => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then(removeAllContractsResp => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);

          testsDbUtils.removeAllUsages({})
            .then(removeAllUsagesResp => {
              debugSetup('All usages in db are removed : ', removeAllUsagesResp);

              testsDbUtils.initDbWithContracts([contract_draft, contract_sent, contract_received])
                .then(initDbWithContractsResp => {
                  debugSetup('Three contracts where added in db ', removeAllUsagesResp);
                  contract_draft.id = initDbWithContractsResp[0].id;
                  contract_sent.id = initDbWithContractsResp[1].id;
                  contract_received.id = initDbWithContractsResp[2].id;
                  usage_minimum_data.contractId = contract_sent.id;
                  usage_minimum_data.mspOwner = contract_sent.fromMsp.mspId;
                  usage_more_data.contractId = contract_received.id;
                  usage_more_data.mspOwner = contract_received.fromMsp.mspId;
                  usage_sent.contractId = contract_received.id;
                  usage_sent.mspOwner = contract_received.fromMsp.mspId;
                  testsDbUtils.initDbWithUsages([usage_minimum_data, usage_more_data,usage_sent])
                    .then(initDbWithUsagesResp => {
                      debugSetup('The db is initialized with 3 usages : ', initDbWithUsagesResp.map(c => c.id));
                      debugSetup('==> done!');
                      done();
                    })
                    .catch(initDbWithUsagesError => {
                      debugSetup('Error initializing the db content : ', initDbWithUsagesError);
                      debugSetup('==> failed!');
                      done(initDbWithUsagesError);
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


    it('Put usage OK', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract_sent.id + '/usages/' + usage_minimum_data.id;
        debug("PUT path : ", path);

        let sentBody = {
          header: {
            name: "Usage data name changed",
            type: "usage",
            version: "1.2.0",
            mspOwner: "B1"
          },
          state: "DRAFT",
          body: {"data": []}
        }
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
            expect(Object.keys(response.body)).have.members(["usageId", "header", "state", "body", "history", "creationDate", "lastModificationDate"]);

            expect(response.body).to.have.property('usageId', usage_minimum_data.id);
            expect(response.body).to.have.property('state', usage_minimum_data.state);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "mspOwner"]);
            expect(response.body.header).to.have.property('name', "Usage data name changed");
            expect(response.body.header).to.have.property('type', usage_minimum_data.type);
            expect(response.body.header).to.have.property('version', '1.2.0');
            expect(response.body.header).to.have.property('mspOwner', usage_minimum_data.mspOwner);


            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(["data"]);
            expect(response.body.body).to.deep.include(usage_minimum_data.body);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put contract OK with maximum contract details', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract_received.id + '/usages/' + usage_more_data.id;

        let sentBody  =  {
          header: {
            name: "Usage data name changed",
            type: "usage",
            version: "1.2.0",
            mspOwner: "B1"
          },
          state: "DRAFT",
          body: {
            data: [{
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
        }




        debug("PUT path : ", path);
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
            expect(Object.keys(response.body)).have.members(["usageId", "header", "state", "body", "history", "creationDate", "lastModificationDate"]);

            expect(response.body).to.have.property('usageId', usage_more_data.id);
            expect(response.body).to.have.property('state', usage_more_data.state);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "mspOwner"]);
            expect(response.body.header).to.have.property('name', "Usage data name changed");
            expect(response.body.header).to.have.property('type', usage_more_data.type);
            expect(response.body.header).to.have.property('version', "1.2.0");
            expect(response.body.header).to.have.property('mspOwner', usage_more_data.mspOwner);


            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(["data"]);
            expect(response.body.body).to.deep.include(usage_more_data.body);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });


    it('Put usage NOK on wrong contractId', function (done) {
      try {
        const randomValue = testsUtils.defineRandomValue();

        let path = globalVersion + '/contracts/' + "id_" + randomValue + '/usages/' + usage_minimum_data.id;
        debug("PUT path : ", path);

        let sentBody = {
          header: {
            name: "Usage data name changed",
            type: "usage",
            version: "1.2.0",
            mspOwner: "B1"
          },
          state: "DRAFT",
          body: {"data": []}
        }
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal("Put usage not allowed");
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put usage NOK if request body state is not DRAFT', function (done) {
      try {

        let path = globalVersion + '/contracts/'  + contract_sent.id + '/usages/' + usage_minimum_data.id;
        debug("PUT path : ", path);

        let sentBody = {
          header: {
            name: "Usage data name changed",
            type: "usage",
            version: "1.2.0",
            mspOwner: "B1"
          },
          state: "SENT",
          body: {"data": []}
        }
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal("Usage modification not allowed");
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put usage NOK if usage in db is not DRAFT', function (done) {
      try {

        let path = globalVersion + '/contracts/'  + contract_received.id + '/usages/' + usage_sent.id;
        debug("PUT path : ", path);

        let sentBody = {
          header: {
            name: "Usage data name changed",
            type: "usage",
            version: "1.2.0",
            mspOwner: "B1"
          },
          state: "SENT",
          body: {"data": []}
        }
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal("Usage modification not allowed");
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