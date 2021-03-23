/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/{usageId}/discrepancy';

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
    const usage1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data',
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
            usage: '5298.2115',
            units: 'SMS',
            charges: '104.16423',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'MOC Back Home',
            usage: '2249.896',
            units: 'min',
            charges: '322.4844',
            taxes: '0',
            currency: 'EUR'
          }
        ],
        outbound: [
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'SMS MO',
            usage: '21537.517',
            units: 'SMS',
            charges: '430.61034',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'GPRS',
            usage: '14692.6175',
            units: 'MB',
            charges: '4408.98525',
            taxes: '0',
            currency: 'EUR'
          }
        ]
      },
      state: 'DRAFT'
    };
    const usageReceived1 = {
      type: 'usage',
      version: '1.1.1',
      name: 'Usage data received',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        inbound: [
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'SMS MO',
            usage: '21530.517',
            units: 'SMS',
            charges: '415.61670',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'DTAG',
            visitorTadig: 'TMUS',
            service: 'GPRS',
            usage: '14696.6175',
            units: 'MB',
            charges: '4390.98291',
            taxes: '0',
            currency: 'EUR'
          }
        ],
        outbound: [
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'SMS MO',
            usage: '5208.2115',
            units: 'SMS',
            charges: '170.16411',
            taxes: '0',
            currency: 'EUR'
          },
          {
            yearMonth: '202001',
            homeTadig: 'TMUS',
            visitorTadig: 'DTAG',
            service: 'MOC Back Home',
            usage: '2149.896',
            units: 'min',
            charges: '4252.4104',
            taxes: '0',
            currency: 'EUR'
          }
        ]
      },
      state: 'RECEIVED'
    };
    const usage2 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage with data',
      contractId: undefined,
      mspOwner: undefined,
      mspReceiver: undefined,
      body: {
        data: [
          {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
        ]
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
          usage1.contractId = contract1.id;
          usage1.mspOwner = contract1.fromMsp.mspId;
          usage1.mspReceiver = contract1.toMsp.mspId;
          usageReceived1.contractId = contract1.id;
          usageReceived1.mspOwner = contract1.toMsp.mspId;
          usageReceived1.mspReceiver = contract1.fromMsp.mspId;
          usage2.contractId = contract2.id;
          usage2.mspOwner = contract2.fromMsp.mspId;
          usage2.mspReceiver = contract2.toMsp.mspId;
          debugSetup('==> init db with 3 usages');
          testsDbUtils.initDbWithUsages([usage1, usage2, usageReceived1])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 3 usages : ', initDbWithUsagesResp.map((c) => c.id));
              debugSetup('==> init db with 0 settlements');
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

    it('Get usage discrepancy OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + usage1.contractId + '/usages/' + usage1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerUsageId=${usageReceived1.id}`)
          .send()
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['general_information', 'inbound', 'outbound']);

            /* eslint-disable quotes */
            expect(response.body).to.have.property('general_information').that.is.an('array').that.deep.equals([
              {
                "service": "MOC",
                "unit": "min",
                "inbound_own_usage": 2249.9,
                "inbound_partner_usage": 2149.9,
                "inbound_discrepancy": -100,
                "outbound_own_usage": 0,
                "outbound_partner_usage": 0,
                "outbound_discrepancy": 0
              },
              {
                "service": "SMS",
                "unit": "#",
                "inbound_own_usage": 5298.21,
                "inbound_partner_usage": 5208.21,
                "inbound_discrepancy": -90,
                "outbound_own_usage": 21537.52,
                "outbound_partner_usage": 21530.52,
                "outbound_discrepancy": -7
              },
              {
                "service": "Data",
                "unit": "min",
                "inbound_own_usage": 0,
                "inbound_partner_usage": 0,
                "inbound_discrepancy": 0,
                "outbound_own_usage": 14692.62,
                "outbound_partner_usage": 14696.62,
                "outbound_discrepancy": 4
              }
            ]);

            expect(response.body).to.have.property('inbound').that.is.an('array').that.deep.equals([
              {
                "HTMN": "TMUS",
                "VPMN": "DTAG",
                "yearMonth": "202001",
                "service": "SMS MO",
                "own_usage": 5298.21,
                "partner_usage": 5208.21,
                "delta_usage_abs": -90,
                "delta_usage_percent": -1.7
              },
              {
                "HTMN": "TMUS",
                "VPMN": "DTAG",
                "yearMonth": "202001",
                "service": "MOC Back Home",
                "own_usage": 2249.9,
                "partner_usage": 2149.9,
                "delta_usage_abs": -100,
                "delta_usage_percent": -4.44,
              }
            ]);

            expect(response.body).to.have.property('outbound').that.is.an('array').that.deep.equals([
              {
                "HTMN": "DTAG",
                "VPMN": "TMUS",
                "yearMonth": "202001",
                "service": "SMS MO",
                "own_usage": 21537.52,
                "partner_usage": 21530.52,
                "delta_usage_abs": -7,
                "delta_usage_percent": -0.03
              },
              {
                "HTMN": "DTAG",
                "VPMN": "TMUS",
                "yearMonth": "202001",
                "service": "GPRS",
                "own_usage": 14692.62,
                "partner_usage": 14696.62,
                "delta_usage_abs": 4,
                "delta_usage_percent": 0.03
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

    it('Get usage discrepancy KO when usages do not have the same contract', function(done) {
      try {
        const path = globalVersion + '/contracts/' + usage1.contractId + '/usages/' + usage1.id + '/discrepancy/';
        debug('path : ', path);

        chai.request(testsUtils.getServer())
          .get(`${path}?partnerUsageId=${usage2.id}`)
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
