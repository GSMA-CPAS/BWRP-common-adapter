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
    /* eslint-disable max-len */
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
      blockchainRef: {type: 'hlf', txId: 'TX-c1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb', timestamp: new Date().toJSON()},
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
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
      blockchainRef: {type: 'hlf', txId: 'TX-ceivedbec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb', timestamp: new Date().toJSON()},
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    const sentContractWith3Signatures = {
      name: 'Contract sent between MSP1 and MSP2',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'MSP1', signatures: [{role: 'role1', name: 'name1', id: 'id1'}, {role: 'role2', name: 'name2', id: 'id2'}]},
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
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'TxId-5fd8d6070cc5feb0fc0cb9e433ff'},
        {id: '5fd8d6070cc5feb0fc0cb9e433fd', msp: 'fromMsp', index: 1, txId: 'TxId-5fd8d6070cc5feb0fc0cb9e433fd'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0, txId: 'TxId-5fd8d6070cc5feb0fc0cb9e5d45f'}
      ],
      referenceId: 'aac1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
      blockchainRef: {type: 'hlf', txId: 'TX-c1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb', timestamp: new Date().toJSON()},
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    const receivedContractWith2Signatures = {
      name: 'Contract sent between MSP1 and MSP2',
      state: 'RECEIVED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'MSP1', signatures: [{role: 'role1', name: 'name1', id: 'id1'}, {role: 'role2', name: 'name2', id: 'id2'}, {role: 'role3', name: 'name3', id: 'id3'}]},
      toMsp: {mspId: 'MSP2', signatures: [{role: 'roleA', name: 'nameA', id: 'idA'}, {role: 'roleB', name: 'nameB', id: 'idB'}]},
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
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'TxId-5fd8d6070cc5feb0fc0cb9e433ff'},
        {id: '5fd8d6070cc5feb0fc0cb9e433fd', msp: 'fromMsp', index: 1},
        {id: '5fd8d6070cc5feb0fc0cb9e433fe', msp: 'fromMsp', index: 2},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0, txId: 'TxId-5fd8d6070cc5feb0fc0cb9e5d45f'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45e', msp: 'toMsp', index: 1}
      ],
      referenceId: 'receivedaac1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb',
      blockchainRef: {type: 'hlf', txId: 'TX-ceivedbec1ef2dbce73b6ae9841cf2edfa56de1f16d5a33d8a657de258e85c5f2e1bcb', timestamp: new Date().toJSON()},
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    /* eslint-enable max-len */

    before((done) => {
      debugSetup('==> init db with 5 contracts');
      testsDbUtils.initDbWithContracts([draftContract, sentContract, receivedContract, sentContractWith3Signatures, receivedContractWith2Signatures])
        .then((initDbWithContractsResp) => {
          debugSetup('5 contracts in db ', initDbWithContractsResp);
          draftContract.id = initDbWithContractsResp[0].id;
          sentContract.id = initDbWithContractsResp[1].id;
          receivedContract.id = initDbWithContractsResp[2].id;
          sentContractWith3Signatures.id = initDbWithContractsResp[3].id;
          receivedContractWith2Signatures.id = initDbWithContractsResp[4].id;
          done();
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
              fromMSP: 'DTAG',
              toMSP: 'TMUS',
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

    it('Get signatures OK on a SENT contract with one UNSIGNED signatures', function(done) {
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
            expect(response.body.length).to.equal(0);
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK on a RECEIVED contract with one UNSIGNED signatures', function(done) {
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
            expect(response.body.length).to.equal(0);
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK on a SENT contract with 3 SIGNED signatures', function(done) {
      try {
        const path = globalVersion + '/contracts/' + sentContractWith3Signatures.id + '/signatures/';
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
            expect(response.body.length).to.equal(3);
            expect(response.body[0]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[0]).to.have.property('contractId', sentContractWith3Signatures.id);
            expect(response.body[0]).to.have.property('msp', sentContractWith3Signatures.fromMsp.mspId);
            expect(response.body[0]).to.have.property('state', 'SIGNED');
            expect(response.body[1]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[1]).to.have.property('contractId', sentContractWith3Signatures.id);
            expect(response.body[1]).to.have.property('msp', sentContractWith3Signatures.fromMsp.mspId);
            expect(response.body[1]).to.have.property('state', 'SIGNED');
            expect(response.body[2]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[2]).to.have.property('contractId', sentContractWith3Signatures.id);
            expect(response.body[2]).to.have.property('msp', sentContractWith3Signatures.toMsp.mspId);
            expect(response.body[2]).to.have.property('state', 'SIGNED');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get signatures OK on a RECEIVED contract with 2 SIGNED signatures', function(done) {
      try {
        const path = globalVersion + '/contracts/' + receivedContractWith2Signatures.id + '/signatures/';
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
            expect(response.body[0]).to.have.property('contractId', receivedContractWith2Signatures.id);
            expect(response.body[0]).to.have.property('msp', receivedContractWith2Signatures.fromMsp.mspId);
            expect(response.body[0]).to.have.property('state', 'SIGNED');
            expect(response.body[1]).to.have.property('signatureId').that.is.a('string');
            expect(response.body[1]).to.have.property('contractId', receivedContractWith2Signatures.id);
            expect(response.body[1]).to.have.property('msp', receivedContractWith2Signatures.toMsp.mspId);
            expect(response.body[1]).to.have.property('state', 'SIGNED');
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
