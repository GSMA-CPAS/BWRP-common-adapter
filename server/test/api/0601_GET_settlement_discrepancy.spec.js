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
const route = '/contracts/{contractId}/settlements/{settlementId}/discrepancy';

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
      state: 'DRAFT',
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
      contractReferenceId: 'pdzaodzapdiozpadi',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          fromDate: 202001,
          toDate: 202012,
          calculationEngineVersion: '0.0.0.4',
          inbound: {
            tax: {rate: ''},
            currency: 'EURO',
            services: {
              voice: {
                MOC: {
                  local: 10234,
                  backHome: 6780,
                  international: 0,
                  premium: 0,
                  ROW: 0,
                  EU: 0,
                  EEA: 0,
                  satellite: 0,
                  videoTelephony: 0,
                  specialDestinations: 0
                },
                MTC: 0
              },
              SMS: {
                MO: 5000,
                MT: 0
              },
              data: [
                {name: 'GPRS', value: 951},
                {name: 'M2M', value: 0},
                {name: 'NB-IOT', value: 0},
                {name: 'LTE-M', value: 0},
                {name: 'VoLTE', value: 0},
                {name: 'ViLTE', value: 0},
                {name: 'signalling', value: 0}
              ],
              access: {
                networkAccess: 0
              }
            }
          },
          outbound: {
            tax: {rate: ''},
            currency: 'EURO',
            services: {
              voice: {
                MOC: {
                  local: 9456,
                  backHome: 1289,
                  international: 0,
                  premium: 0,
                  ROW: 0,
                  EU: 0,
                  EEA: 0,
                  satellite: 0,
                  videoTelephony: 0,
                  specialDestinations: 0
                },
                MTC: 0
              },
              SMS: {
                MO: 5000,
                MT: 0
              },
              data: [
                {name: 'GPRS', value: 0},
                {name: 'M2M', value: 0},
                {name: 'NB-IOT', value: 0},
                {name: 'LTE-M', value: 0},
                {name: 'VoLTE', value: 389},
                {name: 'ViLTE', value: 0},
                {name: 'signalling', value: 0}
              ],
              access: {
                networkAccess: 0
              }
            }
          },
          unexpectedServiceNames: ['MOC', 'VOLTE', 'MOCEU', 'MOC', 'VOLTE', 'MOCEU']
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
    const settlementDraftFromUsageReceived1 = {
      type: 'settlement',
      version: '1.1.1',
      name: 'Settlement data draft from usage received',
      contractId: undefined,
      contractReferenceId: 'pdzaodzapdiozpadi',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          fromDate: 202001,
          toDate: 202012,
          calculationEngineVersion: '0.0.0.4',
          inbound: {
            tax: {rate: ''},
            currency: 'EURO',
            services: {
              voice: {
                MOC: {
                  local: 9336,
                  backHome: 2389,
                  international: 0,
                  premium: 0,
                  ROW: 0,
                  EU: 0,
                  EEA: 134,
                  satellite: 0,
                  videoTelephony: 0,
                  specialDestinations: 0
                },
                MTC: 0
              },
              SMS: {
                MO: 5040,
                MT: 0
              },
              data: [
                {name: 'GPRS', value: 0},
                {name: 'M2M', value: 0},
                {name: 'NB-IOT', value: 0},
                {name: 'LTE-M', value: 0},
                {name: 'VoLTE', value: 189},
                {name: 'ViLTE', value: 0},
                {name: 'signalling', value: 0}
              ],
              access: {
                networkAccess: 0
              }
            }
          },
          outbound: {
            tax: {rate: ''},
            currency: 'EURO',
            services: {
              voice: {
                MOC: {
                  local: 10238,
                  backHome: 6980,
                  international: 0,
                  premium: 0,
                  ROW: 0,
                  EU: 0,
                  EEA: 0,
                  satellite: 234,
                  videoTelephony: 0,
                  specialDestinations: 0
                },
                MTC: 0
              },
              SMS: {
                MO: 5200,
                MT: 0
              },
              data: [
                {name: 'GPRS', value: 972},
                {name: 'M2M', value: 0},
                {name: 'NB-IOT', value: 23},
                {name: 'LTE-M', value: 0},
                {name: 'VoLTE', value: 0},
                {name: 'ViLTE', value: 0},
                {name: 'signalling', value: 0}
              ],
              access: {
                networkAccess: 0
              }
            }
          },
          unexpectedServiceNames: ['MOC', 'VOLTE', 'MOCEU', 'MOC', 'VOLTE', 'MOCEU']
        },
        usage: {
          name: 'usageName-2-EmbeddedInSettlement',
          version: '2.2.2',
          state: 'RECEIVED',
          mspOwner: undefined,
          body: {
            aaaaaa: 'minutes',
            bbbbbb: {
              cccccc: 'value1',
              dddddd: 'value2'
            }
          },
        },
        data: [],
        otherData: 'otherDataContent'
      },
      state: 'DRAFT'
    };
    const settlementReceived1 = {
      type: 'settlement',
      version: '1.1.2',
      name: 'Settlement data received',
      contractId: undefined,
      contractReferenceId: 'pdzaodzapdiozpadi',
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        generatedResult: {
          fromDate: 202001,
          toDate: 202012,
          calculationEngineVersion: '0.0.0.4',
          inbound: {
            tax: {rate: ''},
            currency: 'EURO',
          },
          outbound: {
            tax: {rate: ''},
            currency: 'EURO',
          }
        },
        usage: {
          name: 'usageName-3-EmbeddedInSettlement',
          version: '3.3.3',
          state: 'RECEIVED',
          mspOwner: undefined,
          body: {
            zzzz: 'hours',
            yyyy: {
              wwww: 'value1',
              vvvv: 'value2'
            }
          },
        },
        data: [],
        otherData: 'otherDataContent'
      },
      state: 'RECEIVED'
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
        generatedResult: 'objectOrString',
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
          settlementDraftFromUsageReceived1.contractId = contract1.id;
          settlementDraftFromUsageReceived1.mspOwner = contract1.toMsp.mspId;
          settlementDraftFromUsageReceived1.mspReceiver = contract1.fromMsp.mspId;
          settlementDraftFromUsageReceived1.body.usage.mspOwner = contract1.toMsp.mspId;
          settlementReceived1.contractId = contract1.id;
          settlementReceived1.mspOwner = contract1.toMsp.mspId;
          settlementReceived1.mspReceiver = contract1.fromMsp.mspId;
          settlementReceived1.body.usage.mspOwner = contract1.toMsp.mspId;
          settlement2.contractId = contract2.id;
          settlement2.mspOwner = contract2.fromMsp.mspId;
          settlement2.mspReceiver = contract2.toMsp.mspId;
          settlement2.body.usage.mspOwner = contract2.fromMsp.mspId;
          debugSetup('==> init db with 0 usages');
          testsDbUtils.initDbWithUsages([])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 0 usages : ', initDbWithUsagesResp.map((c) => c.id));
              debugSetup('==> init db with 4 settlements');
              testsDbUtils.initDbWithSettlements([settlement1, settlement2, settlementDraftFromUsageReceived1, settlementReceived1])
                .then((initDbWithSettlementsResp) => {
                  debugSetup('First settlement document linked to contract ', initDbWithSettlementsResp[0].contractId);
                  debugSetup('Second settlement document linked to contract ', initDbWithSettlementsResp[1].contractId);
                  settlement1.id = initDbWithSettlementsResp[0].id;
                  settlement2.id = initDbWithSettlementsResp[1].id;
                  settlementDraftFromUsageReceived1.id = initDbWithSettlementsResp[2].id;
                  settlementReceived1.id = initDbWithSettlementsResp[3].id;
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

    it('Get settlement discrepancy OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlement1.contractId + '/settlements/' + settlement1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerSettlementId=${settlementDraftFromUsageReceived1.id}`)
          .send()
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['homePerspective', 'partnerPerspective']);

            /* eslint-disable quotes */
            expect(response.body.homePerspective).to.have.property('general_information').that.is.an('array').that.deep.equals([
              {
                "bearer": "Voice",
                "unit": "min",
                "own_calculation": 17014,
                "partner_calculation": 17452,
                "delta_calculation_percent": 2.57
              },
              {
                "bearer": "SMS",
                "unit": "#",
                "own_calculation": 5000,
                "partner_calculation": 5200,
                "delta_calculation_percent": 4
              },
              {
                "bearer": "Data",
                "unit": "min",
                "own_calculation": 951,
                "partner_calculation": 995,
                "delta_calculation_percent": 4.63
              }
            ]);

            expect(response.body.homePerspective).to.have.property('details').that.is.an('array').that.deep.equals([
              {
                "service": "MOC Back Home",
                "unit": "min",
                "own_calculation": 6780,
                "partner_calculation": 6980,
                "delta_calculation_percent": 2.95
              },
              {
                "service": "MOC Local",
                "unit": "min",
                "own_calculation": 10234,
                "partner_calculation": 10238,
                "delta_calculation_percent": 0.04
              },
              {
                "service": "MOC Satellite",
                "unit": "min",
                "own_calculation": 0,
                "partner_calculation": 234,
                "delta_calculation_percent": 100
              },
              {
                "service": "SMSMO",
                "unit": "min",
                "own_calculation": 5000,
                "partner_calculation": 5200,
                "delta_calculation_percent": 4
              },
              {
                "service": "NB-IoT",
                "unit": "min",
                "own_calculation": 0,
                "partner_calculation": 23,
                "delta_calculation_percent": 100
              },
              {
                "service": "GPRS",
                "unit": "min",
                "own_calculation": 951,
                "partner_calculation": 972,
                "delta_calculation_percent": 2.21
              }
            ]);

            expect(response.body.partnerPerspective).to.have.property('general_information').that.is.an('array').that.deep.equals([
              {
                "bearer": "Voice",
                "unit": "min",
                "own_calculation": 10745,
                "partner_calculation": 11859,
                "delta_calculation_percent": 10.37
              },
              {
                "bearer": "SMS",
                "unit": "#",
                "own_calculation": 5000,
                "partner_calculation": 5040,
                "delta_calculation_percent": 0.8
              },
              {
                "bearer": "Data",
                "unit": "min",
                "own_calculation": 389,
                "partner_calculation": 189,
                "delta_calculation_percent": -51.41
              }
            ]);

            expect(response.body.partnerPerspective).to.have.property('details').that.is.an('array').that.deep.equals([
              {
                "service": "MOC Back Home",
                "unit": "min",
                "own_calculation": 1289,
                "partner_calculation": 2389,
                "delta_calculation_percent": 85.34
              },
              {
                "service": "MOC Local",
                "unit": "min",
                "own_calculation": 9456,
                "partner_calculation": 9336,
                "delta_calculation_percent": -1.27
              },
              {
                "service": "MOC EEA",
                "unit": "min",
                "own_calculation": 0,
                "partner_calculation": 134,
                "delta_calculation_percent": 100
              },
              {
                "service": "SMSMO",
                "unit": "min",
                "own_calculation": 5000,
                "partner_calculation": 5040,
                "delta_calculation_percent": 0.8
              },
              {
                "service": "VoLTE",
                "unit": "min",
                "own_calculation": 389,
                "partner_calculation": 189,
                "delta_calculation_percent": -51.41
              }
            ]);
            /* eslint-enable quotes */

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get settlement discrepancy OK without any data in parntnerSettlement', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlement1.contractId + '/settlements/' + settlement1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerSettlementId=${settlementReceived1.id}`)
          .send()
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['homePerspective', 'partnerPerspective']);

            /* eslint-disable quotes */
            expect(response.body.homePerspective).to.have.property('general_information').that.is.an('array').that.deep.equals([
              {
                "bearer": "Voice",
                "unit": "min",
                "own_calculation": 17014,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "bearer": "SMS",
                "unit": "#",
                "own_calculation": 5000,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "bearer": "Data",
                "unit": "min",
                "own_calculation": 951,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              }
            ]);

            expect(response.body.homePerspective).to.have.property('details').that.is.an('array').that.deep.equals([
              {
                "service": "MOC Back Home",
                "unit": "min",
                "own_calculation": 6780,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "service": "MOC Local",
                "unit": "min",
                "own_calculation": 10234,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "service": "SMSMO",
                "unit": "min",
                "own_calculation": 5000,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "service": "GPRS",
                "unit": "min",
                "own_calculation": 951,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              }
            ]);

            expect(response.body.partnerPerspective).to.have.property('general_information').that.is.an('array').that.deep.equals([
              {
                "bearer": "Voice",
                "unit": "min",
                "own_calculation": 10745,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "bearer": "SMS",
                "unit": "#",
                "own_calculation": 5000,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "bearer": "Data",
                "unit": "min",
                "own_calculation": 389,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              }
            ]);

            expect(response.body.partnerPerspective).to.have.property('details').that.is.an('array').that.deep.equals([
              {
                "service": "MOC Back Home",
                "unit": "min",
                "own_calculation": 1289,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "service": "MOC Local",
                "unit": "min",
                "own_calculation": 9456,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "service": "SMSMO",
                "unit": "min",
                "own_calculation": 5000,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              },
              {
                "service": "VoLTE",
                "unit": "min",
                "own_calculation": 389,
                "partner_calculation": 0,
                "delta_calculation_percent": -100
              }
            ]);
            /* eslint-enable quotes */

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get settlement discrepancy KO when settlements do not have the same contract', function(done) {
      try {
        const path = globalVersion + '/contracts/' + settlement1.contractId + '/settlements/' + settlement1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerSettlementId=${settlement2.id}`)
          .send()
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(response.body.message).to.equal('Resource not found');

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
