const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/send';

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
        mspId: "A1",
        signatures: [
          {
            id:	"signatureId_1_InString",
            name: "employeeName_A2_1",
            role:	"financeDirector"
          }
        ]
      },
      toMsp: {
        mspId: "C3",
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

    it('Put send contract OK with minimum contract details', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract1.id + '/send/';
        debug("path : ", path);

        let sentBody = {};

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
            expect(Object.keys(response.body)).have.members(["contractId", "state", "creationDate", "lastModificationDate", "header", "documentId", "rawData"]);

            expect(response.body).to.have.property('contractId', contract1.id);
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('documentId').that.is.a('string');
            expect(response.body).to.have.property('rawData').that.is.a('string');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "fromMsp", "toMsp"]);
            expect(response.body.header).to.have.property('name', contract1.name);
            expect(response.body.header).to.have.property('type', contract1.type);
            expect(response.body.header).to.have.property('version', contract1.version);
            
            expect(response.body.header).to.have.property('fromMsp').that.is.an('object');
            expect(Object.keys(response.body.header.fromMsp)).have.members(["mspId", "signatures"]);
            expect(response.body.header.fromMsp).to.have.property('mspId', contract1.fromMsp.mspId);
            expect(response.body.header.fromMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMsp.signatures.length).to.equal(0);
            
            expect(response.body.header).to.have.property('toMsp').that.is.an('object');
            expect(Object.keys(response.body.header.toMsp)).have.members(["mspId", "signatures"]);
            expect(response.body.header.toMsp).to.have.property('mspId', contract1.toMsp.mspId);
            expect(response.body.header.toMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMsp.signatures.length).to.equal(0);
            
            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(2);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');
            // expect(Object.keys(response.body.history[1])).have.members(["date", "action"]);
            // expect(response.body.history[1]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[1]).to.have.property('action', 'SENT');
            
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send contract OK with maximum contract details', function (done) {
      try {
        let path = globalVersion + '/contracts/' + contract2.id + '/send/';
        debug("path : ", path);

        let sentBody = {};

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
            expect(Object.keys(response.body)).have.members(["contractId", "state", "creationDate", "lastModificationDate", "header", "documentId", "rawData"]);

            expect(response.body).to.have.property('contractId', contract2.id);
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('documentId').that.is.a('string');
            expect(response.body).to.have.property('rawData').that.is.a('string');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "fromMsp", "toMsp"]);
            expect(response.body.header).to.have.property('name', contract2.name);
            expect(response.body.header).to.have.property('type', contract2.type);
            expect(response.body.header).to.have.property('version', contract2.version);
            
            expect(response.body.header).to.have.property('fromMsp').that.is.an('object');
            expect(Object.keys(response.body.header.fromMsp)).have.members(["mspId", "signatures"]);
            expect(response.body.header.fromMsp).to.have.property('mspId', contract2.fromMsp.mspId);
            expect(response.body.header.fromMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMsp.signatures.length).to.equal(1);
            expect(Object.keys(response.body.header.fromMsp.signatures[0])).have.members(["id", "name", "role"]);
            expect(response.body.header.fromMsp.signatures[0]).to.have.property('id', contract2.fromMsp.signatures[0].id);
            expect(response.body.header.fromMsp.signatures[0]).to.have.property('name', contract2.fromMsp.signatures[0].name);
            expect(response.body.header.fromMsp.signatures[0]).to.have.property('role', contract2.fromMsp.signatures[0].role);
            
            expect(response.body.header).to.have.property('toMsp').that.is.an('object');
            expect(Object.keys(response.body.header.toMsp)).have.members(["mspId", "signatures"]);
            expect(response.body.header.toMsp).to.have.property('mspId', contract2.toMsp.mspId);
            expect(response.body.header.toMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMsp.signatures.length).to.equal(2);
            expect(Object.keys(response.body.header.toMsp.signatures[0])).have.members(["id", "name", "role"]);
            expect(response.body.header.toMsp.signatures[0]).to.have.property('id', contract2.toMsp.signatures[0].id);
            expect(response.body.header.toMsp.signatures[0]).to.have.property('name', contract2.toMsp.signatures[0].name);
            expect(response.body.header.toMsp.signatures[0]).to.have.property('role', contract2.toMsp.signatures[0].role);
            expect(Object.keys(response.body.header.toMsp.signatures[1])).have.members(["id", "name", "role"]);
            expect(response.body.header.toMsp.signatures[1]).to.have.property('id', contract2.toMsp.signatures[1].id);
            expect(response.body.header.toMsp.signatures[1]).to.have.property('name', contract2.toMsp.signatures[1].name);
            expect(response.body.header.toMsp.signatures[1]).to.have.property('role', contract2.toMsp.signatures[1].role);
            
            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(2);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');
            // expect(Object.keys(response.body.history[1])).have.members(["date", "action"]);
            // expect(response.body.history[1]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[1]).to.have.property('action', 'SENT');
            
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