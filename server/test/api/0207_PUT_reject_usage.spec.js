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
const route = '/contracts/{contractId}/usages/{usageId}/reject';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API with minimum contract details`, function() {
    const discountsOnContractSent = {
      'HOME': {
        serviceGroups: [
          {
            homeTadigs: ['HOR1'],
            visitorTadigs: ['HOR2'],
            services: [
              {
                service: 'SMSMO',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, linearPrice: 5}, {start: 1500, linearPrice: 3}]}}}
              },
              {
                service: 'MOC',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, fixedPrice: 1500}]}}}
              }
            ]
          }
        ]
      },
      'VISITOR': {
        serviceGroups: [
          {
            homeTadigs: ['HOR2'],
            visitorTadigs: ['HOR1'],
            services: [
              {
                service: 'SMSMO',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, fixedPrice: 5000}]}}}
              },
              {
                service: 'MOC',
                usagePricing: {ratingPlan: {rate: {thresholds: [{start: 0, fixedPrice: 3000}]}}}
              }
            ]
          }
        ]
      }
    };

    const contractSent = {
      name: 'Contract name between B1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: 'C1'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        discounts: discountsOnContractSent,
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const usageMinimumData = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: []
      },
      state: 'DRAFT'
    };
    const usageSentData1 = {
      type: 'usage',
      version: '4.3.2',
      name: 'Usage data sent',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        inbound: [
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'SMS MO',
            usage: 5208.2115,
            units: 'SMS',
            charges: 104.16423,
            taxes: 0,
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'MOC Back Home',
            usage: 2149.896,
            units: 'min',
            charges: 322.4844,
            taxes: 0,
            currency: 'EUR'
          }
        ],
        outbound: [
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'SMS MO',
            usage: 21530.517,
            units: 'SMS',
            charges: 430.61034,
            taxes: 0,
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'GPRS',
            usage: 14696.6175,
            units: 'MB',
            charges: 4408.98525,
            taxes: 0,
            currency: 'EUR'
          }
        ]
      },
      state: 'SENT',
      referenceId: 'OPIPOUFTDRDDFCFYU',
      blockchainRef: {type: 'hlf', txId: 'TX-OPIPOUFTDRDDFCFYU', timestamp: new Date().toJSON()},
      rawData: 'Usg_raw-data-1'
    };
    const usageSentData2 = {
      type: 'usage',
      version: '4.3.2',
      name: 'Usage data sent - 2',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        inbound: [
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'SMS MO',
            usage: 5208.2115,
            units: 'SMS',
            charges: 104.16423,
            taxes: 0,
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'MOC Back Home',
            usage: 2149.896,
            units: 'min',
            charges: 322.4844,
            taxes: 0,
            currency: 'EUR'
          }
        ],
        outbound: [
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'SMS MO',
            usage: 21530.517,
            units: 'SMS',
            charges: 430.61034,
            taxes: 0,
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'GPRS',
            usage: 14696.6175,
            units: 'MB',
            charges: 4408.98525,
            taxes: 0,
            currency: 'EUR'
          }
        ]
      },
      state: 'SENT',
      referenceId: 'OPIPOUFTDRDDFCFYU',
      blockchainRef: {type: 'hlf', txId: 'TX-OPIPOUFTDRDDFCFYU', timestamp: new Date().toJSON()},
      rawData: 'Usg_raw-data-2'
    };
    const usageSentDataWithAlreadyExistingSettlementId = {
      type: 'usage',
      version: '4.3.2',
      name: 'Usage data sent',
      contractId: undefined,
      settlementId: 'one-value-of-settlement-id',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: []
      },
      state: 'SENT',
      referenceId: 'OPIPOUFTDRDDFCFYU',
      blockchainRef: {type: 'hlf', txId: 'TX-OPIPOUFTDRDDFCFYU', timestamp: new Date().toJSON()},
      rawData: 'Usg_raw-data-1'
    };
    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([contractSent])
        .then((initDbWithContractsResp) => {
          debugSetup('One contract was added in db ', initDbWithContractsResp);
          contractSent.id = initDbWithContractsResp[0].id;
          usageMinimumData.contractId = contractSent.id;
          usageMinimumData.mspOwner = contractSent.fromMsp.mspId;
          usageMinimumData.mspReceiver = contractSent.toMsp.mspId;
          usageSentData1.contractId = contractSent.id;
          usageSentData1.mspOwner = contractSent.fromMsp.mspId;
          usageSentData1.mspReceiver = contractSent.toMsp.mspId;
          usageSentData2.contractId = contractSent.id;
          usageSentData2.mspOwner = contractSent.fromMsp.mspId;
          usageSentData2.mspReceiver = contractSent.toMsp.mspId;
          usageSentDataWithAlreadyExistingSettlementId.contractId = contractSent.id;
          usageSentDataWithAlreadyExistingSettlementId.mspOwner = contractSent.fromMsp.mspId;
          usageSentDataWithAlreadyExistingSettlementId.mspReceiver = contractSent.toMsp.mspId;
          debugSetup('==> init db with 4 usages');
          testsDbUtils.initDbWithUsages([usageMinimumData, usageSentData1, usageSentData2, usageSentDataWithAlreadyExistingSettlementId])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 4 usages : ', initDbWithUsagesResp.map((c) => c.id));
              debugSetup('==> init db with 0 settlement');
              testsDbUtils.initDbWithSettlements([])
                .then((initDbWithSettlementsResp) => {
                  debugSetup('The db is initialized with 0 settlement : ', initDbWithSettlementsResp.map((c) => c.id));
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

    it('Put reject usage OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageMinimumData.id + '/reject/';
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
            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'body', 'mspOwner', 'state', 'creationDate', 'lastModificationDate', 'tag']);

            expect(response.body).to.have.property('contractId', contractSent.id);
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('tag', 'REJECTED');
            expect(response.body).to.have.property('mspOwner', usageMinimumData.mspOwner);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('type', 'usage');
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
