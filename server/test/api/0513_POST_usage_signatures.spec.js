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

describe(`Tests POST ${route} API OK`, function() {
  describe(`Setup and Test POST ${route} API`, function() {
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
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0},
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
    const usageSentFullySigned = {
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
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'af6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0, txId: 'bf6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'}
      ],
    };
    const usageReceivedFullySigned = {
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
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'af6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0, txId: 'bf6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'}
      ],
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
          usageSentFullySigned.contractId = sentContract.id;
          usageReceivedFullySigned.contractId = sentContract.id;
          debugSetup('==> init db with 5 usages');

          testsDbUtils.initDbWithUsages([usageSent, usageReceived, usageDraft, usageSentFullySigned, usageReceivedFullySigned])
            .then((initDbWithUsagesResp) => {
              debugSetup('5 usages documents linked to contract ', initDbWithUsagesResp);
              usageSent.id = initDbWithUsagesResp[0].id;
              usageReceived.id = initDbWithUsagesResp[1].id;
              usageDraft.id = initDbWithUsagesResp[2].id;
              usageSentFullySigned.id = initDbWithUsagesResp[3].id;
              usageReceivedFullySigned.id = initDbWithUsagesResp[4].id;
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


    it('Post signatures OK for SENT usage', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageSent.id + '/signatures/';
        debug('POST path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

        blockchainAdapterNock.put('/signatures/' + usageSent.referenceId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              {
                txID: 'txidf2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
              },
              undefined
            ];
          });
        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(Object.keys(response.body)).have.members(['blockchainRef', 'signatureId', 'usageId', 'msp', 'algorithm', 'certificate', 'signature', 'state']);

            expect(response.body).to.have.property('signatureId', usageSent.signatureLink[0].id);
            expect(response.body).to.have.property('usageId', usageSent.id);
            expect(response.body).to.have.property('msp', usageSent.mspOwner);
            expect(response.body).to.have.property('algorithm', sentBody.algorithm);
            expect(response.body).to.have.property('certificate', sentBody.certificate);
            expect(response.body).to.have.property('signature', sentBody.signature);

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'txidf2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/, '')}/${response.body.signatureId}`);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post signatures NOK on wrong usageId', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + 'id_' + randomValue + '/signatures/';
        debug('POST path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
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

    it('Post signatures KO if usage is not SENT or RECEIVED', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageDraft.id + '/signatures/';
        debug('POST path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

        blockchainAdapterNock.put('/signatures/' + sentContract.referenceId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              {
                txID: 'txidf2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
              },
              undefined
            ];
          });
        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Update signatures not allowed');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post signatures OK for RECEIVED usage', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageReceived.id + '/signatures/';
        debug('POST path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

        blockchainAdapterNock.put('/signatures/' + usageReceived.referenceId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              {
                txID: 'idf2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb'
              },
              undefined
            ];
          });
        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(Object.keys(response.body)).have.members(['blockchainRef', 'signatureId', 'usageId', 'msp', 'algorithm', 'certificate', 'signature', 'state']);

            expect(response.body).to.have.property('signatureId', usageReceived.signatureLink[1].id);
            expect(response.body).to.have.property('usageId', usageReceived.id);
            expect(response.body).to.have.property('msp', usageReceived.mspReceiver);
            expect(response.body).to.have.property('algorithm', sentBody.algorithm);
            expect(response.body).to.have.property('certificate', sentBody.certificate);
            expect(response.body).to.have.property('signature', sentBody.signature);

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'idf2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/, '')}/${response.body.signatureId}`);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post signatures KO for SENT usage with all signatures already present', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageSentFullySigned.id + '/signatures/';
        debug('POST path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body.message).to.equal('Update signatures not allowed');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post signatures KO for RECEIVED contract with all sigantures already present', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageReceivedFullySigned.id + '/signatures/';
        debug('POST path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body.message).to.equal('Update signatures not allowed');

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
