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


describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API with minimum contract details`, function() {
    const sentContract = {
      name: 'Contract sent between MSP1 and MSP2',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: 'MSP1',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
          }
        ]
      },
      toMsp: {
        mspId: 'MSP2',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
          }
        ]
      },
      body: {
        bankDetails: {
          MSP1: {
            iban: null,
            bankName: null,
            currency: null
          },
          MSP2: {
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
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {
          date: '2020-12-15T15:28:06.968Z',
          action: 'CREATION'
        },
        {
          date: '2020-12-15T15:28:07.077Z',
          action: 'SENT'
        }
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      signatureLink: [
        {
          id: '5fd8d6070cc5feb0fc0cb9e433ff',
          msp: 'fromMsp',
          index: 0,
          txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'
        },
        {
          id: '5fd8d6070cc5feb0fc0cb9e5d45f',
          msp: 'toMsp',
          index: 0
        }
      ],
      documentId: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    const draftContract = {
      name: 'Contract name between MSP1 and MSP2',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: 'A1',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
          }
        ]
      },
      toMsp: {
        mspId: 'B1',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
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
      }
    };
    const receivedContract = {
      name: 'Contract sent between MSP1 and MSP2',
      state: 'RECEIVED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: 'MSP1',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
          }
        ]
      },
      toMsp: {
        mspId: 'MSP2',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
          }
        ]
      },
      body: {
        bankDetails: {
          MSP1: {
            iban: null,
            bankName: null,
            currency: null
          },
          MSP2: {
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
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {
          date: '2020-12-15T15:28:06.968Z',
          action: 'CREATION'
        },
        {
          date: '2020-12-15T15:28:07.077Z',
          action: 'SENT'
        }
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      signatureLink: [
        {
          id: '5fd8d6070cc5feb0fc0cb9e433ff',
          msp: 'fromMsp',
          index: 0
        },
        {
          id: '5fd8d6070cc5feb0fc0cb9e5d45f',
          msp: 'toMsp',
          index: 0
        }
      ],
      documentId: 'receivedbec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };


    before((done) => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then((removeAllContractsResp) => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);

          testsDbUtils.removeAllUsages({})
            .then((removeAllUsagesResp) => {
              debugSetup('All usages in db are removed : ', removeAllUsagesResp);

              testsDbUtils.initDbWithContracts([sentContract, draftContract, receivedContract])
                .then((initDbWithContractsResp) => {
                  debugSetup('3 contracts in db ', removeAllUsagesResp);
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
            })
            .catch((removeAllUsagesError) => {
              debugSetup('Error removing usages in db : ', removeAllUsagesError);
              debugSetup('==> failed!');
              done(removeAllUsagesError);
            });
        })
        .catch((removeAllContractsError) => {
          debugSetup('Error removing contracts in db : ', removeAllContractsError);
          debugSetup('==> failed!');
          done(removeAllContractsError);
        });
    });

    it('GET SIGNED signature OK', function(done) {
      try {
        const signatureId = sentContract.signatureLink[0].id;

        const path = globalVersion + '/contracts/' + sentContract.id + '/signatures/' + signatureId;
        debug('GET path : ', path);

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + sentContract.documentId + '/' + sentContract.fromMsp.mspId)
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
            expect(Object.keys(response.body)).have.members(['signatureId', 'contractId', 'msp', 'name', 'role', 'algorithm', 'certificate', 'signature', 'state']);

            expect(response.body).to.have.property('signatureId', signatureId);
            expect(response.body).to.have.property('contractId', sentContract.id);
            expect(response.body).to.have.property('msp', sentContract.fromMsp.mspId);
            expect(response.body).to.have.property('name', sentContract.fromMsp.signatures[0].name);
            expect(response.body).to.have.property('role', sentContract.fromMsp.signatures[0].role);
            expect(response.body).to.have.property('algorithm', getSignatureFromBlockchainAdapterResponse.f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7.algorithm);
            expect(response.body).to.have.property('certificate', getSignatureFromBlockchainAdapterResponse.f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7.certificate);
            expect(response.body).to.have.property('signature', getSignatureFromBlockchainAdapterResponse.f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7.signature);
            expect(response.body).to.have.property('state', 'SIGNED');

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
        const signatureId = sentContract.signatureLink[1].id;

        const path = globalVersion + '/contracts/' + sentContract.id + '/signatures/' + signatureId;
        debug('GET path : ', path);

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + sentContract.documentId + '/' + sentContract.toMsp.mspId)
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
            expect(Object.keys(response.body)).have.members(['signatureId', 'contractId', 'msp', 'name', 'role', 'state']);

            expect(response.body).to.have.property('signatureId', signatureId);
            expect(response.body).to.have.property('contractId', sentContract.id);
            expect(response.body).to.have.property('msp', sentContract.toMsp.mspId);
            expect(response.body).to.have.property('name', sentContract.toMsp.signatures[0].name);
            expect(response.body).to.have.property('role', sentContract.toMsp.signatures[0].role);
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
        const signatureId = sentContract.signatureLink[0].id;

        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/signatures/' + signatureId;

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

    it('Get signature KO on contract not SENT or RECEIVED', function(done) {
      try {
        const signatureId = 'asignatureId';

        const path = globalVersion + '/contracts/' + draftContract.id + '/signatures/' + signatureId;
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

            expect(response.body).to.have.property('internalErrorCode', 2009);
            expect(response.body).to.have.property('message', 'Get signatures not allowed');
            expect(response.body).to.have.property('description', 'It\'s only allowed to get signatures on contracts SENT or RECEIVED.');


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

        const wrongSignatureId = sentContract.signatureLink[0].id + randomValue;
        const path = globalVersion + '/contracts/' + sentContract.id + '/signatures/' + wrongSignatureId;
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
