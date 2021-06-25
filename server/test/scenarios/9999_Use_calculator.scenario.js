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
const debugAction = require('debug')('spec:action');
const debugObjectOnTMUS = require('debug')('spec:TMUS-side:object');
const debugObjectOnDTAG = require('debug')('spec:DTAG-side:object');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const skipFlag = (process.env.MOCHA_SCENARIO_FILTER !== '') && (process.env.MOCHA_SCENARIO_FILTER !== '9999');

/* eslint-disable camelcase */
const CALCULATOR_API = `http://127.0.0.1:6060`;

const datasetName = (process.env.MOCHA_SCENARIO_0003_DATASET !== undefined) && (process.env.MOCHA_SCENARIO_0003_DATASET !== '') ? process.env.MOCHA_SCENARIO_0003_DATASET : 'initial_dataset_on_discrepancy_service';
const datasetPath = `./0003_data/${datasetName}`;

const configured_JSON_DTAG_contract_body_to_create = require(`${datasetPath}/0003_JSON_DTAG_contract_body_to_create.json`);
const configured_JSON_TMUS_usage_body_to_create = require(`${datasetPath}/0003_JSON_TMUS_usage_body_to_create.json`);

describe.skip(`Launch scenario 9999_Use_calculator`, function() {
  before(function(done) {
    if (skipFlag) {
      this.skip();
    }
    debugSetup('==> verify that CALCULATOR API is UP');
    try {
      chai.request(CALCULATOR_API)
        .get(`/swagger/index.html`)
        .end((error, response) => {
          debug('response.body: %s', JSON.stringify(response.body));
          expect(response).to.have.status(200);
          done();
        });
    } catch (exception) {
      debugSetup('Error during scenario setup : ', exception);
      debugSetup('==> failed!');
      expect.fail('scenario test throws an exception');
    }
  });

  it(`Calculate from 0003_data`, function(done) {
    debugAction(`${this.test.title}`);

    const sentBody = {
      discounts: configured_JSON_DTAG_contract_body_to_create.discounts,
      usage: {
        inbound: configured_JSON_TMUS_usage_body_to_create.inbound.filter((s) => (s.service === 'SMSMO')),
        outbound: configured_JSON_TMUS_usage_body_to_create.outbound.filter((s) => (s.service === 'SMSMO'))
      }
    };

    try {
      chai.request(CALCULATOR_API)
        .post(`/calculate`)
        .send(sentBody)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('intermediateResults').that.is.an('array');

          debug('response.body.intermediateResults = ', response.body.intermediateResults);

          expect(response.body.intermediateResults.length).to.equals(11);
          response.body.intermediateResults.forEach((element) => {
            expect(Object.keys(element)).have.members(['service', 'homeTadigs', 'visitorTadigs', 'dealValue', 'shortOfCommitment', 'usage', 'type']);
            expect(element).to.have.property('service').that.is.a('string');
            expect(element).to.have.property('homeTadigs').that.is.a('array');
            expect(element).to.have.property('visitorTadigs').that.is.a('array');
            expect(element).to.have.property('dealValue').that.is.a('number');
            expect(element).to.have.property('shortOfCommitment').that.is.a('number');
            expect(element).to.have.property('usage').that.is.a('number');
            expect(element).to.have.property('type').that.matches(new RegExp('^(inbound|outbound|)$'));
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
/* eslint-enable camelcase */
