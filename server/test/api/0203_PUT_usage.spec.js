/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/{usageId}';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API`, function() {
    const contractDraft = {
      name: 'Contract name between A1 and B1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'B1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contractSent = {
      name: 'Contract name between B1 and C1',
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      toMsp: {mspId: 'C1', signatures: [{role: 'role', name: 'name', id: 'id'}]},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIT',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIT'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contractReceived = {
      name: 'Contract name between B1 and C1',
      state: 'RECEIVED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: 'C1'},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIU',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIU'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
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
    const usageMoreData = {
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
    const usageSent = {
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
      state: 'SENT'
    };

    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([contractDraft, contractSent, contractReceived])
        .then((initDbWithContractsResp) => {
          debugSetup('Three contracts where added in db ', initDbWithContractsResp);
          contractDraft.id = initDbWithContractsResp[0].id;
          contractSent.id = initDbWithContractsResp[1].id;
          contractReceived.id = initDbWithContractsResp[2].id;
          usageMinimumData.contractId = contractSent.id;
          usageMinimumData.mspOwner = contractSent.fromMsp.mspId;
          usageMinimumData.mspReceiver = contractSent.toMsp.mspId;
          usageMoreData.contractId = contractReceived.id;
          usageMoreData.mspOwner = contractReceived.fromMsp.mspId;
          usageMoreData.mspReceiver = contractReceived.toMsp.mspId;
          usageSent.contractId = contractReceived.id;
          usageSent.mspOwner = contractReceived.fromMsp.mspId;
          usageSent.mspReceiver = contractReceived.toMsp.mspId;
          debugSetup('==> init db with 3 usages');
          testsDbUtils.initDbWithUsages([usageMinimumData, usageMoreData, usageSent])
            .then((initDbWithUsagesResp) => {
              debugSetup('The db is initialized with 3 usages : ', initDbWithUsagesResp.map((c) => c.id));
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


    it('Put usage OK', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageMinimumData.id;
        debug('PUT path : ', path);

        const sentBody = {
          header: {
            name: 'Usage data name changed',
            type: 'usage',
            version: '1.2.0',
            mspOwner: 'B1'
          },
          state: 'DRAFT',
          body: {
            data: []
          }
        };
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

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usageMinimumData.id);
            expect(response.body).to.have.property('contractId', usageMinimumData.contractId);
            expect(response.body).to.have.property('mspOwner', usageMinimumData.mspOwner);
            expect(response.body).to.have.property('state', usageMinimumData.state);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', 'Usage data name changed');
            expect(response.body.header).to.have.property('type', usageMinimumData.type);
            expect(response.body.header).to.have.property('version', '1.2.0');
            expect(response.body.header).to.have.property('mspOwner', usageMinimumData.mspOwner);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);
            expect(response.body.body).to.deep.include(usageMinimumData.body);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });


    it('Put usage OK with maximum usage details', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractReceived.id + '/usages/' + usageMoreData.id;
        debug('PUT path : ', path);

        const sentBody = {
          header: {
            name: 'Usage data name changed',
            type: 'usage',
            version: '1.2.0',
            mspOwner: 'B1'
          },
          state: 'DRAFT',
          body: {
            data: [
              {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
            ]
          },
        };

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

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usageMoreData.id);
            expect(response.body).to.have.property('state', usageMoreData.state);
            expect(response.body).to.have.property('mspOwner', usageMoreData.mspOwner);
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', 'Usage data name changed');
            expect(response.body.header).to.have.property('type', usageMoreData.type);
            expect(response.body.header).to.have.property('version', '1.2.0');
            expect(response.body.header).to.have.property('mspOwner', usageMoreData.mspOwner);


            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);
            expect(response.body.body).to.deep.include(usageMoreData.body);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put usage NOK on wrong contractId', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();

        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/usages/' + usageMinimumData.id;
        debug('PUT path : ', path);

        const sentBody = {
          header: {
            name: 'Usage data name changed',
            type: 'usage',
            version: '1.2.0',
            mspOwner: 'B1'
          },
          state: 'DRAFT',
          body: {
            data: []
          }
        };
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Resource not found');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put usage NOK if request body state is not DRAFT', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/' + usageMinimumData.id;
        debug('PUT path : ', path);

        const sentBody = {
          header: {
            name: 'Usage data name changed',
            type: 'usage',
            version: '1.2.0',
            mspOwner: 'B1'
          },
          state: 'SENT',
          body: {
            data: []
          }
        };
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Usage modification not allowed');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Put usage NOK if usage in db is not DRAFT', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractReceived.id + '/usages/' + usageSent.id;
        debug('PUT path : ', path);

        const sentBody = {
          header: {
            name: 'Usage data name changed',
            type: 'usage',
            version: '1.2.0',
            mspOwner: 'B1'
          },
          state: 'SENT',
          body: {
            data: []
          }
        };
        chai.request(testsUtils.getServer())
          .put(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Usage modification not allowed');
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
