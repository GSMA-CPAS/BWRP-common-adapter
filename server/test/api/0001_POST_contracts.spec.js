const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');

const chai = require('chai');
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
            fromMsp: {
              mspId: "A1"
            },
            toMsp: {
              mspId: "B1"
            }
          },
          body: {}
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(["contractId", "state", "creationDate", "lastModificationDate", "header", "body"]);

            expect(response.body).to.have.property('contractId').that.is.a("string");
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(["name", "type", "version", "fromMsp", "toMsp"]);
            expect(response.body.header).to.have.property('name', sentBody.header.name);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            
            expect(response.body.header).to.have.property('fromMsp').that.is.an('object');
            expect(Object.keys(response.body.header.fromMsp)).have.members(["mspId", "signatures"]);
            expect(response.body.header.fromMsp).to.have.property('mspId', sentBody.header.fromMsp.mspId);
            expect(response.body.header.fromMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.fromMsp.signatures.length).to.equal(0);
            
            expect(response.body.header).to.have.property('toMsp').that.is.an('object');
            expect(Object.keys(response.body.header.toMsp)).have.members(["mspId", "signatures"]);
            expect(response.body.header.toMsp).to.have.property('mspId', sentBody.header.toMsp.mspId);
            expect(response.body.header.toMsp).to.have.property('signatures').that.is.an('array');
            expect(response.body.header.toMsp.signatures.length).to.equal(0);
            
            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members([]);
            
            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(1);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');
            
            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/,'')}/${response.body.contractId}`);

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });
  });

});