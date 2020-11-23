const testsUtils = require('../tools/testsUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/';

describe("Tests GET " + route + " API OK", function () {

  describe("Setup and Test GET " + route + " API without any contract in DB", function () {
    before(done => {
      debugSetup('TODO: Erase the database content');
      done();
    });

    it('Get contracts OK without any contract in DB', function (done) {
        try {
            let path = globalVersion + route;
            chai.request(testsUtils.getServer())
                .get(`${path}`)
                .end((error, response) => {
                    debug('response.body: %s', response.body);
                    assert.equal(error, null);
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    assert.exists(response.body);
                    expect(response.body).to.be.an('array');
                    expect(response.body.length).to.equal(0);
                    done();
                });
        } catch (exception) {
            debug('exception: %s', exception.stack);
            assert.ok(false);
            done();
        }
    });
  });

});