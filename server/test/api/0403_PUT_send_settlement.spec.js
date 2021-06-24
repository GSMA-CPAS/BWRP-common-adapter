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
const route = '/contracts/{contractId}/settlements/{settlementId}/send';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API`, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: testsUtils.getSelfMspId()},
      toMsp: {mspId: 'B1'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contract2 = {
      name: 'Contract name between B1 and C1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: testsUtils.getSelfMspId()},
      toMsp: {mspId: 'C1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const settlement1 = {
      type: 'settlement',
      version: '1.1.0',
      name: 'Settlement data',
      contractId: undefined,
      contractReferenceId: 'pdzaodzapdiozpadi',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          fromDate: 202001,
          toDate: 202012,
          calculationEngineVersion: '0.0.1',
          inbound: {
            tax: {rate: ''},
            currency: 'EUR',
            services: {
              voice: {
                MOC: {
                  local: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  backHome: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  international: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  premium: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  ROW: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EU: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EEA: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  satellite: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  videoTelephony: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  specialDestinations: {dealValue: 0, shortOfCommitment: 0, usage: 0}
                },
                MTC: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              SMS: {
                MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              data: [
                {name: 'GPRS', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'M2M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'NB-IOT', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'LTE-M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'VoLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'ViLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'signalling', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
              ],
              access: {networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
            }
          },
          outbound: {
            tax: {rate: ''},
            currency: 'EUR',
            services: {
              voice: {
                MOC: {
                  local: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  backHome: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  international: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  premium: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  ROW: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EU: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EEA: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  satellite: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  videoTelephony: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  specialDestinations: {dealValue: 0, shortOfCommitment: 0, usage: 0}
                },
                MTC: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              SMS: {
                MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              data: [
                {name: 'GPRS', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'M2M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'NB-IOT', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'LTE-M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'VoLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'ViLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'signalling', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
              ],
              access: {networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
            }
          },
          unexpectedServiceNames: []
        },
        usage: {
          name: 'usageName1',
          version: 'usageVersion1',
          state: 'usageState1',
          mspOwner: undefined,
          body: {
            bodyContent1: 'minutes',
            bodyContent2: {
              param1: 'value1',
              param2: 'value2'
            }
          },
        },
        data: [],
        otherData: 'otherDataContent'
      },
      state: 'DRAFT'
    };
    const settlement2 = {
      type: 'settlement',
      version: '1.2.0',
      name: 'Settlement data',
      contractId: undefined,
      contractReferenceId: 'xiazxzaosxoazpslazopdkxzepckeozdczelxpze',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          fromDate: 202001,
          toDate: 202012,
          calculationEngineVersion: '0.0.1',
          inbound: {
            tax: {rate: ''},
            currency: 'EUR',
            services: {
              voice: {
                MOC: {
                  local: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  backHome: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  international: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  premium: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  ROW: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EU: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EEA: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  satellite: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  videoTelephony: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  specialDestinations: {dealValue: 0, shortOfCommitment: 0, usage: 0}
                },
                MTC: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              SMS: {
                MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              data: [
                {name: 'GPRS', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'M2M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'NB-IOT', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'LTE-M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'VoLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'ViLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'signalling', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
              ],
              access: {networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
            }
          },
          outbound: {
            tax: {rate: ''},
            currency: 'EUR',
            services: {
              voice: {
                MOC: {
                  local: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  backHome: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  international: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  premium: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  ROW: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EU: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EEA: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  satellite: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  videoTelephony: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  specialDestinations: {dealValue: 0, shortOfCommitment: 0, usage: 0}
                },
                MTC: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              SMS: {
                MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              data: [
                {name: 'GPRS', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'M2M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'NB-IOT', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'LTE-M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'VoLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'ViLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'signalling', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
              ],
              access: {networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
            }
          },
          unexpectedServiceNames: []
        },
        usage: {
          name: 'usageName1',
          version: 'usageVersion1',
          state: 'usageState1',
          mspOwner: undefined,
          body: {
            other: 'objectOrString',
          },
        }
      },
      state: 'SENT'
    };
    const settlementWithOtherMspOwner = {
      type: 'settlement',
      version: '3.4.0',
      name: 'Settlement data',
      contractId: undefined,
      contractReferenceId: 'xiazxzaosxoazpslazopdkxzepckeozdczelxpze',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          fromDate: 202001,
          toDate: 202012,
          calculationEngineVersion: '0.0.1',
          inbound: {
            tax: {rate: ''},
            currency: 'EUR',
            services: {
              voice: {
                MOC: {
                  local: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  backHome: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  international: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  premium: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  ROW: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EU: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EEA: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  satellite: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  videoTelephony: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  specialDestinations: {dealValue: 0, shortOfCommitment: 0, usage: 0}
                },
                MTC: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              SMS: {
                MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              data: [
                {name: 'GPRS', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'M2M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'NB-IOT', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'LTE-M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'VoLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'ViLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'signalling', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
              ],
              access: {networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
            }
          },
          outbound: {
            tax: {rate: ''},
            currency: 'EUR',
            services: {
              voice: {
                MOC: {
                  local: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  backHome: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  international: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  premium: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  ROW: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EU: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  EEA: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  satellite: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  videoTelephony: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                  specialDestinations: {dealValue: 0, shortOfCommitment: 0, usage: 0}
                },
                MTC: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              SMS: {
                MO: {dealValue: 0, shortOfCommitment: 0, usage: 0},
                MT: {dealValue: 0, shortOfCommitment: 0, usage: 0}
              },
              data: [
                {name: 'GPRS', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'M2M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'NB-IOT', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'LTE-M', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'VoLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'ViLTE', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}},
                {name: 'signalling', value: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
              ],
              access: {networkAccess: {dealValue: 0, shortOfCommitment: 0, usage: 0}}
            }
          },
          unexpectedServiceNames: []
        },
        usage: {
          name: 'usageNameAA',
          version: 'usageVersionAA',
          state: 'usageStateAA',
          mspOwner: undefined,
          body: {
            other: 'objectOrString',
          },
        }
      },
      state: 'DRAFT'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          debugSetup('Two contracts in db ', initDbWithContractsResp);
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
          settlement1.contractId = contract1.id;
          settlement1.mspOwner = contract1.fromMsp.mspId;
          settlement1.mspReceiver = contract1.toMsp.mspId;
          settlement1.body.usage.mspOwner = contract1.fromMsp.mspId;
          settlement2.contractId = contract2.id;
          settlement2.mspOwner = contract2.fromMsp.mspId;
          settlement2.mspReceiver = contract2.toMsp.mspId;
          settlement2.body.usage.mspOwner = contract2.fromMsp.mspId;
          settlementWithOtherMspOwner.contractId = contract2.id;
          settlementWithOtherMspOwner.mspOwner = contract2.toMsp.mspId;
          settlementWithOtherMspOwner.mspReceiver = contract2.fromMsp.mspId;
          settlementWithOtherMspOwner.body.usage.mspOwner = contract2.toMsp.mspId;
          debugSetup('==> init db with 3 settlements');
          testsDbUtils.initDbWithSettlements([settlement1, settlement2, settlementWithOtherMspOwner])
            .then((initDbWithSettlementsResp) => {
              debugSetup('First settlement document linked to contract ', initDbWithSettlementsResp[0].contractId);
              debugSetup('Second settlement document linked to contract ', initDbWithSettlementsResp[1].contractId);
              debugSetup('Third settlement document linked to contract ', initDbWithSettlementsResp[2].contractId);
              settlement1.id = initDbWithSettlementsResp[0].id;
              settlement2.id = initDbWithSettlementsResp[1].id;
              settlementWithOtherMspOwner.id = initDbWithSettlementsResp[2].id;
              debugSetup('==> done!');
              done();
            })
            .catch((initDbWithSettlementsError) => {
              debugSetup('Error initializing the db content : ', initDbWithSettlementsError);
              debugSetup('==> failed!');
              done(initDbWithSettlementsError);
            });
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('Put send settlement OK', function(done) {
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
        const path = globalVersion + '/contracts/' + settlement1.contractId + '/settlements/' + settlement1.id + '/send/';
        debug('path : ', path);

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
            expect(Object.keys(response.body)).have.members(['settlementId', 'contractId', 'mspOwner', 'state', 'referenceId', 'blockchainRef', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('settlementId', settlement1.id);
            expect(response.body).to.have.property('contractId', settlement1.contractId);
            expect(response.body).to.have.property('state', 'SENT');
            expect(response.body).to.have.property('mspOwner', settlement1.mspOwner);
            expect(response.body).to.have.property('referenceId').that.is.a('string');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version']);
            expect(response.body.header).to.have.property('name', settlement1.name);
            expect(response.body.header).to.have.property('type', settlement1.type);
            expect(response.body.header).to.have.property('version', settlement1.version);

            expect(response.body).to.have.property('blockchainRef').that.is.an('object');
            expect(Object.keys(response.body.blockchainRef)).have.members(['type', 'txId', 'timestamp']);
            expect(response.body.blockchainRef).to.have.property('type', 'hlf');
            expect(response.body.blockchainRef).to.have.property('txId', 'b70cef323c0d3b56d44e9b31f16a11cba8dbbdd55c1d255b65f3fd2b3eadf8bb');
            expect(response.body.blockchainRef).to.have.property('timestamp').that.is.a('string');

            // remove generatedResult field and set this generatedResult in body
            expect(response.body).to.have.property('body').that.is.an('object');
            expect(response.body.body).to.deep.include(settlement1.body.generatedResult);

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send settlement NOK if status is SENT', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlement2.contractId + '/settlements/' + settlement2.id + '/send/';
        debug('path : ', path);

        const sentBody = {};

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
            expect(response.body.message).to.equal('Send settlement not allowed');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put send settlement NOK if settlement mspOwner is not me', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlementWithOtherMspOwner.contractId + '/settlements/' + settlementWithOtherMspOwner.id + '/send/';
        debug('path : ', path);

        const sentBody = {};

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
            expect(response.body.message).to.equal('Send settlement not allowed');

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
