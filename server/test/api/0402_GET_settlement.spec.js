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

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/settlements/{settlementId}';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API`, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1'},
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
      state: 'SIGNED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
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
                MOC: {local: 0, backHome: 0, international: 0, premium: 0, ROW: 0, EU: 0, EEA: 0, satellite: 0, videoTelephony: 0, specialDestinations: 0},
                MTC: 0
              },
              SMS: {MO: 0, MT: 0},
              data: [
                {name: 'GPRS', value: 0},
                {name: 'M2M', value: 0},
                {name: 'NB-IOT', value: 0},
                {name: 'LTE-M', value: 0},
                {name: 'VoLTE', value: 0},
                {name: 'ViLTE', value: 0},
                {name: 'signalling', value: 0}
              ],
              access: {networkAccess: 0}
            }
          },
          outbound: {
            tax: {rate: ''},
            currency: 'EUR',
            services: {
              voice: {
                MOC: {local: 0, backHome: 0, international: 0, premium: 0, ROW: 0, EU: 0, EEA: 0, satellite: 0, videoTelephony: 0, specialDestinations: 0},
                MTC: 0
              },
              SMS: {MO: 0, MT: 0},
              data: [
                {name: 'GPRS', value: 0},
                {name: 'M2M', value: 0},
                {name: 'NB-IOT', value: 0},
                {name: 'LTE-M', value: 0},
                {name: 'VoLTE', value: 0},
                {name: 'ViLTE', value: 0},
                {name: 'signalling', value: 0}
              ],
              access: {networkAccess: 0}
            }
          },
          unexpectedServiceNames: []
        },
        data: []
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
          debugSetup('==> init db with 1 settlement');
          testsDbUtils.initDbWithSettlements([settlement1])
            .then((initDbWithSettlementsResp) => {
              debugSetup('One settlement document linked to contract ', initDbWithSettlementsResp[0].contractId);
              settlement1.id = initDbWithSettlementsResp[0].id;
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

    it('GET settlement OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/settlements/' + settlement1.id;
        debug('GET path : ', path);

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
            expect(Object.keys(response.body)).have.members(['settlementId', 'contractId', 'header', 'mspOwner', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('settlementId', settlement1.id);
            expect(response.body).to.have.property('state', settlement1.state);
            expect(response.body).to.have.property('mspOwner', settlement1.mspOwner);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(response.body.header).to.have.property('name', settlement1.name);
            expect(response.body.header).to.have.property('type', settlement1.type);
            expect(response.body.header).to.have.property('version', settlement1.version);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['fromDate', 'toDate', 'calculationEngineVersion', 'inbound', 'outbound', 'unexpectedServiceNames']);

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
