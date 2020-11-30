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
});
