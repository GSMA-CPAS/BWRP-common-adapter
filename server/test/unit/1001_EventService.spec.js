/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const testedEventService = require('../../services/EventService');

const expect = require('chai').expect;

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

const selfHostUrl = testsUtils.getSelfHostUrl();

describe('Unit Tests for events subscription', function() {
  it('Should send subscription to events in the Blockchain', function(done) {
    blockchainAdapterNock.post('/webhooks/subscribe')
      .times(2)
      .reply((pathReceived, bodyReceived) => {
        // Only for exemple
        expect(pathReceived).to.equals('/webhooks/subscribe');
        expect(bodyReceived).to.be.an('Object');
        expect(bodyReceived).to.have.property('eventName').that.match(new RegExp('^(STORE:PAYLOADLINK|STORE:SIGNATURE)$'));
        expect(bodyReceived).to.have.property('callbackUrl', selfHostUrl + '/api/v1/contracts/event/');
        return [
          201,
          '07473280-3b23-41bf-bff1-cb37e695895' + ((bodyReceived.eventName === 'STORE:PAYLOADLINK') ? '1' : '2'),
          undefined
        ];
      });

    testedEventService.subscribe()
      .then((resp) => {
        try {
          expect(resp).to.be.an('Object');
          expect(resp.payload).to.be.an('Array');
          expect(resp.payload).to.have.members(['07473280-3b23-41bf-bff1-cb37e6958951', '07473280-3b23-41bf-bff1-cb37e6958952']);

          expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

          done();
        } catch (expectError) {
          // Don't fail otherwise
          done(expectError);
        }
      })
      .catch((error) => {
        debug('error: %s', error.stack);
        expect.fail('it test returns an error');
        done();
      });
  });
});
