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

describe(`Tests POST ${route} API OK`, function() {
  describe(`Setup and Test POST ${route} API with minimum contract details`, function() {
    it('Post contracts OK with minimum contract details', function(done) {
      try {
        const path = globalVersion + route;

        const sentBody = {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
          },
          body: {}
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
            expect(Object.keys(response.body)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('contractId').that.is.a('string');
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['type', 'version', 'msps']);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            expect(response.body.header).to.have.property('msps').that.is.an('object');

            expect(Object.keys(response.body.header.msps)).have.members([sentBody.header.fromMsp.mspId, sentBody.header.toMsp.mspId]);
            expect(response.body.header.msps[sentBody.header.fromMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps[sentBody.header.toMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps[sentBody.header.fromMsp.mspId].signatures.length).to.equal(0);
            expect(response.body.header.msps[sentBody.header.toMsp.mspId].signatures.length).to.equal(0);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members([]);

            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(1);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/, '')}/${response.body.contractId}`);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });
  });

  describe(`Setup and Test POST ${route} API with the other header schema in contract`, function() {
    it('Post contracts OK with the other header schema in contract', function(done) {
      try {
        const path = globalVersion + route;

        const sentBody = {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            msps: {
              B1: {
                signatures: [],
                minSignatures: 1,
                nbOfsignatures: 1
              }
            }
          },
          body: {}
        };

        sentBody.header.msps[testsUtils.getSelfMspId()] = {
          signatures: [],
          minSignatures: 1,
          nbOfsignatures: 1
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
            expect(Object.keys(response.body)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('contractId').that.is.a('string');
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['type', 'version', 'msps']);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            expect(response.body.header).to.have.property('msps').that.is.an('object');

            expect(Object.keys(response.body.header.msps)).have.members(Object.keys(sentBody.header.msps));
            expect(response.body.header.msps[testsUtils.getSelfMspId()]).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps['B1']).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps[testsUtils.getSelfMspId()].signatures.length).to.equal(0);
            expect(response.body.header.msps['B1'].signatures.length).to.equal(0);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members([]);

            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(1);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/, '')}/${response.body.contractId}`);

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
    const path = globalVersion + route;
    /* eslint-disable quotes */
    const testArray = [
      {
        description: 'Empty contract',
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
        description: '"body.version" should be string',
        sentBody: {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
          },
          body: {
            version: 1
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.version should be string",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be string",
                path: ".body.body.version"
              }
            ]
          }
        }
      },
      {
        description: '"body.metadata.authors" should be string',
        sentBody: {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
          },
          body: {
            version: "1",
            metadata: {
              name: "ContractName",
              authors: ["AAA", "BBB"]
            }
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
        description: '"body.discounts[\'msp2\'].serviceGroups" should be array',
        sentBody: {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
          },
          body: {
            version: "1",
            metadata: {
              name: "ContractName",
              authors: "ME"
            },
            discounts: {
              msp1: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: []
              },
              msp2: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: {}
              }
            }
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.discounts['msp2'].serviceGroups should be array",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be array",
                path: ".body.body.discounts['msp2'].serviceGroups"
              }
            ]
          }
        }
      },
      {
        description: '"body.discounts should NOT have fewer than 2 properties',
        sentBody: {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
          },
          body: {
            version: "1",
            metadata: {
              name: "ContractName",
              authors: "ME"
            },
            discounts: {
              msp1: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: []
              }
            }
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.discounts should NOT have fewer than 2 properties",
            errors: [
              {
                errorCode: "minProperties.openapi.validation",
                message: "should NOT have fewer than 2 properties",
                path: ".body.body.discounts"
              }
            ]
          }
        }
      },
      {
        description: '"body.discounts should NOT have more than 2 properties',
        sentBody: {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
          },
          body: {
            version: "1",
            metadata: {
              name: "ContractName",
              authors: "ME"
            },
            discounts: {
              msp1: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: []
              },
              msp2: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: []
              },
              msp3: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: []
              }
            }
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.discounts should NOT have more than 2 properties",
            errors: [
              {
                errorCode: "maxProperties.openapi.validation",
                message: "should NOT have more than 2 properties",
                path: ".body.body.discounts"
              }
            ]
          }
        }
      },
      {
        description: '"body.discounts[\'msp2\'].serviceGroups[0].services[0].usagePricing.ratingPlan.rate.thresholds[1].linearPrice" should be number',
        sentBody: {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
          },
          body: {
            version: "1",
            metadata: {
              name: "ContractName",
              authors: "ME"
            },
            discounts: {
              msp1: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: []
              },
              msp2: {
                condition: {
                  kind: "Unconditional"
                },
                serviceGroups: [
                  {
                    homeTadigs: [],
                    visitorTadigs: [],
                    services: [
                      {
                        service: "SMSMO",
                        usagePricing: {
                          unit: "eur",
                          ratingPlan: {
                            kind: "Linear rate",
                            rate: {
                              thresholds: [
                                {
                                  start: 0,
                                  linearPrice: 0.256
                                },
                                {
                                  start: 5000,
                                  linearPrice: "0.050"
                                }
                              ]
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        response: {
          status: 400,
          body: {
            message: "request.body.body.discounts['msp2'].serviceGroups[0].services[0].usagePricing.ratingPlan.rate.thresholds[1].linearPrice should be number",
            errors: [
              {
                errorCode: "type.openapi.validation",
                message: "should be number",
                path: ".body.body.discounts['msp2'].serviceGroups[0].services[0].usagePricing.ratingPlan.rate.thresholds[1].linearPrice"
              }
            ]
          }
        }
      }
    ];
    /* eslint-enable quotes */

    testArray.forEach(function(test, index) {
      it(`Post contracts FAILED. Case : ${test.description}`, function(done) {
        try {
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
