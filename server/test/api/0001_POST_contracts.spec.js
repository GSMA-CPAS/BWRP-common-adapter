const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/';

const DATE_REGEX = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$');

describe("Tests POST " + route + " API OK", function () {

  describe("Setup and Test POST " + route + " API with minimum contract details", function () {
    it('Post contracts OK with minimum contract details', function (done) {
      try {
        let path = globalVersion + route;

        let sentBody = {
          header: {
            name: "Contract name between A1 and B1",
            version: "1.1",
            type: "contract",
            fromMSP: {
              mspid: "A1"
            },
            toMSP: {
              mspid: "B1"
            }
          },
          body: {}
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            assert.equal(error, null);
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            assert.exists(response.body);
            expect(response.body).to.be.an('object');

            expect(response.body).to.have.property('contractID').that.is.a("string");
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            
            expect(response.body.header).to.have.property('fromMSP').that.is.an('object');
            expect(response.body.header.fromMSP).to.have.property('mspid', sentBody.header.fromMSP.mspid);
            expect(response.body.header.fromMSP).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMSP.signatures.length).to.equal(0);
            
            expect(response.body.header).to.have.property('toMSP').that.is.an('object');
            expect(response.body.header.toMSP).to.have.property('mspid', sentBody.header.toMSP.mspid);
            expect(response.body.header.toMSP).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMSP.signatures.length).to.equal(0);
            
            expect(response.body).to.have.property('body').that.is.an('object');
            expect(response.body.body).to.have.property('taps').that.is.an('array');
            expect(response.body.body.taps.length).to.equal(0);
            
            expect(response.body).to.have.property('history').that.is.an('array');
            expect(response.body.history.length).to.equal(1);
            expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body.history[0]).to.have.property('action', 'CREATION');
            
            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/,'')}/${response.body.contractID}`);

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