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
const route = '/contracts/event/';

describe(`Tests POST ${route} API OK`, function() {
  describe(`Setup and Test POST ${route} API with STORE:PAYLOADLINK event`, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'B1'},
      referenceId: 'duezahdioajqxzeachqxnqsjlijxazjdzajdae',
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test3', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };

    const contract2 = {
      name: 'Contract name between A1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.3.1',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'C3'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIS',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIS', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, C3: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test2', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-2'
    };

    const usageSent1 = {
      type: 'usage',
      version: '1.2.4',
      name: 'Usage data',
      contractId: undefined,
      mspOwner: 'A1',
      mspReceiver: 'B1',
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
      },
      state: 'SENT',
      referenceId: 'dizaudzaidsazxjzxkzodjxzepdoezzasza',
      blockchainRef: {type: 'hlf', txId: 'TX-OPIPOUFTDRDDZYTFGFS', timestamp: new Date().toJSON()}
    };
    const rawDataObjectFromUsageSent1 = `{
      "header": {
        "type": "${usageSent1.type}",
        "version": "${usageSent1.version}",
        "name": "${usageSent1.name}"  
      },
      "mspOwner": "${usageSent1.mspOwner}",
      "mspReceiver": "${usageSent1.mspReceiver}",
      "contractReferenceId": "${contract1.referenceId}",
      "body": ${JSON.stringify(usageSent1.body)}
    }`;
    usageSent1.rawData = Buffer.from(rawDataObjectFromUsageSent1).toString('base64');

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
          usageSent1.contractId = contract1.id;
          debugSetup('The db is initialized with 2 contracts : ', initDbWithContractsResp.map((c) => c.id));
          debugSetup('==> init db with 1 usage');
          testsDbUtils.initDbWithUsages([usageSent1])
            .then((initDbWithUsagesResp) => {
              usageSent1.id = initDbWithUsagesResp[0].id;
              debugSetup('The db is initialized with 1 usage : ', initDbWithUsagesResp.map((c) => c.id));
              debugSetup('==> init db with 0 settlement');
              testsDbUtils.initDbWithSettlements([])
                .then((initDbWithSettlementsResp) => {
                  debugSetup('==> done!');
                  done();
                })
                .catch((initDbWithSettlementsError) => {
                  debugSetup('Error initializing the db content : ', initDbWithSettlementsError);
                  debugSetup('==> failed!');
                  done(initDbWithSettlementsError);
                });
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

    it('Post event OK with minimum event details and only contracts in blockchain', function(done) {
      try {
        const path = globalVersion + route;

        const idDocument1 = 'shuzahxazhxijazechxhuezhasqxsdchezu';

        const idDocument2 = 'zecxezhucheauhxazi';
        const document2 = `{
          "header": {
            "type": "contract",
            "version": "1.8",
            "name": "StRiNg-Doc2-${Date.now().toString()}"
          },
          "body": {
            "test": "1"
          }
        }`;
        const encodedDocument2 = Buffer.from(document2).toString('base64');

        const eventMsp = 'DTAG';
        const storageKey = testsUtils.getStorageKey(idDocument2, eventMsp);

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

        blockchainAdapterNock.get(`/private-documents/${idDocument2}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument2}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `{
                "fromMSP": "${eventMsp}",
                "toMSP": "TMUS",
                "payload": "${encodedDocument2}",
                "payloadHash": "notUsed",
                "blockchainRef": {
                  "type": "hlf",
                  "txID": "b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8cc",
                  "timestamp": "2021-03-15T11:43:57Z"
                },
                "referenceID": "${idDocument2}"
              }`,
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
          msp: eventMsp,
          eventName: 'STORE:PAYLOADLINK',
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
            expect(response.body.length).to.equal(1);

            const bodyArrayContent = response.body[0];
            expect(bodyArrayContent).to.be.an('Object');
            expect(Object.keys(bodyArrayContent)).have.members(['id', 'type', 'referenceId']);
            expect(bodyArrayContent).to.have.property('id').that.is.a('string');
            expect(bodyArrayContent).to.have.property('type', 'contract');
            expect(bodyArrayContent).to.have.property('referenceId', idDocument2);

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

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

                    done();
                  });
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post event OK with minimum event details and only usages in blockchain and set partnerUsageId', function(done) {
      try {
        const path = globalVersion + route;

        const idDocument1 = 'shuzahxazhxijazechxhuezhasqxsdchezu';

        const document1 = `{
          "header": {
            "type": "usage",
            "version": "2.1",
            "name": "StRiNg-Usage1-${Date.now().toString()}"  
          },
          "mspOwner": "DAAA",
          "mspReceiver": "TMMM",
          "contractReferenceId": "${contract1.referenceId}",
          "body": {
            "usageString": "objectOrString",
            "usageData": {
              "part1": {
                "other": "objectOrString"
              }
            }
          }
        }`;
        const encodedDocument1 = Buffer.from(document1).toString('base64');

        const idDocument2 = 'zecxezhucheauhxazi';

        const document2 = `{
          "header": {
            "type": "usage",
            "version": "3.5",
            "name": "StRiNg-Usage2-${Date.now().toString()}"  
          },
          "mspOwner": "DAAA",
          "mspReceiver": "TMMM",
          "contractReferenceId": "${contract1.referenceId}",
          "body": {
            "usageString": "objectOrString-2",
            "usageData": {
              "part2": {
                "other": "objectOrString-2"
              }
            }
          }
        }`;
        const encodedDocument2 = Buffer.from(document2).toString('base64');

        const idDocument3 = usageSent1.referenceId;

        const eventMsp = 'TMUS';
        const storageKey = testsUtils.getStorageKey(idDocument1, eventMsp);

        blockchainAdapterNock.get('/private-documents')
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/private-documents');
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `["${idDocument1}", "${idDocument2}", "${idDocument3}"]`,
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
                "fromMSP": "DTAG",
                "toMSP": "TMUS",
                "payload": "${encodedDocument1}",
                "payloadHash": "notUsed",
                "blockchainRef": {
                  "type": "hlf",
                  "txID": "b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8dd",
                  "timestamp": "2021-03-15T11:43:57Z"
                },
                "referenceID": "${idDocument1}"
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

        blockchainAdapterNock.get(`/private-documents/${idDocument2}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument2}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `{
                "fromMSP": "DTAG",
                "toMSP": "TMUS",
                "payload": "${encodedDocument2}",
                "payloadHash": "notUsed",
                "blockchainRef": {
                  "type": "hlf",
                  "txID": "b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8ff",
                  "timestamp": "2021-03-15T11:43:58Z"
                },
                "referenceID": "${idDocument2}"
              }`,
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

        blockchainAdapterNock.get(`/private-documents/${idDocument3}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument3}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `{
                "fromMSP": "TMUS",
                "toMSP": "DTAG",
                "payload": "${usageSent1.rawData}",
                "payloadHash": "notUsed",
                "blockchainRef": {
                  "type": "hlf",
                  "txID": "b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8dd",
                  "timestamp": "2021-03-15T11:43:52Z"
                },
                "referenceID": "${idDocument3}"
              }`,
              undefined
            ];
          });

        blockchainAdapterNock.delete(`/private-documents/${idDocument3}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument3}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              ``,
              undefined
            ];
          });

        const sentBody = {
          msp: eventMsp,
          eventName: 'STORE:PAYLOADLINK',
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
            expect(response.body.length).to.equal(3);

            const bodyArrayContentFromDocument1 = response.body.filter((content) => (content.referenceId === idDocument1))[0];
            expect(bodyArrayContentFromDocument1).to.be.an('Object');
            expect(Object.keys(bodyArrayContentFromDocument1)).have.members(['id', 'type', 'referenceId', 'contractId']);
            expect(bodyArrayContentFromDocument1).to.have.property('id').that.is.a('string');
            expect(bodyArrayContentFromDocument1).to.have.property('type', 'usage');
            expect(bodyArrayContentFromDocument1).to.have.property('referenceId', idDocument1);
            expect(bodyArrayContentFromDocument1).to.have.property('contractId', contract1.id);

            const bodyArrayContentFromDocument2 = response.body.filter((content) => (content.referenceId === idDocument2))[0];
            expect(bodyArrayContentFromDocument2).to.be.an('Object');
            expect(Object.keys(bodyArrayContentFromDocument2)).have.members(['id', 'type', 'referenceId', 'contractId']);
            expect(bodyArrayContentFromDocument2).to.have.property('id').that.is.a('string');
            expect(bodyArrayContentFromDocument2).to.have.property('type', 'usage');
            expect(bodyArrayContentFromDocument2).to.have.property('referenceId', idDocument2);
            expect(bodyArrayContentFromDocument2).to.have.property('contractId', contract1.id);

            const bodyArrayContentFromDocument3 = response.body.filter((content) => (content.referenceId === idDocument3))[0];
            expect(bodyArrayContentFromDocument3).to.be.an('Object');
            expect(Object.keys(bodyArrayContentFromDocument3)).have.members(['id', 'type', 'referenceId', 'contractId']);
            expect(bodyArrayContentFromDocument3).to.have.property('id').that.is.a('string');
            expect(bodyArrayContentFromDocument3).to.have.property('type', 'usage');
            expect(bodyArrayContentFromDocument3).to.have.property('referenceId', idDocument3);
            expect(bodyArrayContentFromDocument3).to.have.property('contractId', contract1.id);

            // this array should be ordered
            expect(response.body[0].referenceId).to.equals(idDocument3);
            expect(response.body[1].referenceId).to.equals(idDocument1);
            expect(response.body[2].referenceId).to.equals(idDocument2);

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            chai.request(testsUtils.getServer())
              .get(`${globalVersion}/contracts/${bodyArrayContentFromDocument1.contractId}/usages/${bodyArrayContentFromDocument1.id}`)
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
                  .get(`${globalVersion}/contracts/${bodyArrayContentFromDocument2.contractId}/usages/${bodyArrayContentFromDocument2.id}`)
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
                      .get(`${globalVersion}/contracts/${bodyArrayContentFromDocument3.contractId}/usages/${bodyArrayContentFromDocument3.id}`)
                      .send()
                      .end((getError3, getResponse3) => {
                        debug('response.body: %s', JSON.stringify(getResponse3.body));
                        expect(getError3).to.be.null;
                        expect(getResponse3).to.have.status(200);
                        expect(getResponse3).to.be.json;
                        expect(getResponse3.body).to.exist;
                        expect(getResponse3.body).to.be.an('object');
                        expect(getResponse3.body).to.have.property('state', 'SENT');
                        expect(getResponse3.body).to.have.property('partnerUsageId', bodyArrayContentFromDocument2.id);

                        done();
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

    it('Post event OK with minimum event details and only settlements in blockchain', function(done) {
      try {
        const path = globalVersion + route;

        const idDocument1 = 'shuzahxazhxijazechxhuezhasqxsdchezu';
        const document1 = `{
          "header": {
            "type": "settlement",
            "version": "2.1",
            "name": "StRiNg-Settlement1-${Date.now().toString()}"  
          },
          "mspOwner": "DAAA",
          "mspReceiver": "TMMM",
          "contractReferenceId": "${contract1.referenceId}",
          "body": {
            "generatedResult": "objectOrString",
            "usage": {
              "name": "usageName1",
              "version": "usageVersion1",
              "state": "usageState1",
              "mspOwner": "DAAA",
              "mspReceiver": "TMMM",
              "body": {
                "other": "objectOrString"
              }
            }
          }
        }`;
        const encodedDocument1 = Buffer.from(document1).toString('base64');

        const idDocument2 = 'zecxezhucheauhxazi';

        const eventMsp = 'TMUS';
        const storageKey = testsUtils.getStorageKey(idDocument1, eventMsp);

        blockchainAdapterNock.get('/private-documents')
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            debug('bodyReceived = ', bodyReceived);
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
                "fromMSP": "DTAG",
                "toMSP": "TMUS",
                "payload": "${encodedDocument1}",
                "payloadHash": "notUsed",
                "blockchainRef": {
                  "type": "hlf",
                  "txID": "b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb",
                  "timestamp": "2021-03-15T11:43:56Z"
                },
                "referenceID": "${idDocument1}"
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

        const sentBody = {
          msp: eventMsp,
          eventName: 'STORE:PAYLOADLINK',
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
            expect(response.body.length).to.equal(1);

            const bodyArrayContent = response.body[0];
            expect(bodyArrayContent).to.be.an('Object');
            expect(Object.keys(bodyArrayContent)).have.members(['id', 'type', 'referenceId', 'contractId']);
            expect(bodyArrayContent).to.have.property('id').that.is.a('string');
            expect(bodyArrayContent).to.have.property('type', 'settlement');
            expect(bodyArrayContent).to.have.property('referenceId', idDocument1);
            expect(bodyArrayContent).to.have.property('contractId', contract1.id);

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            chai.request(testsUtils.getServer())
              .get(`${globalVersion}/contracts/${response.body[0].contractId}/settlements/`)
              .send()
              .end((getError1, getResponse1) => {
                debug('response.body: %s', JSON.stringify(getResponse1.body));
                expect(getError1).to.be.null;
                expect(getResponse1).to.have.status(200);
                expect(getResponse1).to.be.json;
                expect(getResponse1.body).to.exist;
                expect(getResponse1.body).to.be.an('array');

                getResponse1.body.forEach((currentSettlement) => {
                  if (currentSettlement.id === response.body[0].id) {
                    expect(currentSettlement).to.have.property('state', 'RECEIVED');
                  }
                });

                done();
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
    /* eslint-disable max-len */
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
      blockchainRef: {type: 'hlf', txId: 'TX-d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5', timestamp: new Date().toJSON()},
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
      blockchainRef: {type: 'hlf', txId: 'TX-d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5', timestamp: new Date().toJSON()},
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
      blockchainRef: {type: 'hlf', txId: 'TX-d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5', timestamp: new Date().toJSON()},
      storageKeys: [
        '99756b1cecacb073fa4808f5a754515e033f6b1b3247153d65b6510ae4c9bb49',
        '007unused'
      ],
      rawData: '99J0eXBlIjoiY29udHJhY3QiLCJ2ZXJzaW9uIjoiMS4xLjAiLCJuYW1lIjoiQ29udHJhY3QgbmFtZSBiZXR3ZWVuIE1TUDEgYW5kIE1TUDIiLCJmcm9tTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkExIn0sInRvTXNwIjp7InNpZ25hdHVyZXMiOlt7InJvbGUiOiJyb2xlIiwibmFtZSI6Im5hbWUiLCJpZCI6ImlkIn1dLCJtc3BJZCI6IkIxIn0sImJvZHkiOnsiYmFua0RldGFpbHMiOnsiQTEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfSwiQjEiOnsiaWJhbiI6bnVsbCwiYmFua05hbWUiOm51bGwsImN1cnJlbmN5IjpudWxsfX0sImRpc2NvdW50TW9kZWxzIjoic29tZURhdGEiLCJnZW5lcmFsSW5mb3JtYXRpb24iOnsibmFtZSI6InRlc3QxIiwidHlwZSI6Ik5vcm1hbCIsImVuZERhdGUiOiIyMDIxLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJzdGFydERhdGUiOiIyMDIwLTEyLTAxVDAwOjAwOjAwLjAwMFoifX19'
    };
    /* eslint-enable max-len */

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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            // for SENt contract, nothing should be done
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
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

  describe(`Setup and Test POST ${route} API with STORE:SIGNATURE event when usages are signed`, function() {
    /* eslint-disable max-len */
    const sentContract = {
      name: 'Contract sent between TMUS and DTAG',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'TMUS', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'DTAG', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      body: {
        bankDetails: {TMUS: {iban: null, bankName: null, currency: null}, DTAG: {iban: null, bankName: null, currency: null}},
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
      mspOwner: 'TMUS',
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
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
    };
    const usageReceived = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - received',
      contractId: undefined,
      mspOwner: 'DTAG',
      mspReceiver: 'TMUS',
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
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0, txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'}
      ],
    };
    const usageSentNotSigned = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - sent - not signed',
      contractId: undefined,
      mspOwner: 'TMUS',
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
      storageKeys: ['notsignedb70af48b18681d2b51c77c7ed3bf63217caafc91a593d5d1b4f9bbb1c93c2273'],
      signatureLink: [
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
      ],
    };
    const usageReceivedSignedBySender = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - received signed by sender',
      contractId: undefined,
      mspOwner: 'DTAG',
      mspReceiver: 'TMUS',
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
      storageKeys: ['bbb573ba6643181fb8487dcc14f26587e3c2d54a2271aff4965785ca7a70d52c579', 'aadaef3e3d0756b69ff352a82ae52c8a025f208bfafd946b09fff43c7b89c4b1'],
      signatureLink: [
        {id: '5fd8d6070cc5feb0fc0cb9e433ff', msp: 'fromMsp', index: 0, txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'},
        {id: '5fd8d6070cc5feb0fc0cb9e5d45f', msp: 'toMsp', index: 0}
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
          usageSentNotSigned.contractId = sentContract.id;
          usageReceivedSignedBySender.contractId = sentContract.id;
          debugSetup('==> init db with 3 usages');

          testsDbUtils.initDbWithUsages([usageSent, usageReceived, usageSentNotSigned, usageReceivedSignedBySender])
            .then((initDbWithUsagesResp) => {
              debugSetup('3 usages documents linked to contract ', initDbWithUsagesResp);
              usageSent.id = initDbWithUsagesResp[0].id;
              usageReceived.id = initDbWithUsagesResp[1].id;
              usageSentNotSigned.id = initDbWithUsagesResp[2].id;
              usageReceivedSignedBySender.id = initDbWithUsagesResp[3].id;
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

    it('Post SIGN event OK on SENT document that we signed', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = 'b70af48b18681d2b51c77c7ed3bf63217caafc91a593d5d1b4f9bbb1c93c2273';

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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post SIGN event OK on SENT document that we did not sign', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = 'notsignedb70af48b18681d2b51c77c7ed3bf63217caafc91a593d5d1b4f9bbb1c93c2273';

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + usageSentNotSigned.referenceId + '/' + usageSentNotSigned.mspOwner)
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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            // expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post SIGN event OK on RECEIVED usage not signed', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = '573ba6643181fb8487dcc14f26587e3c2d54a2271aff4965785ca7a70d52c579';

        const getSignatureFromBlockchainAdapterResponse = {
          'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + usageReceived.referenceId + '/' + usageReceived.mspOwner)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            return [
              200,
              getSignatureFromBlockchainAdapterResponse,
              undefined
            ];
          });

        const sentBody = {
          msp: 'DTAG',
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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            // testsDbUtils.verifyContract(receivedContract.id,
            //   {
            //     'signatureLink': {
            //       $elemMatch: {
            //         msp: 'fromMsp',
            //         index: 0,
            //         txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'
            //       }
            //     }
            //   })
            //   .then((verifyContractResp) => {
            //     debug('Verified contract : ', verifyContractResp);
            //     done();
            //   })
            //   .catch((verifyContractError) => {
            //     debug('Contract verification error : ', verifyContractError);
            //     done(verifyContractError);
            //   });

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Post SIGN event OK on RECEIVED usage signed by sender', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = 'bbb573ba6643181fb8487dcc14f26587e3c2d54a2271aff4965785ca7a70d52c579';

        const getSignatureFromBlockchainAdapterResponse = {
          'af6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7': {
            algorithm: 'secp384r1',
            certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA...',
            signature: 'signature'
          }
        };
        blockchainAdapterNock.get('/signatures/' + usageReceivedSignedBySender.referenceId + '/' + usageReceivedSignedBySender.mspReceiver)
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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            // testsDbUtils.verifyContract(receivedContract.id,
            //   {
            //     'signatureLink': {
            //       $elemMatch: {
            //         msp: 'fromMsp',
            //         index: 0,
            //         txId: 'f6c847b990945996a6c13e21713d76c982ef79779c43c8f9183cb30c3822e3d7'
            //       }
            //     }
            //   })
            //   .then((verifyContractResp) => {
            //     debug('Verified contract : ', verifyContractResp);
            //     done();
            //   })
            //   .catch((verifyContractError) => {
            //     debug('Contract verification error : ', verifyContractError);
            //     done(verifyContractError);
            //   });

            done();
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
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(0);
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
