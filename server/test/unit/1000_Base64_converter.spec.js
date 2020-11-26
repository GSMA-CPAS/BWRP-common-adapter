const testsUtils = require('../tools/testsUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;

describe("Unit Tests for base64 converter", function () {

  it('Should convert from base64 to string', function (done) {
    base64EncodedString = "SGVsbG8gd29ybGQ=";
    debug('base64EncodedString: %s', base64EncodedString);
    const decodedString = Buffer.from(base64EncodedString, 'base64').toString();
    debug('decodedString: %s', decodedString);

    for(var i of ["id1", "id2"]) {
        debug(i)
    }

    done();
  });

});