const debug = require('debug')('spec:testsUtils');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);


let app = undefined;

beforeEach(() => {
  console.log('  --  --  --  --  --  --  --  --  --  ');
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
    return 'http://127.0.0.1:8081';
  }

  static getDateRegexp() {
    // eslint-disable-next-line no-useless-escape
    return new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');
  }
}

module.exports = TestsUtils;
