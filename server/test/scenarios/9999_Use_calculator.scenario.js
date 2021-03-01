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

/* eslint-disable camelcase */
const CALCULATOR_API = `http://127.0.0.1:6060`;

const configured_JSON_DTAG_contract_body_to_create = require('./0003_data/0003_JSON_DTAG_contract_body_to_create.json');
const configured_JSON_TMUS_usage_body_to_create = require('./0003_data/0003_JSON_TMUS_usage_body_to_create.json');

describe.skip(`Launch scenario 9999_Use_calculator`, function() {
  before((done) => {
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
      usage: configured_JSON_TMUS_usage_body_to_create.data
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

          expect(response.body.intermediateResults.length).to.equals(8);
          response.body.intermediateResults.forEach((element) => {
            expect(Object.keys(element)).have.members(['service', 'homeTadigs', 'visitorTadigs', 'dealValue']);
            expect(element).to.have.property('service').that.is.a('string');
            expect(element).to.have.property('homeTadigs').that.is.a('array');
            expect(element).to.have.property('visitorTadigs').that.is.a('array');
            expect(element).to.have.property('dealValue').that.is.a('string');
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