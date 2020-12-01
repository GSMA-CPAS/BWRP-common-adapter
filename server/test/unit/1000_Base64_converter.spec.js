/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

describe('Unit Tests for base64 converter', function() {
  it('Should convert from base64 to string', function(done) {
    const base64EncodedString = 'SGVsbG8gd29ybGQ=';
    debug('base64EncodedString: %s', base64EncodedString);
    const decodedString = Buffer.from(base64EncodedString, 'base64').toString();
    debug('decodedString: %s', decodedString);

    done();
  });
  it('Should convert from string to base64', function(done) {
    const stringToEncode = `{
      "type": "contract",
      "version": "2.1",
      "body": {
        "name": "StRiNg-${Date.now().toString()}"
      }
    }`;
    debug('stringToEncode: %s', stringToEncode);
    const encodedString = Buffer.from(stringToEncode).toString('base64');
    debug('encodedString: %s', encodedString);

    done();
  });
});
