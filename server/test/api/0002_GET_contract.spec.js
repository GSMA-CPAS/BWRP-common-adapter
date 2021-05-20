// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API with minimum contract details`, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'B1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test3', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };

    const contract2 = {
      name: 'Contract name between A1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.3.1',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'C3'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIS',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIS', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, C3: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test2', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-2'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
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

    it('GET contract OK in JSON format', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id;
        debug('GET path : ', path);

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
            expect(Object.keys(response.body)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('contractId', contract1.id);
            expect(response.body).to.have.property('state', contract1.state);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['type', 'version', 'msps']);
            expect(response.body.header).to.have.property('type', contract1.type);
            expect(response.body.header).to.have.property('version', contract1.version);
            expect(response.body.header).to.have.property('msps').that.is.an('object');

            expect(Object.keys(response.body.header.msps)).have.members([contract1.fromMsp.mspId, contract1.toMsp.mspId]);
            expect(response.body.header.msps[contract1.fromMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps[contract1.toMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps[contract1.fromMsp.mspId].signatures.length).to.equal(0);
            expect(response.body.header.msps[contract1.toMsp.mspId].signatures.length).to.equal(0);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['bankDetails', 'discountModels', 'generalInformation']);
            expect(response.body.body).to.deep.include(contract1.body);

            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(1);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('GET contract OK in RAW format', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract2.id + '?format=RAW';
        debug('GET path : ', path);

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
            expect(Object.keys(response.body)).have.members(['contractId', 'state', 'referenceId', 'blockchainRef', 'creationDate', 'lastModificationDate', 'raw']);

            expect(response.body).to.have.property('contractId', contract2.id);
            expect(response.body).to.have.property('state', contract2.state);
            expect(response.body).to.have.property('referenceId', contract2.referenceId);
            expect(response.body).to.have.property('raw', contract2.rawData);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId', 'timestamp']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', contract2.blockchainRef.txId);
            expect(response.body.blockchainRef).to.have.property('timestamp').that.is.a('string');

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

describe(`Tests GET ${route} API FAILED`, function() {
  describe(`Setup and Test GET ${route} API FAILED with minimum contract details`, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'B1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test3', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };

    const contract2 = {
      name: 'Contract name between A1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.3.1',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'C3'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIS',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIS', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, C3: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test2', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      }
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
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

    it('GET contract FAILED in RAW format for DRAFT contract', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '?format=RAW';
        debug('GET path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));

            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body).to.have.property('internalErrorCode', 2002);
            expect(response.body).to.have.property('message', 'Unvailable RAW format');
            expect(response.body).to.have.property('description', 'The RAW format of this contract is unavailable.');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('GET contract FAILED in RAW format for contract without rawData', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract2.id + '?format=RAW';
        debug('GET path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));

            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body).to.have.property('internalErrorCode', 2002);
            expect(response.body).to.have.property('message', 'Unvailable RAW format');
            expect(response.body).to.have.property('description', 'The RAW format of this contract is unavailable.');

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
