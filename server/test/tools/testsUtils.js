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

const debug = require('debug')('spec:testsUtils');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const testEnv = require('../env.json');

let app = undefined;

const nock = require('nock');
const crypto = require('crypto');

beforeEach(() => {
  console.log('  --  --  --  --  --  --  --  --  --  ');
  nock.cleanAll();
});

class TestsUtils {
  static startServer() {
    return new Promise((resolve, reject) => {
      if (app === undefined) {
        debug('app never started. Start the app.');
        app = require('../../index.js');
        debug('Wait server starting');
        setTimeout(() => {
          debug('Server started');
          resolve(app);
        }, 4000);
      } else {
        debug('app already started. Return the app.');
        resolve(app);
      }
    });
  }

  static getServer() {
    return app;
  }

  static defineRandomValue() {
    return String(Date.now()) + ((Math.random() * 100) | 1);
  }

  static getCalculationServiceUrl() {
    return testEnv.COMMON_ADAPTER_CALCULATION_SERVICE_URL;
  }

  static getBlockchainAdapterUrl() {
    return testEnv.COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_URL;
  }

  static getSelfHostUrl() {
    return testEnv.COMMON_ADAPTER_SELF_HOST;
  }

  static getSelfMspId() {
    return 'ORAGR';
  }

  static getDateRegexp() {
    // eslint-disable-next-line no-useless-escape
    return new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');
  }

  static getStorageKey(referenceId, msp) {
    return crypto.createHash('sha256').update(`${msp}:${referenceId}`).digest('hex').toString('utf8');
  }

  static debugWarning(text, symbol = '!') {
    const textLength = text.length;
    const textSizeInWarning = ( textLength > 30 ) ? textLength : 30;
    const getChars = (char, number) => {
      let returnedChars = '';
      for (let i = 0; i<number; i++) {
        returnedChars += char;
      }
      return returnedChars;
    };
    debug(` ___________${getChars('_', textSizeInWarning)}__ `);
    debug(`|           ${getChars(' ', textSizeInWarning)}  |`);
    debug(`|    ^      ${getChars(' ', textSizeInWarning)}  |`);
    debug(`|  / ${symbol} \\    ${text}${getChars(' ', textSizeInWarning - textLength)}  |`);
    debug(`|  -----    ${getChars(' ', textSizeInWarning)}  |`);
    debug(`|           ${getChars(' ', textSizeInWarning)}  |`);
    debug(` -----------${getChars('-', textSizeInWarning)}-- `);
  }
}

module.exports = TestsUtils;
