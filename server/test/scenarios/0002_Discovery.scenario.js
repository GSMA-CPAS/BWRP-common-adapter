/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
const debugAction = require('debug')('spec:action');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const skipFlag = (process.env.MOCHA_SCENARIO_FILTER !== '') && (process.env.MOCHA_SCENARIO_FILTER !== '0002');

const DATE_REGEX = testsUtils.getDateRegexp();

/* eslint-disable camelcase */
const DTAG_API = `http://127.0.0.1:3030/api/v1`;
const TMUS_API = `http://127.0.0.1:3040/api/v1`;

describe(`Launch scenario 0002_Discovery`, function() {
  before(function(done) {
    if (skipFlag) {
      this.skip();
    }
    debugSetup('==> verify that DTAG and TMUS APIs are UP');
    try {
      chai.request(DTAG_API)
        .get(`/status`)
        .end((error, response) => {
          debug('response.body: %s', JSON.stringify(response.body));
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.have.property('commitHash');
          expect(response.body).to.have.property('apiHash');
          expect(response.body).to.have.property('apiVersion');
          chai.request(TMUS_API)
            .get(`/status`)
            .end((error, response) => {
              debug('response.body: %s', JSON.stringify(response.body));
              expect(error).to.be.null;
              expect(response).to.have.status(200);
              expect(response).to.be.json;
              expect(response.body).to.exist;
              expect(response.body).to.have.property('commitHash');
              expect(response.body).to.have.property('apiHash');
              expect(response.body).to.have.property('apiVersion');

              debugSetup('==> they are UP');
              done();
            });
        });
    } catch (exception) {
      debugSetup('Error during scenario setup : ', exception);
      debugSetup('==> failed!');
      expect.fail('scenario test throws an exception');
    }
  });

  // Create and use 'discovery' endpoints

  it(`Get all MSPs on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      chai.request(DTAG_API)
        .get(`/discovery/msps`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body).to.have.members(['TMUS', 'GSMA', 'DTAG', 'OrdererMSP']);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get TMUS MSP on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      chai.request(DTAG_API)
        .get(`/discovery/msps/TMUS`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('id', 'TMUS');
          expect(response.body).to.have.property('name', 'TMUS');
          expect(response.body).to.have.property('organizationalUnitIdentifiers').that.is.an('array');
          expect(response.body).to.have.property('rootCerts').that.is.a('string');
          expect(response.body).to.have.property('intermediateCerts').that.is.a('string');
          expect(response.body).to.have.property('admins').that.is.a('string');
          expect(response.body).to.have.property('tlsRootCerts').that.is.a('string');
          expect(response.body).to.have.property('tlsIntermediateCerts').that.is.a('string');

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get all MSPs on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      chai.request(TMUS_API)
        .get(`/discovery/msps`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body).to.have.members(['TMUS', 'GSMA', 'DTAG', 'OrdererMSP']);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get GSMA MSP on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      chai.request(TMUS_API)
        .get(`/discovery/msps/GSMA`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('id', 'GSMA');
          expect(response.body).to.have.property('name', 'GSMA');
          expect(response.body).to.have.property('organizationalUnitIdentifiers').that.is.an('array');
          expect(response.body).to.have.property('rootCerts').that.is.a('string');
          expect(response.body).to.have.property('intermediateCerts').that.is.a('string');
          expect(response.body).to.have.property('admins').that.is.a('string');
          expect(response.body).to.have.property('tlsRootCerts').that.is.a('string');
          expect(response.body).to.have.property('tlsIntermediateCerts').that.is.a('string');

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
