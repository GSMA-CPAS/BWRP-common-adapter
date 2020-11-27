const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/';

const DATE_REGEX = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');

describe("Tests POST " + route + " API OK", function () {

  describe("Setup and Test POST " + route + " API with a usage document", function () {

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

    before(done => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then(removeAllContractsResp => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);

          testsDbUtils.removeAllUsages({})
            .then(removeAllUsagesResp => {
              debugSetup('All usages in db are removed : ', removeAllUsagesResp);

              testsDbUtils.initDbWithContracts([contract_draft,contract_sent,contract_received])
                .then(initDbWithContractsResp => {
                  debugSetup('Three contracts where added in db ', removeAllUsagesResp);
                  contract_draft.id = initDbWithContractsResp[0].id;
                  contract_sent.id = initDbWithContractsResp[1].id;
                  contract_received.id = initDbWithContractsResp[2].id;

                  debugSetup('==> done!');
                  done();

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

    it('POST usages OK on DRAFT Contract with a Usage document', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract_draft.id + '/usages/';

        let sentBody = {
          header: {
            name: 'name',
            type: 'usage',
            version: '1.1.0',
            // mspOwner: ->  the MSP which gives the Inbound traffic data   Could be the contract->fromMsp
          },
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
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response: %s', JSON.stringify(response));
            expect(error).to.be.null;
            expect(response).to.have.status(422);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('POST usages OK on SENT Contract with a Usage document', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract_sent.id + '/usages/';

        let sentBody = {
          header: {
            name: 'name',
            type: 'usage',
            version: '1.1.0',
            // mspOwner: ->  the MSP which gives the Inbound traffic data   Could be the contract->fromMsp
          },
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
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(["usageId", "state", "creationDate", "lastModificationDate", "header", "body", "history"]);

            expect(response.body).to.have.property('usageId').that.is.a("string");
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "mspOwner"]);
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            expect(response.body.header).to.have.property('mspOwner', contract_sent.fromMsp.mspId);


            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);

            expect(response.body).to.have.property('history').that.is.an('array');
            expect(response.body.history.length).to.equal(1);
            expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body.history[0]).to.have.property('action', 'CREATION');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/,'')}/${response.body.usageId}`);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('POST usages OK on RECEIVED Contract with a Usage document', function (done) {

      try {
        let path = globalVersion + '/contracts/' + contract_received.id + '/usages/';

        let sentBody = {
          header: {
            name: 'name',
            type: 'usage',
            version: '1.1.0',
            // mspOwner: ->  the MSP which gives the Inbound traffic data   Could be the contract->fromMsp
          },
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
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(["usageId", "state", "creationDate", "lastModificationDate", "header", "body", "history"]);

            expect(response.body).to.have.property('usageId').that.is.a("string");
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "mspOwner"]);
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            expect(response.body.header).to.have.property('mspOwner', contract_sent.fromMsp.mspId);


            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);

            expect(response.body).to.have.property('history').that.is.an('array');
            expect(response.body.history.length).to.equal(1);
            expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body.history[0]).to.have.property('action', 'CREATION');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/,'')}/${response.body.usageId}`);

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