/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/usages/';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} `, function() {
    const contract1 = {
      name: 'Contract name between A1 and B1',
      state: 'SIGNED',
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
    const contract2 = {
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
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const usageDraft1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - draft',
      contractId: undefined,
      mspOwner: 'A1',
      mspReceiver: 'B1',
      body: {
        data: []
      },
      state: 'DRAFT'
    };
    const usageSent1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - sent',
      contractId: undefined,
      mspOwner: 'A1',
      mspReceiver: 'B1',
      body: {
        data: []
      },
      state: 'SENT'
    };
    const usageReceived1 = {
      type: 'usage',
      version: '1.1.0',
      name: 'Usage data - received',
      contractId: undefined,
      mspOwner: 'B1',
      mspReceiver: 'A1',
      body: {
        data: []
      },
      state: 'RECEIVED'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          debugSetup('Two contracts in db ', initDbWithContractsResp);
          contract1.id = initDbWithContractsResp[0].id;
          contract2.id = initDbWithContractsResp[1].id;
          usageDraft1.contractId = contract1.id;
          usageDraft1.mspOwner = contract1.fromMsp.mspId;
          usageSent1.contractId = contract1.id;
          usageSent1.mspOwner = contract1.fromMsp.mspId;
          usageReceived1.contractId = contract1.id;
          usageReceived1.mspOwner = contract1.toMsp.mspId;
          debugSetup('==> init db with 3 usages');
          testsDbUtils.initDbWithUsages([usageDraft1, usageSent1, usageReceived1])
            .then((initDbWithUsagesResp) => {
              debugSetup('3 usages documents linked to contract ', initDbWithUsagesResp);
              usageDraft1.id = initDbWithUsagesResp[0].id;
              usageSent1.id = initDbWithUsagesResp[1].id;
              usageReceived1.id = initDbWithUsagesResp[2].id;
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

    it('Get usages K0 for unexisting contractId in DB', function(done) {
      try {
        const randomValue = testsUtils.defineRandomValue();
        const path = globalVersion + '/contracts/' + 'id_' + randomValue + '/usages/';
        debug('GET path : %s', path);
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
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

    it('Get usages OK without any usage for contractId in DB', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract2.id + '/usages/';
        debug('GET path : %s', path);
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

    it('Get usages OK with 3 usages for contractId in DB', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/';
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

            response.body.forEach((usageReturned) => {
              expect(usageReturned).to.be.an('object');
              expect(Object.keys(usageReturned)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'state', 'creationDate', 'lastModificationDate']);

              let initializedUsageToCompare = undefined;
              if (usageReturned.usageId === usageDraft1.id) {
                initializedUsageToCompare = usageDraft1;
              } else if (usageReturned.usageId === usageSent1.id) {
                initializedUsageToCompare = usageSent1;
              } else if (usageReturned.usageId === usageReceived1.id) {
                initializedUsageToCompare = usageReceived1;
              }
              if (initializedUsageToCompare === undefined) {
                expect.fail(`This usage should not be returned : ${JSON.stringify(usageReturned)}`);
              } else {
                expect(usageReturned).to.have.property('usageId', initializedUsageToCompare.id);
                expect(usageReturned).to.have.property('contractId', initializedUsageToCompare.contractId);
                expect(usageReturned).to.have.property('state', initializedUsageToCompare.state);
                expect(usageReturned).to.have.property('mspOwner', initializedUsageToCompare.mspOwner);
                expect(usageReturned).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
                expect(usageReturned).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

                expect(usageReturned).to.have.property('header').that.is.an('object');
                expect(Object.keys(usageReturned.header)).have.members(['name', 'type', 'version']);
                expect(usageReturned.header).to.have.property('name', initializedUsageToCompare.name);
                expect(usageReturned.header).to.have.property('type', initializedUsageToCompare.type);
                expect(usageReturned.header).to.have.property('version', initializedUsageToCompare.version);
              }
            });

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get RECEIVED usages OK with 1 RECEIVED usage for contractId in DB', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/';
        debug('GET path : ' + path);
        chai.request(testsUtils.getServer())
          .get(`${path}?states=RECEIVED`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);

            response.body.forEach((usageReturned) => {
              expect(usageReturned).to.be.an('object');
              expect(Object.keys(usageReturned)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'state', 'creationDate', 'lastModificationDate']);

              let initializedUsageToCompare = undefined;
              if (usageReturned.usageId === usageReceived1.id) {
                initializedUsageToCompare = usageReceived1;
              }
              if (initializedUsageToCompare === undefined) {
                expect.fail(`This usage should not be returned : ${JSON.stringify(usageReturned)}`);
              } else {
                expect(usageReturned).to.have.property('usageId', initializedUsageToCompare.id);
                expect(usageReturned).to.have.property('contractId', initializedUsageToCompare.contractId);
                expect(usageReturned).to.have.property('state', initializedUsageToCompare.state);
                expect(usageReturned).to.have.property('mspOwner', initializedUsageToCompare.mspOwner);
                expect(usageReturned).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
                expect(usageReturned).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

                expect(usageReturned).to.have.property('header').that.is.an('object');
                expect(Object.keys(usageReturned.header)).have.members(['name', 'type', 'version']);
                expect(usageReturned.header).to.have.property('name', initializedUsageToCompare.name);
                expect(usageReturned.header).to.have.property('type', initializedUsageToCompare.type);
                expect(usageReturned.header).to.have.property('version', initializedUsageToCompare.version);
              }
            });

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get DRAFT usages OK with 1 DRAFT usage for contractId in DB', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/';
        debug('GET path : ' + path);
        chai.request(testsUtils.getServer())
          .get(`${path}?states=DRAFT`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);

            response.body.forEach((usageReturned) => {
              expect(usageReturned).to.be.an('object');
              expect(Object.keys(usageReturned)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'state', 'creationDate', 'lastModificationDate']);

              let initializedUsageToCompare = undefined;
              if (usageReturned.usageId === usageDraft1.id) {
                initializedUsageToCompare = usageDraft1;
              }
              if (initializedUsageToCompare === undefined) {
                expect.fail(`This usage should not be returned : ${JSON.stringify(usageReturned)}`);
              } else {
                expect(usageReturned).to.have.property('usageId', initializedUsageToCompare.id);
                expect(usageReturned).to.have.property('contractId', initializedUsageToCompare.contractId);
                expect(usageReturned).to.have.property('state', initializedUsageToCompare.state);
                expect(usageReturned).to.have.property('mspOwner', initializedUsageToCompare.mspOwner);
                expect(usageReturned).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
                expect(usageReturned).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

                expect(usageReturned).to.have.property('header').that.is.an('object');
                expect(Object.keys(usageReturned.header)).have.members(['name', 'type', 'version']);
                expect(usageReturned.header).to.have.property('name', initializedUsageToCompare.name);
                expect(usageReturned.header).to.have.property('type', initializedUsageToCompare.type);
                expect(usageReturned.header).to.have.property('version', initializedUsageToCompare.version);
              }
            });

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get SENT or RECEIVED usages OK with 1 SENT and 1 RECEIVED usage for contractId in DB', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contract1.id + '/usages/';
        debug('GET path : ' + path);
        chai.request(testsUtils.getServer())
          .get(`${path}?states=SENT|RECEIVED`)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);

            response.body.forEach((usageReturned) => {
              expect(usageReturned).to.be.an('object');
              expect(Object.keys(usageReturned)).have.members(['usageId', 'contractId', 'header', 'mspOwner', 'state', 'creationDate', 'lastModificationDate']);

              let initializedUsageToCompare = undefined;
              if (usageReturned.usageId === usageSent1.id) {
                initializedUsageToCompare = usageSent1;
              } else if (usageReturned.usageId === usageReceived1.id) {
                initializedUsageToCompare = usageReceived1;
              }
              if (initializedUsageToCompare === undefined) {
                expect.fail(`This usage should not be returned : ${JSON.stringify(usageReturned)}`);
              } else {
                expect(usageReturned).to.have.property('usageId', initializedUsageToCompare.id);
                expect(usageReturned).to.have.property('contractId', initializedUsageToCompare.contractId);
                expect(usageReturned).to.have.property('state', initializedUsageToCompare.state);
                expect(usageReturned).to.have.property('mspOwner', initializedUsageToCompare.mspOwner);
                expect(usageReturned).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
                expect(usageReturned).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

                expect(usageReturned).to.have.property('header').that.is.an('object');
                expect(Object.keys(usageReturned.header)).have.members(['name', 'type', 'version']);
                expect(usageReturned.header).to.have.property('name', initializedUsageToCompare.name);
                expect(usageReturned.header).to.have.property('type', initializedUsageToCompare.type);
                expect(usageReturned.header).to.have.property('version', initializedUsageToCompare.version);
              }
            });

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
