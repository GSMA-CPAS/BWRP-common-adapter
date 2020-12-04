/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */
const expect = require('chai').expect;
const sjcl = require('sjcl');

describe('Unit Tests for base64 converter and sha256', function() {
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

  it('Should compute storageKey from targetMSPID  documentID ', function(done) {
    const expectedHash = 'ad756b1cecacb073fa4808f5a754515e033f6b1b3247153d65b6510ae4c9bb49';
    const targetMSPID = 'TMUS';
    const documentID = '25d69d4c660d68cbc09c100924628afa68e0e309e13acb04d5d8c2c55d542aa5';
    const sha256Hash01 = sjcl.hash.sha256.hash(targetMSPID + documentID);
    const hexStringOfsha256Hash01 = sjcl.codec.hex.fromBits(sha256Hash01);
    debug('Computed storageKey using sjcl = : %s', hexStringOfsha256Hash01);


    expect(hexStringOfsha256Hash01).to.equals(expectedHash);

    done();
  });
});
