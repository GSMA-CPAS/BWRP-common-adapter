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
const route = '/contracts/{contractId}/usages/{usageId}';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API with minimum contract details`, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'B1'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contract2 = {
      name: 'Contract name between B1 and C1',
      state: 'SIGNED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: 'C1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const usage1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: contract1.id,
      mspOwner: 'A1',
      mspReceiver: 'B1',
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'DRAFT'
    };
    const usage2 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data SENT',
      contractId: contract1.id,
      mspOwner: 'A1',
      mspReceiver: 'B1',
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIS',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIS', timestamp: new Date().toJSON()},
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'SENT',
      rawData: 'Ctr_raw-data-2'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          debugSetup('Two contracts in db ', initDbWithContractsResp);
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
          usage1.contractId = contract1.id;
          usage1.mspOwner = contract1.fromMsp.mspId;
          usage2.contractId = contract1.id;
          usage2.mspOwner = contract1.fromMsp.mspId;
          testsDbUtils.initDbWithUsages([usage1, usage2])
            .then((initDbWithUsagesResp) => {
              debugSetup('Two usage documents linked to contract ', initDbWithUsagesResp[0].contractId);
              usage1.id = initDbWithUsagesResp[0].id;
              usage2.id = initDbWithUsagesResp[1].id;
              debugSetup('==> done!');
              done();
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

    it('GET usage OK in JSON format', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/' + usage1.id;
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
            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usage1.id);
            expect(response.body).to.have.property('state', usage1.state);
            expect(response.body).to.have.property('mspOwner', usage1.mspOwner);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', usage1.name);
            expect(response.body.header).to.have.property('type', usage1.type);
            expect(response.body.header).to.have.property('version', usage1.version);
            expect(response.body.header).to.have.property('mspOwner', usage1.mspOwner);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);
            expect(response.body.body).to.deep.include(usage1.body);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('GET usage OK in RAW format', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/' + usage2.id + '?format=RAW';
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
            expect(Object.keys(response.body)).have.members(['usageId', 'state', 'referenceId', 'blockchainRef', 'creationDate', 'lastModificationDate', 'raw']);

            expect(response.body).to.have.property('usageId', usage2.id);
            expect(response.body).to.have.property('state', usage2.state);
            expect(response.body).to.have.property('referenceId', usage2.referenceId);
            expect(response.body).to.have.property('raw', usage2.rawData);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId', 'timestamp']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', usage2.blockchainRef.txId);
            expect(response.body.blockchainRef).to.have.property('timestamp').that.is.a('string');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('GET usage FAILED in RAW format for DRAFT usage', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/' + usage1.id + '?format=RAW';
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

            expect(response.body).to.have.property('internalErrorCode', 2028);
            expect(response.body).to.have.property('message', 'Unvailable RAW format');
            expect(response.body).to.have.property('description', 'The RAW format of this usage is unavailable.');

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
