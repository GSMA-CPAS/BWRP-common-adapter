const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/';

const DATE_REGEX = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');

describe("Tests GET " + route + " API OK", function () {

  describe("Setup and Test GET " + route + " API without any contract in DB", function () {
    before(done => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then(removeAllContractsResp => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);
          debugSetup('==> done!');
          done();
        })
        .catch(removeAllContractsError => {
          debugSetup('Error removing contracts in db : ', removeAllContractsError);
          debugSetup('==> failed!');
          done(removeAllContractsError);
        });
    });

    it('Get contracts OK without any contract in DB', function (done) {
      try {
        let path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            assert.equal(error, null);
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            assert.exists(response.body);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        assert.ok(false);
        done();
      }
    });
  });


  describe("Setup and Test GET " + route + " API with 2 contracts in DB", function () {

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
      name: "Contract name between A1 and C1",
      state: 'DRAFT',
      type: 'contract',
      version: '1.3.1',
      fromMsp: {
        mspId: "A1"
      },
      toMsp: {
        mspId: "C3"
      },
      body: {
        bankDetails: {
          A1: {
            iban: null,
            bankName: null,
            currency: null
          },
          C3: {
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
      rawData: "Ctr_raw-data-2"
    };

    before(done => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then(initDbWithContractsResp => {
          debugSetup('The db is initialized with 2 contracts : ', initDbWithContractsResp.map(c => c.id));
          debugSetup('==> done!');
          done();
        })
        .catch(initDbWithContractsError => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('Get contracts OK with 2 contracts in DB', function (done) {
      try {
        let path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body : ', JSON.stringify(response.body));
            assert.equal(error, null);
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            assert.exists(response.body);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);

            let contract1IsFound = false;
            let contract2IsFound = false;
            response.body.forEach(contractInBody => {
              let contract = undefined;
              if (contractInBody.contractID === contract1.id) {
                contract1IsFound = true;
                contract = contract1;
              }
              if (contractInBody.contractID === contract2.id) {
                contract2IsFound = true;
                contract = contract2;
              }
              expect(contractInBody).to.have.property('contractID', contract.id);
              expect(contractInBody).to.have.property('state', contract.state);
              expect(contractInBody).to.have.property('creationDate').that.match(DATE_REGEX);
              expect(contractInBody).to.have.property('lastModificationDate').that.match(DATE_REGEX);
              expect(contractInBody).to.have.property('header').that.is.an('object');
              expect(contractInBody.header).to.have.property('name', contract.name);
              expect(contractInBody.header).to.have.property('type', contract.type);
              expect(contractInBody.header).to.have.property('version', contract.version);
              expect(contractInBody.header).to.have.property('fromMSP').that.is.an('object');
              expect(contractInBody.header.fromMSP).to.have.property('mspid', contract.fromMsp.mspId);
              expect(contractInBody.header).to.have.property('toMSP').that.is.an('object');
              expect(contractInBody.header.toMSP).to.have.property('mspid', contract.toMsp.mspId);  
            });
            expect(contract1IsFound).to.be.true;
            expect(contract2IsFound).to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        assert.ok(false);
        done();
      }
    });
  });


});