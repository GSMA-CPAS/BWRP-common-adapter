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
const route = '/contracts/event/';

describe(`Tests POST ${route} API OK`, function() {
  describe(`Setup and Test POST ${route} API with STORE:DOCUMENTHASH event`, function() {
    before((done) => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then((removeAllContractsResp) => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);
          debugSetup('==> done!');
          done();
        })
        .catch((removeAllContractsError) => {
          debugSetup('Error removing contracts in db : ', removeAllContractsError);
          debugSetup('==> failed!');
          done(removeAllContractsError);
        });
    });

    it('Post event OK with minimum event details and only contracts in blockchain', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = 'd22bafe6e5b661e9f7b992889c6602638c885793a81226943618ecf1aa19d486';

        const idDocument1 = 'shuzahxazhxijazechxhuezhasqxsdchezu';
        const document1 = `{
          "type": "contract",
          "version": "2.1",
          "name": "StRiNg-Doc1-${Date.now().toString()}",
          "body": {
            "oneKey": "oneKeyValue",
            "otherKey": "otherKeyValue"
          }
        }`;
        const encodedDocument1 = Buffer.from(document1).toString('base64');

        const idDocument2 = 'zecxezhucheauhxazi';
        const document2 = `{
          "type": "contract",
          "version": "1.8",
          "name": "StRiNg-Doc2-${Date.now().toString()}",
          "body": {
            "test": "1"
          }
        }`;
        const encodedDocument2 = Buffer.from(document2).toString('base64');

        blockchainAdapterNock.get('/private-documents')
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/private-documents');
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `["${idDocument1}", "${idDocument2}"]`,
              undefined
            ];
          });

        blockchainAdapterNock.get(`/private-documents/${idDocument1}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument1}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `{
                "fromMSP":"DTAG",
                "toMSP":"TMUS",
                "data":"${encodedDocument1}",
                "dataHash":"notUsed",
                "timeStamp":"1606828827767664802",
                "id":"${idDocument1}"
              }`,
              undefined
            ];
          });

        blockchainAdapterNock.get(`/private-documents/${idDocument2}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument2}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `{
                "fromMSP":"DTAG",
                "toMSP":"TMUS",
                "data":"${encodedDocument2}",
                "dataHash":"notUsed",
                "timeStamp":"1606828827767664800",
                "id":"${idDocument2}"
              }`,
              undefined
            ];
          });

        blockchainAdapterNock.delete(`/private-documents/${idDocument1}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument1}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              ``,
              undefined
            ];
          });

        blockchainAdapterNock.delete(`/private-documents/${idDocument2}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument2}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              ``,
              undefined
            ];
          });

        const sentBody = {
          msp: 'DTAG',
          eventName: 'STORE:DOCUMENTHASH',
          timestamp: '2020-11-30T16:59:35Z',
          data: {
            storageKey: storageKey
          }
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);

            response.body.forEach((bodyArrayContent) => {
              expect(bodyArrayContent).to.be.an('Object');
              expect(Object.keys(bodyArrayContent)).have.members(['id', 'type', 'referenceId']);
              expect(bodyArrayContent).to.have.property('id').that.is.a('String');
              expect(bodyArrayContent).to.have.property('type', 'contract');
              expect(bodyArrayContent).to.have.property('referenceId').that.is.a('String');
            });

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            // idDocument1 timestamp is bigger than idDocument2 timestamp
            // so the first response.body array document is the document2
            // and the second response.body array document is the document1
            chai.request(testsUtils.getServer())
              .get(`${globalVersion}/contracts/${response.body[0].id}`)
              .send()
              .end((getError1, getResponse1) => {
                debug('response.body: %s', JSON.stringify(getResponse1.body));
                expect(getError1).to.be.null;
                expect(getResponse1).to.have.status(200);
                expect(getResponse1).to.be.json;
                expect(getResponse1.body).to.exist;
                expect(getResponse1.body).to.be.an('object');
                expect(getResponse1.body).to.have.property('state', 'RECEIVED');

                chai.request(testsUtils.getServer())
                  .get(`${globalVersion}/contracts/${response.body[1].id}`)
                  .send()
                  .end((getError2, getResponse2) => {
                    debug('response.body: %s', JSON.stringify(getResponse2.body));
                    expect(getError2).to.be.null;
                    expect(getResponse2).to.have.status(200);
                    expect(getResponse2).to.be.json;
                    expect(getResponse2.body).to.exist;
                    expect(getResponse2.body).to.be.an('object');
                    expect(getResponse2.body).to.have.property('state', 'RECEIVED');

                    chai.request(testsUtils.getServer())
                      .get(`${globalVersion}/contracts/${response.body[0].id}?format=RAW`)
                      .send()
                      .end((getError1, getResponse1) => {
                        debug('response.body: %s', JSON.stringify(getResponse1.body));
                        expect(getError1).to.be.null;
                        expect(getResponse1).to.have.status(200);
                        expect(getResponse1).to.be.json;
                        expect(getResponse1.body).to.exist;
                        expect(getResponse1.body).to.be.an('object');
                        expect(getResponse1.body).to.have.property('raw', encodedDocument2);

                        chai.request(testsUtils.getServer())
                          .get(`${globalVersion}/contracts/${response.body[1].id}?format=RAW`)
                          .send()
                          .end((getError2, getResponse2) => {
                            debug('response.body: %s', JSON.stringify(getResponse2.body));
                            expect(getError2).to.be.null;
                            expect(getResponse2).to.have.status(200);
                            expect(getResponse2).to.be.json;
                            expect(getResponse2.body).to.exist;
                            expect(getResponse2.body).to.be.an('object');
                            expect(getResponse2.body).to.have.property('raw', encodedDocument1);

                            done();
                          });
                      });
                  });
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });
  });

  describe(`Setup and Test POST ${route} API with STORE:SIGNATURE event`, function() {
    const sentContract = {
      name: 'Contract sent between TMUS and MSP2',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'TMUS', signatures: [{role: 'role', name: 'name', id: 'id'}]},
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
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
      referenceId: '15d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5',
      storageKeys: [
        '007unused',
        '1176751cb67a89f9d2cfdc1e912cb9746c3a1f9a49a01de508509bccf108eccd'
      ],
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    const receivedContract = {
      name: 'Contract received between TMUS and MSP2',
      state: 'RECEIVED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'TMUS', signatures: [{role: 'role', name: 'name', id: 'id'}]},
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
      referenceId: '25d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5',
      storageKeys: [
        'ad756b1cecacb073fa4808f5a754515e033f6b1b3247153d65b6510ae4c9bb49',
        '007unused'
      ],
      rawData: 'eyJ0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    const otherReceivedContract = {
      name: 'Contract received between TMUS and MSP3',
      state: 'RECEIVED',
      type: 'contract',
      version: '1.3.0',
      fromMsp: {mspId: 'TMUS', signatures: [{role: 'role', name: 'name', id: 'id'}, {role: 'role2', name: 'name2', id: 'id2'}, {role: 'role3', name: 'name3', id: 'id3'}]},
      toMsp: {mspId: 'MSP3', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      body: {
        bankDetails: {MSP1: {iban: null, bankName: null, currency: null}, MSP3: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test3', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      creationDate: '2020-12-15T15:28:06.968Z',
      history: [
        {date: '2020-12-15T15:28:06.968Z', action: 'CREATION'},
        {date: '2020-12-15T15:28:07.077Z', action: 'SENT'}
      ],
      lastModificationDate: '2020-12-15T15:28:07.077Z',
      signatureLink: [
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0},
        {id: '5fd8d6070cc5feb0fc0cb9e433fe', msp: 'fromMsp', index: 1},
        {id: '5fd8d6070cc5feb0fc0cb9e433fd', msp: 'fromMsp', index: 2},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
      referenceId: '99d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5',
      storageKeys: [
        '99756b1cecacb073fa4808f5a754515e033f6b1b3247153d65b6510ae4c9bb49',
        '007unused'
      ],
      rawData: '99J0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };

    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([sentContract, receivedContract, otherReceivedContract])
        .then((initDbWithContractsResp) => {
          debugSetup('Added contract(s) in db ', initDbWithContractsResp);
          sentContract.id = initDbWithContractsResp[0].id;
          receivedContract.id = initDbWithContractsResp[1].id;
          otherReceivedContract.id = initDbWithContractsResp[2].id;

          done();
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('Post SIGN event OK on SENT document that we signed', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = '1176751cb67a89f9d2cfdc1e912cb9746c3a1f9a49a01de508509bccf108eccd';
        // const targetMSPID = 'TMUS';
        // const referenceID = '15d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5';

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + sentContract.referenceId + '/' + sentContract.fromMsp.mspId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              getSignatureFromBlockchainAdapterResponse,
              undefined
            ];
          });

        const sentBody = {
          msp: 'TMUS',
          eventName: 'STORE:SIGNATURE',
          timestamp: '2020-11-30T16:59:35Z',
          data: {
            storageKey: storageKey
          }
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end(async (error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object').that.is.empty;
            // for SENt contract, nothing should be done
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.false;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post SIGN event OK on RECEIVED document not signed', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = 'ad756b1cecacb073fa4808f5a754515e033f6b1b3247153d65b6510ae4c9bb49';

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + receivedContract.referenceId + '/' + receivedContract.fromMsp.mspId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              getSignatureFromBlockchainAdapterResponse,
              undefined
            ];
          });

        const sentBody = {
          msp: 'TMUS',
          eventName: 'STORE:SIGNATURE',
          timestamp: '2020-11-30T16:59:35Z',
          data: {
            storageKey: storageKey
          }
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end(async (error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object').that.is.empty;
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            testsDbUtils.verifyContract(receivedContract.id,
              {
                'signatureLink': {
                  $elemMatch: {
                    msp: 'fromMsp',
                    index: 0,
                    txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'
                  }
                }
              })
              .then((verifyContractResp) => {
                debug('Verified contract : ', verifyContractResp);
                done();
              })
              .catch((verifyContractError) => {
                debug('Contract verification error : ', verifyContractError);
                done(verifyContractError);
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post SIGN event OK on RECEIVED document not signed with 2 signatures', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = '99756b1cecacb073fa4808f5a754515e033f6b1b3247153d65b6510ae4c9bb49';

        const getSignatureFromBlockchainAdapterResponse = {
          '99c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\n99MIICYjCCAemgAwIBA...',
            signature: 'signature'
          },
          '88c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\n88MIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + otherReceivedContract.referenceId + '/' + otherReceivedContract.fromMsp.mspId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              getSignatureFromBlockchainAdapterResponse,
              undefined
            ];
          });

        const sentBody = {
          msp: 'TMUS',
          eventName: 'STORE:SIGNATURE',
          timestamp: '2020-11-30T16:59:35Z',
          data: {
            storageKey: storageKey
          }
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end(async (error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object').that.is.empty;
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            testsDbUtils.verifyContract(otherReceivedContract.id,
              {
                'signatureLink': {
                  $all: [
                    {
                      $elemMatch: {
                        msp: 'fromMsp',
                        index: 0,
                        txId: '99c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'
                      }
                    },
                    {
                      $elemMatch: {
                        msp: 'fromMsp',
                        index: 1,
                        txId: '88c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'
                      }
                    },
                    {
                      $elemMatch: {
                        msp: 'fromMsp',
                        index: 2,
                        txId: {
                          $exists: false
                        }
                      }
                    }
                  ]
                }
              })
              .then((verifyContractResp) => {
                debug('Verified contract : ', verifyContractResp);
                done();
              })
              .catch((verifyContractError) => {
                debug('Contract verification error : ', verifyContractError);
                done(verifyContractError);
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post SIGN event OK on UNKNOWN document storageKey', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = 'unknownkey007';

        const sentBody = {
          msp: 'TMUS',
          eventName: 'STORE:SIGNATURE',
          timestamp: '2020-11-30T16:59:35Z',
          data: {
            storageKey: storageKey
          }
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end(async (error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object').that.is.empty;
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

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
