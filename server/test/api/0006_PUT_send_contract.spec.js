/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/send';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API with minimum contract details`, function() {
    const contractWithNoSignatures = {
      name: 'Contract name between A1 and B1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: 'DTAG'
      },
      toMsp: {
        mspId: 'TMUS'
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

    const contractWithSignatures = {
      name: 'Contract name between A1 and C1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.3.1',
      fromMsp: {
        mspId: 'DTAG',
        signatures: [
          {
            id: 'signatureId_1_InString',
            name: 'employeeName_A2_1',
            role: 'financeDirector'
          }
        ]
      },
      toMsp: {
        mspId: 'TMUS',
        signatures: [
          {
            id: 'signatureId_C1_1_InString',
            name: 'employeeName_C1_1',
            role: 'financeDirector'
          },
          {
            id: 'signatureId_C1_2_InString',
            name: 'employeeName_C1_2',
            role: 'saleDirector'
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
        discountModels: 'someData',
        generalInformation: {
          name: 'test1',
          type: 'Normal',
          endDate: '2021-01-01T00:00:00.000Z',
          startDate: '2020-12-01T00:00:00.000Z'
        }
      },
      rawData: 'Ctr_raw-data-2'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contractWithNoSignatures, contractWithSignatures])
        .then((initDbWithContractsResp) => {
          contractWithNoSignatures.id = initDbWithContractsResp[0].id;
          contractWithSignatures.id = initDbWithContractsResp[1].id;
          debugSetup('The db is initialized with 2 contracts : ', initDbWithContractsResp.map((c) => c.id));
          debugSetup('==> done!');
          done();
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('Put send contract OK with minimum contract details', function(done) {
      blockchainAdapterNock.post('/private-documents')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/private-documents');
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              documentID: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
            },
            undefined
          ];
        });
      try {
        const path = globalVersion + '/contracts/' + contractWithNoSignatures.id + '/send/';
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
            expect(Object.keys(response.body)).have.members(['contractId', 'state', 'documentId', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('contractId', contractWithNoSignatures.id);
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('documentId').that.is.a('string');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'fromMsp', 'toMsp']);
            expect(response.body.header).to.have.property('name', contractWithNoSignatures.name);
            expect(response.body.header).to.have.property('type', contractWithNoSignatures.type);
            expect(response.body.header).to.have.property('version', contractWithNoSignatures.version);

            expect(response.body.header).to.have.property('fromMsp').that.is.an('object');
            expect(Object.keys(response.body.header.fromMsp)).have.members(['mspId', 'signatures']);
            expect(response.body.header.fromMsp).to.have.property('mspId', contractWithNoSignatures.fromMsp.mspId);
            expect(response.body.header.fromMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMsp.signatures.length).to.equal(0);

            expect(response.body.header).to.have.property('toMsp').that.is.an('object');
            expect(Object.keys(response.body.header.toMsp)).have.members(['mspId', 'signatures']);
            expect(response.body.header.toMsp).to.have.property('mspId', contractWithNoSignatures.toMsp.mspId);
            expect(response.body.header.toMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMsp.signatures.length).to.equal(0);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['bankDetails', 'discountModels', 'generalInformation']);
            expect(response.body.body).to.deep.include(contractWithNoSignatures.body);

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

    it('Put send contract NOK if status is SENT', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractWithNoSignatures.id + '/send/';
        debug('path : ', path);

        const sentBody = {};

        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body.message).to.equal('Send contract not allowed');


            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send contract OK with maximum contract details', function(done) {
      blockchainAdapterNock.post('/private-documents')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/private-documents');
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              documentID: 'db441b0559d3f1f8144f1dc2da378a0abe0124325b6024b20a9e22de8809eca4'
            },
            undefined
          ];
        });
      try {
        const path = globalVersion + '/contracts/' + contractWithSignatures.id + '/send/';
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
            expect(Object.keys(response.body)).have.members(['contractId', 'state', 'documentId', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('contractId', contractWithSignatures.id);
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('documentId').that.is.a('string');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'fromMsp', 'toMsp']);
            expect(response.body.header).to.have.property('name', contractWithSignatures.name);
            expect(response.body.header).to.have.property('type', contractWithSignatures.type);
            expect(response.body.header).to.have.property('version', contractWithSignatures.version);

            expect(response.body.header).to.have.property('fromMsp').that.is.an('object');
            expect(Object.keys(response.body.header.fromMsp)).have.members(['mspId', 'signatures']);
            expect(response.body.header.fromMsp).to.have.property('mspId', contractWithSignatures.fromMsp.mspId);
            expect(response.body.header.fromMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMsp.signatures.length).to.equal(1);
            expect(Object.keys(response.body.header.fromMsp.signatures[0])).have.members(['id', 'name', 'role']);
            expect(response.body.header.fromMsp.signatures[0]).to.have.property('id', contractWithSignatures.fromMsp.signatures[0].id);
            expect(response.body.header.fromMsp.signatures[0]).to.have.property('name', contractWithSignatures.fromMsp.signatures[0].name);
            expect(response.body.header.fromMsp.signatures[0]).to.have.property('role', contractWithSignatures.fromMsp.signatures[0].role);

            expect(response.body.header).to.have.property('toMsp').that.is.an('object');
            expect(Object.keys(response.body.header.toMsp)).have.members(['mspId', 'signatures']);
            expect(response.body.header.toMsp).to.have.property('mspId', contractWithSignatures.toMsp.mspId);
            expect(response.body.header.toMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMsp.signatures.length).to.equal(2);
            expect(Object.keys(response.body.header.toMsp.signatures[0])).have.members(['id', 'name', 'role']);
            expect(response.body.header.toMsp.signatures[0]).to.have.property('id', contractWithSignatures.toMsp.signatures[0].id);
            expect(response.body.header.toMsp.signatures[0]).to.have.property('name', contractWithSignatures.toMsp.signatures[0].name);
            expect(response.body.header.toMsp.signatures[0]).to.have.property('role', contractWithSignatures.toMsp.signatures[0].role);
            expect(Object.keys(response.body.header.toMsp.signatures[1])).have.members(['id', 'name', 'role']);
            expect(response.body.header.toMsp.signatures[1]).to.have.property('id', contractWithSignatures.toMsp.signatures[1].id);
            expect(response.body.header.toMsp.signatures[1]).to.have.property('name', contractWithSignatures.toMsp.signatures[1].name);
            expect(response.body.header.toMsp.signatures[1]).to.have.property('role', contractWithSignatures.toMsp.signatures[1].role);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['bankDetails', 'discountModels', 'generalInformation']);
            expect(response.body.body).to.deep.include(contractWithSignatures.body);

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
