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
const route = '/contracts/{contractId}/signatures/';

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} `, function() {
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
          index: 0
        },
        {
          id: '5fd8d6070cc5feb0fc0cb9e5d45f',
          msp: 'toMsp',
          index: 0
        }
      ],
      referenceId: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
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
      referenceId: 'receivedbec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
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

              testsDbUtils.initDbWithContracts([draftContract, sentContract, receivedContract])
                .then((initDbWithContractsResp) => {
                  debugSetup('3 contracts in db ', removeAllUsagesResp);
                  draftContract.id = initDbWithContractsResp[0].id;
                  sentContract.id = initDbWithContractsResp[1].id;
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

    it('Get signatures KO without contractId in DB', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/signatures/';
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

    it('Get signatures on DRAFT contract should return an error', function(done) {
      try {
        const path = globalVersion + '/contracts/' + draftContract.id + '/signatures/';
        debug('GET path : %s', path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
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

    it('Get signatures OK after a SEND on draft contract with one signature in from and toMsp ', function(done) {
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
              documentID: 'bec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb' + randomValue
            },
            undefined
          ];
        });
      try {
        const path = globalVersion + '/contracts/' + draftContract.id + '/send/';
        debug('path : ', path);

        const sentBody = {};

        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('send contract response.status: %s', JSON.stringify(response.status));
            debug('send contract response.body: %s', JSON.stringify(response.body));

            const path = globalVersion + '/contracts/' + draftContract.id + '/signatures/';
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
                expect(response.body.length).to.equal(2);
                expect(response.body[0]).to.have.property('signatureId').that.is.a('string');
                expect(response.body[0]).to.have.property('contractId', draftContract.id);
                expect(response.body[0]).to.have.property('msp', draftContract.fromMsp.mspId);
                expect(response.body[0]).to.have.property('name', draftContract.fromMsp.signatures[0].name);
                expect(response.body[0]).to.have.property('state', 'UNSIGNED');
                expect(response.body[1]).to.have.property('signatureId').that.is.a('string');
                expect(response.body[1]).to.have.property('contractId', draftContract.id);
                expect(response.body[1]).to.have.property('msp', draftContract.toMsp.mspId);
                expect(response.body[1]).to.have.property('name', draftContract.toMsp.signatures[0].name);
                expect(response.body[1]).to.have.property('state', 'UNSIGNED');
                done();
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK on a SENT contract with one signature in from and toMsp ', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContract.id + '/signatures/';
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
            expect(response.body.length).to.equal(2);
            expect(response.body[0]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[0]).to.have.property('contractId', sentContract.id);
            expect(response.body[0]).to.have.property('msp', sentContract.fromMsp.mspId);
            expect(response.body[0]).to.have.property('name', sentContract.fromMsp.signatures[0].name);
            expect(response.body[0]).to.have.property('state', 'UNSIGNED');
            expect(response.body[1]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[1]).to.have.property('contractId', sentContract.id);
            expect(response.body[1]).to.have.property('msp', sentContract.toMsp.mspId);
            expect(response.body[1]).to.have.property('name', sentContract.toMsp.signatures[0].name);
            expect(response.body[1]).to.have.property('state', 'UNSIGNED');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK on a RECEIVED contract with one signature in from and toMsp ', function(done) {
      try {
        const path = globalVersion + '/contracts/' + receivedContract.id + '/signatures/';
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
            expect(response.body.length).to.equal(2);
            expect(response.body[0]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[0]).to.have.property('contractId', receivedContract.id);
            expect(response.body[0]).to.have.property('msp', receivedContract.fromMsp.mspId);
            expect(response.body[0]).to.have.property('name', receivedContract.fromMsp.signatures[0].name);
            expect(response.body[0]).to.have.property('state', 'UNSIGNED');
            expect(response.body[1]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[1]).to.have.property('contractId', receivedContract.id);
            expect(response.body[1]).to.have.property('msp', receivedContract.toMsp.mspId);
            expect(response.body[1]).to.have.property('name', receivedContract.toMsp.signatures[0].name);
            expect(response.body[1]).to.have.property('state', 'UNSIGNED');
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
