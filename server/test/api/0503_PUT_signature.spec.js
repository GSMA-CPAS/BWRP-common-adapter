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
const route = '/contracts/{contractId}/signatures/{signatureId}';

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API`, function() {
    /* eslint-disable max-len */
    const sentContract = {
      name: 'Contract sent between MSP1 and MSP2',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'MSP1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'MSP2', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      body: {
        bankDetails: {MSP1: {iban: null, bankName: null, currency: null}, MSP2: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {date: '2020-12-15T15:28:06.968Z', action: 'CREATION'},
        {date: '2020-12-15T15:28:07.077Z', action: 'SENT'}
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      signatureLink: [
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
      referenceId: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    const draftContract = {
      name: 'Contract name between MSP1 and MSP2',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'B1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      }
    };
    const receivedContract = {
      name: 'Contract sent between MSP1 and MSP2',
      state: 'RECEIVED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'MSP1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'MSP2', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      body: {
        bankDetails: {MSP1: {iban: null, bankName: null, currency: null}, MSP2: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {date: '2020-12-15T15:28:06.968Z', action: 'CREATION'},
        {date: '2020-12-15T15:28:07.077Z', action: 'SENT'}
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      signatureLink: [
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
      referenceId: 'receivedbec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    /* eslint-enable max-len */

    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([sentContract, draftContract, receivedContract])
        .then((initDbWithContractsResp) => {
          debugSetup('3 contracts in db ', initDbWithContractsResp);
          sentContract.id = initDbWithContractsResp[0].id;
          draftContract.id = initDbWithContractsResp[1].id;
          receivedContract.id = initDbWithContractsResp[2].id;
          done();
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('Put signature OK on fromMsp for SENT contract', function(done) {
      try {
        const signatureId = sentContract.signatureLink[0].id;
        const path = globalVersion + '/contracts/' + sentContract.id + '/signatures/' + signatureId;
        debug('PUT path : ', path);

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

            expect(Object.keys(response.body)).have.members(['signatureId', 'contractId', 'msp', 'name', 'role', 'algorithm', 'certificate', 'signature', 'state']);

            expect(response.body).to.have.property('signatureId', sentContract.signatureLink[0].id);
            expect(response.body).to.have.property('contractId', sentContract.id);
            expect(response.body).to.have.property('msp', sentContract.fromMsp.mspId);
            expect(response.body).to.have.property('algorithm', sentBody.algorithm);
            expect(response.body).to.have.property('certificate', sentBody.certificate);
            expect(response.body).to.have.property('signature', sentBody.signature);


            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put signature NOK on wrong contractId', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const signatureId = sentContract.signatureLink[0].id;
        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/signatures/' + signatureId;
        debug('PUT path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

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

    it('Put signature KO if contract is not SENT or RECEIVED', function(done) {
      try {
        const signatureId = sentContract.signatureLink[0].id;
        const path = globalVersion + '/contracts/' + draftContract.id + '/signatures/' + signatureId;
        debug('PUT path : ', path);

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
          .put(`${path}`)
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

    it('Put signature KO if signatureId not exists', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();

        const wrongSignatureId = sentContract.signatureLink[0].id + randomValue;
        const path = globalVersion + '/contracts/' + sentContract.id + '/signatures/' + wrongSignatureId;
        debug('PUT path : ', path);

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
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Update signatures not allowed');
            expect(response.body.description).to.equal('This signature Id doesn\'t exist');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put signature KO on fromMsp if RECEIVED', function(done) {
      try {
        const signatureId = receivedContract.signatureLink[0].id;
        const path = globalVersion + '/contracts/' + receivedContract.id + '/signatures/' + signatureId;
        debug('PUT path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };
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

            expect(response.body.message).to.equal('Update signatures not allowed');
            expect(response.body.description).to.equal('For RECEIVED contract update signature only allowed on toMsp');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put signature OK on toMsp for RECEIVED contract', function(done) {
      try {
        const signatureId = receivedContract.signatureLink[1].id;
        const path = globalVersion + '/contracts/' + receivedContract.id + '/signatures/' + signatureId;
        debug('PUT path : ', path);

        const sentBody = {
          signature: 'signature',
          certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
          algorithm: 'secp384r1'
        };

        blockchainAdapterNock.put('/signatures/' + receivedContract.referenceId)
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

            expect(Object.keys(response.body)).have.members(['signatureId', 'contractId', 'msp', 'name', 'role', 'algorithm', 'certificate', 'signature', 'state']);

            expect(response.body).to.have.property('signatureId', receivedContract.signatureLink[1].id);
            expect(response.body).to.have.property('contractId', receivedContract.id);
            expect(response.body).to.have.property('msp', receivedContract.toMsp.mspId);
            expect(response.body).to.have.property('algorithm', sentBody.algorithm);
            expect(response.body).to.have.property('certificate', sentBody.certificate);
            expect(response.body).to.have.property('signature', sentBody.signature);


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
