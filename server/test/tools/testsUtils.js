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
    return crypto.createHash('sha256').update(`${msp}${referenceId}`).digest('hex').toString('utf8');
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
