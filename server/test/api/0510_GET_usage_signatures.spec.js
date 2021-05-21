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
const route = '/contracts/{contractId}/usages/{usageId}/signatures/';

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} `, function() {
    /* eslint-disable max-len */
    const sentContract = {
      name: 'Contract sent between ORAGR and DTAG',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'ORAGR', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'DTAG', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      body: {
        bankDetails: {ORAGR: {iban: null, bankName: null, currency: null}, DTAG: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {date: '2020-12-15T15:28:06.968Z', action: 'CREATION'},
        {date: '2020-12-15T15:28:07.077Z', action: 'SENT'}
      ],
      referenceId: '0326796a8cad50871c0311d88b492805a7e39880e33a09e5ee90472750281565',
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      rawData: 'Some_raw_data'
    };
    const usageSent = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - sent',
      contractId: undefined,
      mspOwner: 'ORAGR',
      mspReceiver: 'DTAG',
      body: {
        data: []
      },
      state: 'SENT',
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {date: '2020-12-15T15:28:06.968Z', action: 'CREATION'},
        {date: '2020-12-15T15:28:07.077Z', action: 'SENT'}
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      contractReferenceId: '0326796a8cad50871c0311d88b492805a7e39880e33a09e5ee90472750281565',
      referenceId: '9fa8484695bb8e2406d1e8ac5bcae6bbb8af08e3c887c2d3a0efd11ea61fa0a7',
      blockchainRef: {type: 'hlf', txId: '149615f8dee35617a491dfb54d463a45617becc7f1aa5c3712e683d7688213d0', timestamp: new Date().toJSON()},
      rawData: 'Ctr_raw-data',
      storageKeys: ['b70af48b18681d2b51c77c7ed3bf63217caafc91a593d5d1b4f9bbb1c93c2273'],
      signatureLink: [
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
    };
    const usageReceived = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - received',
      contractId: undefined,
      mspOwner: 'DTAG',
      mspReceiver: 'ORAGR',
      body: {
        data: []
      },
      state: 'RECEIVED',
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {date: '2020-12-15T15:28:06.968Z', action: 'CREATION'},
        {date: '2020-12-15T15:28:07.077Z', action: 'SENT'}
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      contractReferenceId: '0326796a8cad50871c0311d88b492805a7e39880e33a09e5ee90472750281565',
      referenceId: '9ff46be1d3e0160689875e7383e584eb9394518982e94d58d7b944a632178cee',
      blockchainRef: {type: 'hlf', txId: '7089e51144c8e70f48bfecd34d5c39c6d9150b4f4b962884037d392fe8748f3e', timestamp: new Date().toJSON()},
      rawData: 'Ctr_raw-data',
      storageKeys: ['573ba6643181fb8487dcc14f26587e3c2d54a2271aff4965785ca7a70d52c579', 'aadaef3e3d0756b69ff352a82ae52c8a025f208bfafd946b09fff43c7b89c4b1'],
      signatureLink: [
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
    };
    const usageDraft = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - draft',
      contractId: undefined,
      mspOwner: 'ORAGR',
      mspReceiver: 'DTAG',
      body: {
        data: []
      },
      state: 'DRAFT',
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {date: '2020-12-15T15:28:06.968Z', action: 'CREATION'},
        {date: '2020-12-15T15:28:07.077Z', action: 'SENT'}
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      contractReferenceId: '0326796a8cad50871c0311d88b492805a7e39880e33a09e5ee90472750281565',

    };

    /* eslint-enable max-len */

    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([sentContract])
        .then((initDbWithContractsResp) => {
          debugSetup('Added contract(s) in db ', initDbWithContractsResp);
          sentContract.id = initDbWithContractsResp[0].id;
          usageSent.contractId = sentContract.id;
          usageReceived.contractId = sentContract.id;
          usageDraft.contractId = sentContract.id;
          debugSetup('==> init db with 2 usages');

          testsDbUtils.initDbWithUsages([usageSent, usageReceived, usageDraft])
            .then((initDbWithUsagesResp) => {
              debugSetup('2 usages documents linked to contract ', initDbWithUsagesResp);
              usageSent.id = initDbWithUsagesResp[0].id;
              usageReceived.id = initDbWithUsagesResp[1].id;
              usageDraft.id = initDbWithUsagesResp[2].id;
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


    it('Get signatures KO without contractId in DB', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/usages/' + usageSent.id + '/signatures/';
        debug('GET path : %s', path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body).to.have.property('internalErrorCode', 60);
            expect(response.body).to.have.property('message', 'Resource not found');
            expect(response.body).to.have.property('description', 'The requested URI or the requested resource does not exist.');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures on DRAFT usage should return an error', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageDraft.id + '/signatures/';
        debug('GET path : %s', path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body).to.have.property('internalErrorCode', 2027);
            expect(response.body).to.have.property('message', 'Get signatures not allowed');
            expect(response.body).to.have.property('description', 'It\'s only allowed to get signatures on usages SENT or RECEIVED.');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK after a SEND on draft usage', function(done) {
      const randomValue = testsUtils.defineRandomValue();
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
              toMSP: 'ORAGR',
              payload: 'payload',
              payloadHash: '239f59ed55e737c77147cf55ad0c1b030b6d7ee748a7426952f9b852d5a935e5',
              blockchainRef: {
                type: 'hlf',
                txID: 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb',
                timestamp: '2021-03-15T11:43:49Z'
              },
              referenceID: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb' + randomValue
            },
            undefined
          ];
        });
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageDraft.id + '/send/';
        debug('path : ', path);

        const sentBody = {};

        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('send usage response.status: %s', JSON.stringify(response.status));
            debug('send usage response.body: %s', JSON.stringify(response.body));

            const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageDraft.id+ '/signatures/';
            debug('GET path : ' + path);
            chai.request(testsUtils.getServer())
              .get(`${path}`)
              .end((error, response) => {
                debug('response.body: %s', JSON.stringify(response.body));
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response.body).to.exist;
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.equal(0);
                done();
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK on a SENT usage with one SIGNED signatures', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageSent.id + '/signatures/';
        debug('GET path : ' + path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK on a RECEIVED usage with one SIGNED signatures', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageReceived.id + '/signatures/';
        debug('GET path : ' + path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);
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
