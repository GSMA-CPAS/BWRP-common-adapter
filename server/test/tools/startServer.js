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

const testsUtils = require('../tools/testsUtils');
const debug = require('debug')('spec:startServer');

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

before((done) => {
  nock.cleanAll();

  if (process.env.COMMON_ADAPTER_SELF_MSPID === undefined) {
    // SELF MSPID not defined in env configuration
    blockchainAdapterNock.get('/status')
      .times(1)
      .reply((pathReceived, bodyReceived) => {
        // Only for exemple
        debug('Get status nock used');
        return [
          200,
          `{
            "hyperledger": {
              "localMSP": "${testsUtils.getSelfMspId()}"
            }
          }`,
          undefined
        ];
      });
  }

  blockchainAdapterNock.post('/webhooks/subscribe')
    .times(2)
    .reply((pathReceived, bodyReceived) => {
      // Only for exemple
      debug('Webhook subscribe nock used');
      return [
        201,
        '007' + bodyReceived.eventName + 'WWWZZZ',
        undefined
      ];
    });

  testsUtils.startServer()
    .then((startedServer) => {
      done();
    })
    .catch((beforeError) => {
      done(beforeError);
    });
});
