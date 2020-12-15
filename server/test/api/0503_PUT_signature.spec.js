/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/{contractId}/signatures/{signatureId}';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests PUT ${route} API OK`, function() {
  describe(`Setup and Test PUT ${route} API`, function() {
    const sentContract = {
      name: 'Contract name between MSP1 and MSP2',
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {
        mspId: 'A1',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
          }
        ]
      },
      toMsp: {
        mspId: 'B1',
        signatures: [
          {
            role: 'role',
            name: 'name',
            id: 'id'
          }
        ]
      },
      body: {
        bankDetails: {
          A1: {
            iban: null,
            bankName: null,
            currency: null
          },
          B1: {
            iban: null,
            bankName: null,
            currency: null
          }
        },
        discountModels: 'someData',
        generalInformation: {
          name: 'test1',
          type: 'Normal',
          endDate: '2021-01-01T00:00:00.000Z',
          startDate: '2020-12-01T00:00:00.000Z'
        }
      }
    };


    before((done) => {
      debugSetup('==> remove all contracts in db');
      testsDbUtils.removeAllContracts({})
        .then((removeAllContractsResp) => {
          debugSetup('All contracts in db are removed : ', removeAllContractsResp);

          testsDbUtils.removeAllUsages({})
            .then((removeAllUsagesResp) => {
              debugSetup('All usages in db are removed : ', removeAllUsagesResp);

              testsDbUtils.initDbWithContracts([draftContract])
                .then((initDbWithContractsResp) => {
                  debugSetup('One contract in db ', removeAllUsagesResp);
                  draftContract.id = initDbWithContractsResp[0].id;
                  done();
                })
                .catch((initDbWithContractsError) => {
                  debugSetup('Error initializing the db content : ', initDbWithContractsError);
                  debugSetup('==> failed!');
                  done(initDbWithContractsError);
                });
            })
            .catch((removeAllUsagesError) => {
              debugSetup('Error removing usages in db : ', removeAllUsagesError);
              debugSetup('==> failed!');
              done(removeAllUsagesError);
            });
        })
        .catch((removeAllContractsError) => {
          debugSetup('Error removing contracts in db : ', removeAllContractsError);
          debugSetup('==> failed!');
          done(removeAllContractsError);
        });
    });

    it.skip('Put usage OK', function(done) {
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

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usageMinimumData.id);
            expect(response.body).to.have.property('contractId', usageMinimumData.contractId);
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


    it.skip('Put usage OK with maximum usage details', function(done) {
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
            data: [{
              year: 2020,
              month: 1,
              hpmn: 'HPMN',
              vpmn: 'VPMN',
              service: 'service',
              value: 1,
              units: 'unit',
              charges: 'charge',
              taxes: 'taxes'
            }]
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

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'header', 'state', 'body', 'creationDate', 'lastModificationDate']);

            expect(response.body).to.have.property('usageId', usageMoreData.id);
            expect(response.body).to.have.property('state', usageMoreData.state);
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

    it.skip('Put usage NOK on wrong contractId', function(done) {
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
            expect(response).to.have.status(422);
            expect(response).to.be.json;
            expect(response.body).to.exist;

            expect(response.body.message).to.equal('Put usage not allowed');
            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it.skip('Put usage NOK if request body state is not DRAFT', function(done) {
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

    it.skip('Put usage NOK if usage in db is not DRAFT', function(done) {
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
