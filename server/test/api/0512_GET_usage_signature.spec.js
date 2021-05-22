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
const route = '/contracts/{contractId}/usages/{usageId}/signatures/{signatureId}';


describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API with minimum contract details`, function() {
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


    it('GET SIGNED signature OK', function(done) {
      try {
        const signatureId = usageSent.signatureLink[0].id;

        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageSent.id + '/signatures/' + signatureId;
        debug('GET path : ', path);

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + usageSent.referenceId + '/' + usageSent.mspOwner)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              getSignatureFromBlockchainAdapterResponse,
              undefined
            ];
          });

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
            expect(Object.keys(response.body)).have.members(['signatureId', 'usageId', 'msp', 'algorithm', 'certificate', 'signature', 'blockchainRef', 'state']);

            expect(response.body).to.have.property('signatureId', signatureId);
            expect(response.body).to.have.property('usageId', usageSent.id);
            expect(response.body).to.have.property('msp', usageSent.mspOwner);
            expect(response.body).to.have.property('algorithm', getSignatureFromBlockchainAdapterResponse.f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7.algorithm);
            expect(response.body).to.have.property('certificate', getSignatureFromBlockchainAdapterResponse.f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7.certificate);
            expect(response.body).to.have.property('signature', getSignatureFromBlockchainAdapterResponse.f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7.signature);
            expect(response.body).to.have.property('state', 'SIGNED');

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('GET UNSIGNED signature OK on toMSP', function(done) {
      try {
        const signatureId = usageSent.signatureLink[1].id;

        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageSent.id + '/signatures/' + signatureId;
        debug('GET path : ', path);

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + usageSent.referenceId + '/' + usageSent.mspReceiver)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              getSignatureFromBlockchainAdapterResponse,
              undefined
            ];
          });

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
            expect(Object.keys(response.body)).have.members(['signatureId', 'usageId', 'msp', 'state']);

            expect(response.body).to.have.property('signatureId', signatureId);
            expect(response.body).to.have.property('usageId', usageSent.id);
            expect(response.body).to.have.property('msp', usageSent.mspReceiver);
            expect(response.body).to.have.property('state', 'UNSIGNED');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signature KO without contractId in DB', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const signatureId = usageSent.signatureLink[0].id;

        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/usages/' + usageSent.id + '/signatures/' + signatureId;
        debug('GET path : ', path);

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

    it('Get signature KO without usageId in DB', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const signatureId = usageSent.signatureLink[0].id;
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + 'id_' + randomValue + '/signatures/' + signatureId;

        debug('GET path : ', path);

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

    it('Get signature KO on usage not SENT or RECEIVED', function(done) {
      try {
        const signatureId = 'asignatureId';

        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageDraft.id + '/signatures/' + signatureId;
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
    it('Get signature KO on wrong signatureId', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();

        const wrongSignatureId = usageSent.signatureLink[0].id + randomValue;
        const path = globalVersion + '/contracts/' + sentContract.id + '/usages/' + usageSent.id + '/signatures/' + wrongSignatureId;
        debug('GET path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Get signatures not allowed');
            expect(response.body.description).to.equal('This signature Id doesn\'t exist');
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
