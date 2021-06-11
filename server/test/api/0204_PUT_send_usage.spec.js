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

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/{usageId}/send/';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API`, function() {
    const contractDraft = {
      name: 'Contract name between A1 and B1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: testsUtils.getSelfMspId()},
      toMsp: {mspId: 'B1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contractSent = {
      name: 'Contract name between B1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: testsUtils.getSelfMspId(), signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'C1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contractReceived = {
      name: 'Contract name between B1 and C1',
      state: 'RECEIVED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: testsUtils.getSelfMspId()},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIU',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIU', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const usageMinimumData = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: []
      },
      state: 'DRAFT'
    };
    const usageMoreData = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'DRAFT'
    };
    const usageSent = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'SENT'
    };
    const usageWithOtherMspOwner = {
      type: 'usage',
      version: '2.12.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'DRAFT'
    };
    const contractSentWithUsageReceived = {
      name: 'contractSentWithUsageReceived',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: testsUtils.getSelfMspId(), signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'C1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAITA',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAITA', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-2'
    };
    const usageReceived = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'RECEIVED'
    };
    const usageMinimumDataForContractSentWithUsageReceived = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: []
      },
      state: 'DRAFT'
    };
    const lastUsageReceived = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'RECEIVED'
    };
    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([contractDraft, contractSent, contractReceived, contractSentWithUsageReceived])
        .then((initDbWithContractsResp) => {
          debugSetup('Three contracts where added in db ', initDbWithContractsResp);
          contractDraft.id = initDbWithContractsResp[0].id;
          contractSent.id = initDbWithContractsResp[1].id;
          contractReceived.id = initDbWithContractsResp[2].id;
          contractSentWithUsageReceived.id = initDbWithContractsResp[3].id;
          usageMinimumData.contractId = contractSent.id;
          usageMinimumData.mspOwner = contractSent.fromMsp.mspId;
          usageMinimumData.mspReceiver = contractSent.toMsp.mspId;
          usageMoreData.contractId = contractReceived.id;
          usageMoreData.mspOwner = contractReceived.toMsp.mspId;
          usageMoreData.mspReceiver = contractReceived.fromMsp.mspId;
          usageSent.contractId = contractReceived.id;
          usageSent.mspOwner = contractReceived.toMsp.mspId;
          usageSent.mspReceiver = contractReceived.fromMsp.mspId;
          usageWithOtherMspOwner.contractId = contractReceived.id;
          usageWithOtherMspOwner.mspOwner = contractReceived.fromMsp.mspId;
          usageWithOtherMspOwner.mspReceiver = contractReceived.toMsp.mspId;
          usageReceived.contractId = contractSentWithUsageReceived.id;
          usageReceived.mspOwner = contractSentWithUsageReceived.fromMsp.mspId;
          usageReceived.mspReceiver = contractSentWithUsageReceived.toMsp.mspId;
          lastUsageReceived.contractId = contractSentWithUsageReceived.id;
          lastUsageReceived.mspOwner = contractSentWithUsageReceived.fromMsp.mspId;
          lastUsageReceived.mspReceiver = contractSentWithUsageReceived.toMsp.mspId;
          usageMinimumDataForContractSentWithUsageReceived.contractId = contractSentWithUsageReceived.id;
          usageMinimumDataForContractSentWithUsageReceived.mspOwner = contractSentWithUsageReceived.fromMsp.mspId;
          usageMinimumDataForContractSentWithUsageReceived.mspReceiver = contractSentWithUsageReceived.toMsp.mspId;
          debugSetup('==> init db with 7 usages');
          testsDbUtils.initDbWithUsages([usageMinimumData, usageMoreData, usageSent, usageWithOtherMspOwner, usageReceived, usageMinimumDataForContractSentWithUsageReceived, lastUsageReceived])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 7 usages : ', initDbWithUsagesResp.map((c) => c.id));
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


    it('Put send usage OK on sent contract', function(done) {
      blockchainAdapterNock.post('/private-documents')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/private-documents');
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              fromMSP: 'DTAG',
              toMSP: 'TMUS',
              payload: 'payload',
              payloadHash: '239f59ed55e737c77147cf55ad0c1b030b6d7ee748a7426952f9b852d5a935e5',
              blockchainRef: {
                type: 'hlf',
                txID: 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb',
                timestamp: '2021-03-15T11:43:49Z'
              },
              referenceID: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
            },
            undefined
          ];
        });

      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageMinimumData.id + '/send/';
        debug('PUT path : ', path);

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

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'referenceId', 'blockchainRef', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usageMinimumData.id);
            expect(response.body).to.have.property('contractId', usageMinimumData.contractId);
            expect(response.body).to.have.property('mspOwner', usageMinimumData.mspOwner);
            expect(response.body).to.have.property('referenceId').that.is.a('string');
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', usageMinimumData.name);
            expect(response.body.header).to.have.property('type', usageMinimumData.type);
            expect(response.body.header).to.have.property('version', usageMinimumData.version);
            expect(response.body.header).to.have.property('mspOwner', usageMinimumData.mspOwner);

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId', 'timestamp']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb');
            expect(response.body.blockchainRef).to.have.property('timestamp').that.is.a('string');

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);
            expect(response.body.body).to.deep.include(usageMinimumData.body);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });


    it('Put send usage OK on received contract', function(done) {
      blockchainAdapterNock.post('/private-documents')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/private-documents');
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              fromMSP: 'DTAG',
              toMSP: 'TMUS',
              payload: 'payload',
              payloadHash: '239f59ed55e737c77147cf55ad0c1b030b6d7ee748a7426952f9b852d5a935e5',
              blockchainRef: {
                type: 'hlf',
                txID: 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb',
                timestamp: '2021-03-15T11:43:49Z'
              },
              referenceID: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
            },
            undefined
          ];
        });

      try {
        const path = globalVersion + '/contracts/' + contractReceived.id + '/usages/' + usageMoreData.id + '/send/';
        debug('PUT path : ', path);

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

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'referenceId', 'blockchainRef', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usageMoreData.id);
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('mspOwner', usageMinimumData.mspOwner);
            expect(response.body).to.have.property('referenceId').that.is.a('string');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', usageMoreData.name);
            expect(response.body.header).to.have.property('type', usageMoreData.type);
            expect(response.body.header).to.have.property('version', usageMoreData.version);
            expect(response.body.header).to.have.property('mspOwner', usageMoreData.mspOwner);

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId', 'timestamp']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb');
            expect(response.body.blockchainRef).to.have.property('timestamp').that.is.a('string');

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);
            expect(response.body.body).to.deep.include(usageMoreData.body);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send usage NOK on wrong contractId', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();

        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/usages/' + usageMinimumData.id + '/send/';
        debug('PUT path : ', path);

        const sentBody = {};
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Resource not found');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send usage NOK if usage in db is not DRAFT', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractReceived.id + '/usages/' + usageSent.id + '/send/';
        debug('PUT path : ', path);

        const sentBody = {};
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Send usage not allowed');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send usage NOK if usage mspOwner is not me', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractReceived.id + '/usages/' + usageWithOtherMspOwner.id + '/send/';
        debug('PUT path : ', path);

        const sentBody = {};
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Send usage not allowed');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send usage OK on sent contract with received usage in it', function(done) {
      blockchainAdapterNock.post('/private-documents')
        .times(1)
        .reply((pathReceived, bodyReceived) => {
          // Only for exemple
          expect(pathReceived).to.equals('/private-documents');
          // expect(bodyReceived).to.be.empty;
          return [
            200,
            {
              fromMSP: 'DTAG',
              toMSP: 'TMUS',
              payload: 'payload',
              payloadHash: '239f59ed55e737c77147cf55ad0c1b030b6d7ee748a7426952f9b852d5a935e5',
              blockchainRef: {
                type: 'hlf',
                txID: 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb',
                timestamp: '2021-03-15T11:43:49Z'
              },
              referenceID: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
            },
            undefined
          ];
        });

      try {
        const path = globalVersion + '/contracts/' + contractSentWithUsageReceived.id + '/usages/' + usageMinimumDataForContractSentWithUsageReceived.id + '/send/';
        debug('PUT path : ', path);

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

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'partnerUsageId', 'header', 'mspOwner', 'referenceId', 'blockchainRef', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usageMinimumDataForContractSentWithUsageReceived.id);
            expect(response.body).to.have.property('contractId', usageMinimumDataForContractSentWithUsageReceived.contractId);
            expect(response.body).to.have.property('mspOwner', usageMinimumDataForContractSentWithUsageReceived.mspOwner);
            expect(response.body).to.have.property('partnerUsageId', lastUsageReceived.id);
            expect(response.body).to.have.property('referenceId').that.is.a('string');
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', usageMinimumDataForContractSentWithUsageReceived.name);
            expect(response.body.header).to.have.property('type', usageMinimumDataForContractSentWithUsageReceived.type);
            expect(response.body.header).to.have.property('version', usageMinimumDataForContractSentWithUsageReceived.version);
            expect(response.body.header).to.have.property('mspOwner', usageMinimumDataForContractSentWithUsageReceived.mspOwner);

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId', 'timestamp']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb');
            expect(response.body.blockchainRef).to.have.property('timestamp').that.is.a('string');

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);
            expect(response.body.body).to.deep.include(usageMinimumDataForContractSentWithUsageReceived.body);

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
