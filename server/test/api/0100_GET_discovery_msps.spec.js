/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

const globalVersion = '/api/v1';
const route = '/discovery/msps/';

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API OK`, function() {
    it('Get msps OK without any msps in Blockchain', function(done) {
      try {
        nock.cleanAll();
        blockchainAdapterNock.get('/discovery/msps')
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/discovery/msps');
            expect(bodyReceived).to.be.empty;
            return [
              200,
              '[]',
              undefined
            ];
          });

        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body).have.members([]);

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get msps OK with 4 msps in Blockchain', function(done) {
      try {
        nock.cleanAll();
        blockchainAdapterNock.get('/discovery/msps')
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/discovery/msps');
            expect(bodyReceived).to.be.empty;
            return [
              200,
              '["TMUS","OrdererMSP","GSMA","DTAG"]',
              undefined
            ];
          });

        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body).have.members(['TMUS', 'OrdererMSP', 'GSMA', 'DTAG']);

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });
  });

  describe(`Setup and Test GET ${route} API FAILED`, function() {
    it('Get msps FAILED with Blockchain response parsing error', function(done) {
      try {
        nock.cleanAll();
        blockchainAdapterNock.get('/discovery/msps')
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/discovery/msps');
            expect(bodyReceived).to.be.empty;
            return [
              200,
              '["TMUS""]',
              undefined
            ];
          });

        const path = globalVersion + route;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(500);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['internalErrorCode', 'message', 'description']);
            expect(response.body).to.have.property('internalErrorCode', 3000);
            expect(response.body).to.have.property('message', 'Blockchain response parsing error');
            expect(response.body).to.have.property('description', 'It\'s not possible to parse the blockchain response.');

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

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
