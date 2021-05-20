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
