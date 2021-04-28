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
const route = '/contracts/{contractId}/usages/';

const selfMspId = testsUtils.getSelfMspId();

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests POST ${route} API OK`, function() {
  describe(`Setup and Test POST ${route} API with a usage document`, function() {
    const contractDraft = {
      name: `Contract name between ${selfMspId} and B1`,
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: selfMspId},
      toMsp: {mspId: 'B1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };
    const contractSent = {
      name: `Contract name between ${selfMspId} and C1`,
      state: 'SENT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: selfMspId},
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
    const contractReceived = {
      name: `Contract name between B1 and ${selfMspId}`,
      state: 'RECEIVED',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: 'B1'},
      toMsp: {mspId: selfMspId},
      referenceId: 'AZRAGGSHJIAJAOJSNJNSSNNAIU',
      blockchainRef: {type: 'hlf', txId: 'TX-RAGGSHJIAJAOJSNJNSSNNAIU', timestamp: new Date().toJSON()},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };

    before((done) => {
      debugSetup('==> init db with 3 contracts');
      testsDbUtils.initDbWithContracts([contractDraft, contractSent, contractReceived])
        .then((initDbWithContractsResp) => {
          debugSetup('3 contracts where added in db ', initDbWithContractsResp);
          contractDraft.id = initDbWithContractsResp[0].id;
          contractSent.id = initDbWithContractsResp[1].id;
          contractReceived.id = initDbWithContractsResp[2].id;

          debugSetup('==> done!');
          done();
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    it('POST usages OK on DRAFT Contract with a Usage document', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractDraft.id + '/usages/';

        const sentBody = {
          header: {
            name: 'name',
            type: 'usage',
            version: '1.1.0',
            // mspOwner: ->  the MSP which gives the Inbound traffic data   Could be the contract->fromMsp
          },
          body: {
            data: [
              {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
            ]
          },
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response: %s', JSON.stringify(response));
            expect(error).to.be.null;
            expect(response).to.have.status(422);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('POST usages OK on SENT Contract with a Usage document', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractSent.id + '/usages/';

        const sentBody = {
          header: {
            name: 'name',
            type: 'usage',
            version: '1.1.0',
            // mspOwner: ->  the MSP which gives the Inbound traffic data   Could be the contract->fromMsp
          },
          body: {
            data: [
              {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
            ]
          },
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'mspOwner', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('usageId').that.is.a('string');
            expect(response.body).to.have.property('contractId').that.is.a('string');
            expect(response.body).to.have.property('mspOwner', testsUtils.getSelfMspId());

            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            expect(response.body.header).to.have.property('mspOwner', contractSent.fromMsp.mspId);


            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);


            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(1);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/, '')}/${response.body.usageId}`);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('POST usages OK on RECEIVED Contract with a Usage document', function(done) {
      try {
        const path = globalVersion + '/contracts/' + contractReceived.id + '/usages/';

        const sentBody = {
          header: {
            name: 'name',
            type: 'usage',
            version: '1.1.0',
            // mspOwner: ->  the MSP which gives the Inbound traffic data   Could be the contract->fromMsp
          },
          body: {
            data: [
              {year: 2020, month: 1, hpmn: 'HPMN', vpmn: 'VPMN', service: 'service', value: 1, units: 'unit', charges: 'charge', taxes: 'taxes'}
            ]
          },
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');

            expect(Object.keys(response.body)).have.members(['usageId', 'contractId', 'mspOwner', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('usageId').that.is.a('string');
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('mspOwner', testsUtils.getSelfMspId());
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['name', 'type', 'version', 'mspOwner']);
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            expect(response.body.header).to.have.property('mspOwner', contractSent.fromMsp.mspId);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members(['data']);


            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(1);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/, '')}/${response.body.usageId}`);

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

describe(`Tests POST ${route} API FAILED`, function() {
  describe(`Setup and Test POST ${route} API FAILED`, function() {
    const contractDraft = {
      name: `Contract name between ${selfMspId} and B1`,
      state: 'DRAFT',
      type: 'contract',
      version: '1.1.0',
      fromMsp: {mspId: selfMspId},
      toMsp: {mspId: 'B1'},
      body: {
        bankDetails: {A1: {iban: null, bankName: null, currency: null}, B1: {iban: null, bankName: null, currency: null}},
        discountModels: 'someData',
        generalInformation: {name: 'test1', type: 'Normal', endDate: '2021-01-01T00:00:00.000Z', startDate: '2020-12-01T00:00:00.000Z'}
      },
      rawData: 'Ctr_raw-data-1'
    };

    before((done) => {
      debugSetup('==> init db with 1 contract');
      testsDbUtils.initDbWithContracts([contractDraft])
        .then((initDbWithContractsResp) => {
          debugSetup('1 contract is added in db ', initDbWithContractsResp);
          contractDraft.id = initDbWithContractsResp[0].id;

          debugSetup('==> done!');
          done();
        })
        .catch((initDbWithContractsError) => {
          debugSetup('Error initializing the db content : ', initDbWithContractsError);
          debugSetup('==> failed!');
          done(initDbWithContractsError);
        });
    });

    /* eslint-disable quotes */
    const testArray = [
      {
        description: 'Empty usage',
        sentBody: {},
        response: {
          status: 400,
          body: {
            message: "request.body should have required property 'header', request.body should have required property 'body'",
            errors: [
              {
                errorCode: "required.openapi.validation",
                message: "should have required property 'header'",
                path: ".body.header"
              },
              {
                errorCode: "required.openapi.validation",
                message: "should have required property 'body'",
                path: ".body.body"
              }
            ]
          }
        }
      },
      {
        description: '"header" and "body" should be objects',
        sentBody: {
          header: "",
          body: []
        },
        response: {
          status: 400,
          body: {
            message: "request.body.header should be object, request.body.body should be object",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be object",
                path: ".body.header"
              },
              {
                errorCode: "type.openapi.validation",
                message: "should be object",
                path: ".body.body"
              }
            ]
          }
        }
      },
      {
        description: '"body.metadata" should be object',
        sentBody: {
          header: {
            name: 'Usage name between A1 and B1',
            version: '1.1',
            type: 'usage'
          },
          body: {
            metadata: [],
            inbound: []
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.metadata should be object",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be object",
                path: ".body.body.metadata"
              }
            ]
          }
        }
      },
      {
        description: '"body.metadata.authors" should be string',
        sentBody: {
          header: {
            name: 'Usage name between A1 and B1',
            version: '1.1',
            type: 'usage'
          },
          body: {
            metadata: {
              name: "UsageName",
              authors: ["AAA", "BBB"]
            },
            inbound: [],
            outbound: []
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.metadata.authors should be string",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be string",
                path: ".body.body.metadata.authors"
              }
            ]
          }
        }
      },
      {
        description: '"body.inbound[0].usage" should be number',
        sentBody: {
          header: {
            name: 'Usage name between A1 and B1',
            version: '1.1',
            type: 'usage'
          },
          body: {
            inbound: [
              {
                yearMonth: "202012",
                homeTadig: "A_TADIG",
                visitorTadig: "ANOTHER_TADIG",
                service: "SMSMO",
                usage: "10"
              }
            ],
            outbound: []
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.inbound[0].usage should be number",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be number",
                path: ".body.body.inbound[0].usage"
              }
            ]
          }
        }
      },
      {
        description: '"body.outbound[0]" should have required property "homeTadig"',
        sentBody: {
          header: {
            name: 'Usage name between A1 and B1',
            version: '1.1',
            type: 'usage'
          },
          body: {
            inbound: [],
            outbound: [
              {
                yearMonth: "202012",
                visitorTadig: "ANOTHER_TADIG",
                service: "SMSMO",
                usage: 10
              }
            ]
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.outbound[0] should have required property 'homeTadig'",
            errors: [
              {
                errorCode: "required.openapi.validation",
                message: "should have required property 'homeTadig'",
                path: ".body.body.outbound[0].homeTadig"
              }
            ]
          }
        }
      },
      {
        description: '"body.outbound[0].visitorTadig" should be string',
        sentBody: {
          header: {
            name: 'Usage name between A1 and B1',
            version: '1.1',
            type: 'usage'
          },
          body: {
            inbound: [],
            outbound: [
              {
                yearMonth: "202012",
                homeTadig: "A_TADIG",
                visitorTadig: ["ANOTHER_TADIG1", "ANOTHER_TADIG2"],
                service: "SMSMO",
                usage: 10
              }
            ]
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.outbound[0].visitorTadig should be string",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be string",
                path: ".body.body.outbound[0].visitorTadig"
              }
            ]
          }
        }
      },
      {
        description: '"body.inbound[0]" should have required property "yearMonth"',
        sentBody: {
          header: {
            name: 'Usage name between A1 and B1',
            version: '1.1',
            type: 'usage'
          },
          body: {
            inbound: [
              {
                homeTadig: "A_TADIG",
                visitorTadig: "ANOTHER_TADIG",
                service: "SMSMO",
                usage: 10
              }
            ],
            outbound: []
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.inbound[0] should have required property 'yearMonth'",
            errors: [
              {
                errorCode: "required.openapi.validation",
                message: "should have required property 'yearMonth'",
                path: ".body.body.inbound[0].yearMonth"
              }
            ]
          }
        }
      }
    ];
    /* eslint-enable quotes */

    testArray.forEach(function(test, index) {
      it(`Post usages FAILED. Case : ${test.description}`, function(done) {
        try {
          const path = globalVersion + '/contracts/' + contractDraft.id + '/usages/';

          chai.request(testsUtils.getServer())
            .post(`${path}`)
            .send(test.sentBody)
            .end((error, response) => {
              debug('response.body: %s', JSON.stringify(response.body));
              expect(error).to.be.null;
              expect(response).to.have.status(test.response.status);
              expect(response).to.be.json;
              expect(response.body).to.exist;
              expect(response.body).to.deep.equal(test.response.body);
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
});
