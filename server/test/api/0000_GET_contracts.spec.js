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
const route = '/contracts/';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API without any contract in DB`, function() {
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

    it(`Get contracts OK without any contract in DB`, function(done) {
      try {
        const path = globalVersion + route;
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

    it(`Get DRAFT or SENT contracts OK without any contract in DB`, function(done) {
      try {
        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}?states=DRAFT|SENT`)
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

    it(`Get DRAFT contracts with GSMA OK without any contract in DB`, function(done) {
      try {
        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}?states=DRAFT&withMSPs=GSMA`)
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
  });

  describe(`Setup and Test GET ${route} API with 2 contracts in DB`, function() {
    const contract1 = {
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

    const contract2 = {
      name: 'Contract name between A1 and C1',
      state: 'DRAFT',
      type: 'contract',
      version: '1.3.1',
      fromMsp: {mspId: 'A1'},
      toMsp: {mspId: 'C3'},
      body: {
        metadata: {
          name: 'Contract2 Name in Body',
          authors: 'My boss and me',
        },
        framework: {
          term: {
            start: '01-01-2021',
            end: '01-01-2027',
            otherField: 'a'
          },
          partyInformation: {
            MyPartyId: {
              contractCurrency: 'euros',
              defaultTadigCodes: ['AZE', 'RTY'],
              tadigGroups: {},
              alsoContractParty: Boolean,
            }
          }
        },
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, C3: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-2'
    };

    before((done) => {
      debugSetup('==> init db with 2 contracts');
      testsDbUtils.initDbWithContracts([contract1, contract2])
        .then((initDbWithContractsResp) => {
          debugSetup('The db is initialized with 2 contracts : ', initDbWithContractsResp.map((c) => c.id));
          debugSetup('==> done!');
          done();
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('Get contracts OK with 2 contracts in DB', function(done) {
      try {
        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.body : ', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);

            let contract1IsFound = false;
            let contract2IsFound = false;
            response.body.forEach((contractInBody) => {
              let contract = undefined;
              if (contractInBody.contractId === contract1.id) {
                contract1IsFound = true;
                contract = contract1;
              }
              if (contractInBody.contractId === contract2.id) {
                contract2IsFound = true;
                contract = contract2;
              }
              expect(Object.keys(contractInBody)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);
              expect(contractInBody).to.have.property('contractId', contract.id);
              expect(contractInBody).to.have.property('state', contract.state);
              expect(contractInBody).to.have.property('creationDate').that.match(DATE_REGEX);
              expect(contractInBody).to.have.property('lastModificationDate').that.match(DATE_REGEX);
              expect(contractInBody).to.have.property('header').that.is.an('object');
              expect(contractInBody).to.have.property('body').that.is.an('object');
              expect(Object.keys(contractInBody.header)).have.members(['type', 'version', 'msps']);
              expect(contractInBody.header).to.have.property('type', contract.type);
              expect(contractInBody.header).to.have.property('version', contract.version);
              expect(contractInBody.header).to.have.property('msps').that.is.an('object');
              expect(Object.keys(contractInBody.body)).have.members(['metadata', 'framework']);
              expect(contractInBody.body).to.have.property('metadata').that.is.an('object');
              expect(contractInBody.body).to.have.property('framework').that.is.an('object');
              expect(Object.keys(contractInBody.body.metadata)).have.members(['name', 'authors']);
              expect(Object.keys(contractInBody.body.framework)).have.members(['term', 'partyInformation']);
              if (contractInBody.contractId === contract1.id) {
                expect(contractInBody.body.metadata).to.have.property('name', null);
                expect(contractInBody.body.metadata).to.have.property('authors', null);
                expect(contractInBody.body.framework).to.have.property('term', null);
                expect(contractInBody.body.framework).to.have.property('partyInformation', null);
              } else if (contractInBody.contractId === contract2.id) {
                expect(contractInBody.body.metadata).to.have.property('name', contract2.body.metadata.name);
                expect(contractInBody.body.metadata).to.have.property('authors', contract2.body.metadata.authors);
                expect(contractInBody.body.framework).to.have.property('term').that.is.an('object');
                expect(contractInBody.body.framework.term).to.deep.equals({start: '01-01-2021', end: '01-01-2027', otherField: 'a'});
                expect(contractInBody.body.framework).to.have.property('partyInformation').that.is.an('object');
                expect(contractInBody.body.framework.partyInformation).to.deep.equals({MyPartyId: {contractCurrency: 'euros', defaultTadigCodes: ['AZE', 'RTY']}});
              }
              expect(Object.keys(contractInBody.header.msps)).have.members([contract.fromMsp.mspId, contract.toMsp.mspId]);
              expect(contractInBody.header.msps[contract.fromMsp.mspId]).to.have.property('signatures').to.be.an('array');
              expect(contractInBody.header.msps[contract.toMsp.mspId]).to.have.property('signatures').to.be.an('array');
            });
            expect(contract1IsFound).to.be.true;
            expect(contract2IsFound).to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get DRAFT contracts OK with 2 contracts in DB', function(done) {
      try {
        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}?states=DRAFT`)
          .end((error, response) => {
            debug('response.body : ', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);

            let contract1IsFound = false;
            let contract2IsFound = false;
            response.body.forEach((contractInBody) => {
              let contract = undefined;
              if (contractInBody.contractId === contract1.id) {
                contract1IsFound = true;
                contract = contract1;
              }
              if (contractInBody.contractId === contract2.id) {
                contract2IsFound = true;
                contract = contract2;
              }
              expect(Object.keys(contractInBody)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);
              expect(contractInBody).to.have.property('contractId', contract.id);
              expect(contractInBody).to.have.property('state', contract.state);
              expect(contractInBody).to.have.property('creationDate').that.match(DATE_REGEX);
              expect(contractInBody).to.have.property('lastModificationDate').that.match(DATE_REGEX);
              expect(contractInBody).to.have.property('header').that.is.an('object');
              expect(contractInBody).to.have.property('body').that.is.an('object');
              expect(Object.keys(contractInBody.header)).have.members(['type', 'version', 'msps']);
              expect(contractInBody.header).to.have.property('type', contract.type);
              expect(contractInBody.header).to.have.property('version', contract.version);
              expect(contractInBody.header).to.have.property('msps').that.is.an('object');
              expect(Object.keys(contractInBody.body)).have.members(['metadata', 'framework']);
              expect(contractInBody.body).to.have.property('metadata').that.is.an('object');
              expect(contractInBody.body).to.have.property('framework').that.is.an('object');
              expect(Object.keys(contractInBody.body.metadata)).have.members(['name', 'authors']);
              expect(Object.keys(contractInBody.body.framework)).have.members(['term', 'partyInformation']);
              if (contractInBody.contractId === contract1.id) {
                expect(contractInBody.body.metadata).to.have.property('name', null);
                expect(contractInBody.body.metadata).to.have.property('authors', null);
                expect(contractInBody.body.framework).to.have.property('term', null);
                expect(contractInBody.body.framework).to.have.property('partyInformation', null);
              } else if (contractInBody.contractId === contract2.id) {
                expect(contractInBody.body.metadata).to.have.property('name', contract2.body.metadata.name);
                expect(contractInBody.body.metadata).to.have.property('authors', contract2.body.metadata.authors);
                expect(contractInBody.body.framework).to.have.property('term').that.is.an('object');
                expect(contractInBody.body.framework.term).to.deep.equals({start: '01-01-2021', end: '01-01-2027', otherField: 'a'});
                expect(contractInBody.body.framework).to.have.property('partyInformation').that.is.an('object');
                expect(contractInBody.body.framework.partyInformation).to.deep.equals({MyPartyId: {contractCurrency: 'euros', defaultTadigCodes: ['AZE', 'RTY']}});
              }
              expect(Object.keys(contractInBody.header.msps)).have.members([contract.fromMsp.mspId, contract.toMsp.mspId]);
              expect(contractInBody.header.msps[contract.fromMsp.mspId]).to.have.property('signatures').to.be.an('array');
              expect(contractInBody.header.msps[contract.toMsp.mspId]).to.have.property('signatures').to.be.an('array');
            });
            expect(contract1IsFound).to.be.true;
            expect(contract2IsFound).to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get SENT contracts OK with 2 contracts in DB', function(done) {
      try {
        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}?states=SENT`)
          .end((error, response) => {
            debug('response.body : ', JSON.stringify(response.body));
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

    it('Get DRAFT contracts with B1 OK with 2 contracts in DB', function(done) {
      try {
        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}?states=DRAFT&withMSPs=B1`)
          .end((error, response) => {
            debug('response.body : ', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);

            const contractInBody = response.body[0];
            const contract = contract1;
            expect(Object.keys(contractInBody)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);
            expect(contractInBody).to.have.property('contractId', contract.id);
            expect(contractInBody).to.have.property('state', contract.state);
            expect(contractInBody).to.have.property('creationDate').that.match(DATE_REGEX);
            expect(contractInBody).to.have.property('lastModificationDate').that.match(DATE_REGEX);
            expect(contractInBody).to.have.property('header').that.is.an('object');
            expect(contractInBody).to.have.property('body').that.is.an('object');
            expect(Object.keys(contractInBody.header)).have.members(['type', 'version', 'msps']);
            expect(contractInBody.header).to.have.property('type', contract.type);
            expect(contractInBody.header).to.have.property('version', contract.version);
            expect(contractInBody.header).to.have.property('msps').that.is.an('object');
            expect(Object.keys(contractInBody.body)).have.members(['metadata', 'framework']);
            expect(contractInBody.body).to.have.property('metadata').that.is.an('object');
            expect(contractInBody.body).to.have.property('framework').that.is.an('object');
            expect(Object.keys(contractInBody.body.metadata)).have.members(['name', 'authors']);
            expect(Object.keys(contractInBody.body.framework)).have.members(['term', 'partyInformation']);
            if (contractInBody.contractId === contract1.id) {
              expect(contractInBody.body.metadata).to.have.property('name', null);
              expect(contractInBody.body.metadata).to.have.property('authors', null);
              expect(contractInBody.body.framework).to.have.property('term', null);
              expect(contractInBody.body.framework).to.have.property('partyInformation', null);
            } else if (contractInBody.contractId === contract2.id) {
              expect(contractInBody.body.metadata).to.have.property('name', contract2.body.metadata.name);
              expect(contractInBody.body.metadata).to.have.property('authors', contract2.body.metadata.authors);
              expect(contractInBody.body.framework).to.have.property('term').that.is.an('object');
              expect(contractInBody.body.framework.term).to.deep.equals({start: '01-01-2021', end: '01-01-2027', otherField: 'a'});
              expect(contractInBody.body.framework).to.have.property('partyInformation').that.is.an('object');
              expect(contractInBody.body.framework.partyInformation).to.deep.equals({MyPartyId: {contractCurrency: 'euros', defaultTadigCodes: ['AZE', 'RTY']}});
            }
            expect(Object.keys(contractInBody.header.msps)).have.members([contract.fromMsp.mspId, contract.toMsp.mspId]);
            expect(contractInBody.header.msps[contract.fromMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(contractInBody.header.msps[contract.toMsp.mspId]).to.have.property('signatures').to.be.an('array');

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get DRAFT contracts with C3 or C4 OK with 2 contracts in DB', function(done) {
      try {
        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}?states=DRAFT&withMSPs=C3|C4`)
          .end((error, response) => {
            debug('response.body : ', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);

            const contractInBody = response.body[0];
            const contract = contract2;
            expect(Object.keys(contractInBody)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);
            expect(contractInBody).to.have.property('contractId', contract.id);
            expect(contractInBody).to.have.property('state', contract.state);
            expect(contractInBody).to.have.property('creationDate').that.match(DATE_REGEX);
            expect(contractInBody).to.have.property('lastModificationDate').that.match(DATE_REGEX);
            expect(contractInBody).to.have.property('header').that.is.an('object');
            expect(contractInBody).to.have.property('body').that.is.an('object');
            expect(Object.keys(contractInBody.header)).have.members(['type', 'version', 'msps']);
            expect(contractInBody.header).to.have.property('type', contract.type);
            expect(contractInBody.header).to.have.property('version', contract.version);
            expect(contractInBody.header).to.have.property('msps').that.is.an('object');
            expect(Object.keys(contractInBody.body)).have.members(['metadata', 'framework']);
            expect(contractInBody.body).to.have.property('metadata').that.is.an('object');
            expect(contractInBody.body).to.have.property('framework').that.is.an('object');
            expect(Object.keys(contractInBody.body.metadata)).have.members(['name', 'authors']);
            expect(Object.keys(contractInBody.body.framework)).have.members(['term', 'partyInformation']);
            if (contractInBody.contractId === contract1.id) {
              expect(contractInBody.body.metadata).to.have.property('name', null);
              expect(contractInBody.body.metadata).to.have.property('authors', null);
              expect(contractInBody.body.framework).to.have.property('term', null);
              expect(contractInBody.body.framework).to.have.property('partyInformation', null);
            } else if (contractInBody.contractId === contract2.id) {
              expect(contractInBody.body.metadata).to.have.property('name', contract2.body.metadata.name);
              expect(contractInBody.body.metadata).to.have.property('authors', contract2.body.metadata.authors);
              expect(contractInBody.body.framework).to.have.property('term').that.is.an('object');
              expect(contractInBody.body.framework.term).to.deep.equals({start: '01-01-2021', end: '01-01-2027', otherField: 'a'});
              expect(contractInBody.body.framework).to.have.property('partyInformation').that.is.an('object');
              expect(contractInBody.body.framework.partyInformation).to.deep.equals({MyPartyId: {contractCurrency: 'euros', defaultTadigCodes: ['AZE', 'RTY']}});
            }
            expect(Object.keys(contractInBody.header.msps)).have.members([contract.fromMsp.mspId, contract.toMsp.mspId]);
            expect(contractInBody.header.msps[contract.fromMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(contractInBody.header.msps[contract.toMsp.mspId]).to.have.property('signatures').to.be.an('array');

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
