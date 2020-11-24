const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractID}';

const DATE_REGEX = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');

describe("Tests PUT " + route + " API OK", function () {

  describe("Setup and Test PUT " + route + " API with minimum contract details", function () {

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
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
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

    it('Put contract OK with minimum contract details', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract1.id;
        debug("path : ", path);

        let sentBody = {
          header: {
            name: "Contract number 5 between A1 and B6",
            state: "DRAFT",
            version: "5.1",
            type: "contract",
            fromMSP: {
              mspid: "A1"
            },
            toMSP: {
              mspid: "B6"
            }
          },
          body: {}
        };

        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            assert.equal(error, null);
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            assert.exists(response.body);
            expect(response.body).to.be.an('object');

            expect(response.body).to.have.property('contractID', contract1.id);
            expect(response.body).to.have.property('state', sentBody.header.state);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            
            expect(response.body.header).to.have.property('fromMSP').that.is.an('object');
            expect(response.body.header.fromMSP).to.have.property('mspid', sentBody.header.fromMSP.mspid);
            expect(response.body.header.fromMSP).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMSP.signatures.length).to.equal(0);
            
            expect(response.body.header).to.have.property('toMSP').that.is.an('object');
            expect(response.body.header.toMSP).to.have.property('mspid', sentBody.header.toMSP.mspid);
            expect(response.body.header.toMSP).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMSP.signatures.length).to.equal(0);
            
            expect(response.body).to.have.property('body').that.is.an('object');
            expect(response.body.body).to.have.property('taps').that.is.an('array');
            expect(response.body.body.taps.length).to.equal(0);
            
            expect(response.body).to.have.property('history').that.is.an('array');
            expect(response.body.history.length).to.equal(2);
            expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body.history[0]).to.have.property('action', 'CREATION');
            expect(response.body.history[1]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body.history[1]).to.have.property('action', 'UPDATE');
            
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        assert.ok(false);
        done();
      }
    });

    it('Put contract OK with maximum contract details', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract2.id;
        debug("path : ", path);

        let sentBody = {
          header: {
            name: "Contract name between A2 and C1 - v2",
            state: "DRAFT",
            version: "5.7",
            type: "contract",
            fromMSP: {
              mspid: "A2",
              signatures: [
                {
                  id:	"signatureId_1_InString",
                  name: "employeeName_A2_1",
                  role:	"financeDirector"
                }
              ]
            },
            toMSP: {
              mspid: "C1",
              signatures: [
                {
                  id:	"signatureId_C1_1_InString",
                  name: "employeeName_C1_1",
                  role:	"financeDirector"
                },
                {
                  id:	"signatureId_C1_2_InString",
                  name: "employeeName_C1_2",
                  role:	"saleDirector"
                }
              ]
            }
          },
          body: {
            bankDetails: {
              A2: {
                iban: "##IBAN-A2-1##",
                bankName: "##BANK-A2-1##",
                currency: "Dollars"
              },
              C1: {
                iban: "##IBAN-C1-3##",
                bankName: "##BANK-C1-3##",
                currency: "Euros"
              }
            },
            discountModels: "someDiscountModelToDefine",
            generalInformation: {
              name: "test1",
              type: "Normal",
              endDate: "2021-01-01T00:00:00.000Z",
              startDate: "2020-12-01T00:00:00.000Z"
            }
          }
        };

        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            assert.equal(error, null);
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            assert.exists(response.body);
            expect(response.body).to.be.an('object');

            expect(response.body).to.have.property('contractID', contract2.id);
            expect(response.body).to.have.property('state', sentBody.header.state);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            
            expect(response.body.header).to.have.property('fromMSP').that.is.an('object');
            expect(response.body.header.fromMSP).to.have.property('mspid', sentBody.header.fromMSP.mspid);
            expect(response.body.header.fromMSP).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMSP.signatures.length).to.equal(1);
            expect(response.body.header.fromMSP.signatures[0]).to.have.property('id', sentBody.header.fromMSP.signatures[0].id);
            expect(response.body.header.fromMSP.signatures[0]).to.have.property('name', sentBody.header.fromMSP.signatures[0].name);
            expect(response.body.header.fromMSP.signatures[0]).to.have.property('role', sentBody.header.fromMSP.signatures[0].role);
            
            expect(response.body.header).to.have.property('toMSP').that.is.an('object');
            expect(response.body.header.toMSP).to.have.property('mspid', sentBody.header.toMSP.mspid);
            expect(response.body.header.toMSP).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMSP.signatures.length).to.equal(2);
            expect(response.body.header.toMSP.signatures[0]).to.have.property('id', sentBody.header.toMSP.signatures[0].id);
            expect(response.body.header.toMSP.signatures[0]).to.have.property('name', sentBody.header.toMSP.signatures[0].name);
            expect(response.body.header.toMSP.signatures[0]).to.have.property('role', sentBody.header.toMSP.signatures[0].role);
            expect(response.body.header.toMSP.signatures[1]).to.have.property('id', sentBody.header.toMSP.signatures[1].id);
            expect(response.body.header.toMSP.signatures[1]).to.have.property('name', sentBody.header.toMSP.signatures[1].name);
            expect(response.body.header.toMSP.signatures[1]).to.have.property('role', sentBody.header.toMSP.signatures[1].role);
            
            expect(response.body).to.have.property('body').that.is.an('object');
            expect(response.body.body).to.have.property('taps').that.is.an('array');
            expect(response.body.body.taps.length).to.equal(0);
            
            expect(response.body).to.have.property('history').that.is.an('array');
            expect(response.body.history.length).to.equal(2);
            expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body.history[0]).to.have.property('action', 'CREATION');
            expect(response.body.history[1]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body.history[1]).to.have.property('action', 'UPDATE');
            
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