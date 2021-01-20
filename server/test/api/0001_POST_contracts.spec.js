/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/';

const DATE_REGEX = testsUtils.getDateRegexp();

describe(`Tests POST ${route} API OK`, function() {
  describe(`Setup and Test POST ${route} API with minimum contract details`, function() {
    it('Post contracts OK with minimum contract details', function(done) {
      try {
        const path = globalVersion + route;

        const sentBody = {
          header: {
            name: 'Contract name between A1 and B1',
            version: '1.1',
            type: 'contract',
            fromMsp: {mspId: 'A1'},
            toMsp: {mspId: 'B1'}
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
            expect(Object.keys(response.body)).have.members(['contractId', 'state', 'creationDate', 'lastModificationDate', 'header', 'body']);

            expect(response.body).to.have.property('contractId').that.is.a('string');
            expect(response.body).to.have.property('state', 'DRAFT');
            expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
            expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

            expect(response.body).to.have.property('header').that.is.an('object');
            expect(Object.keys(response.body.header)).have.members(['type', 'version', 'msps']);
            expect(response.body.header).to.have.property('type', sentBody.header.type);
            expect(response.body.header).to.have.property('version', sentBody.header.version);
            expect(response.body.header).to.have.property('msps').that.is.an('object');

            expect(Object.keys(response.body.header.msps)).have.members([sentBody.header.fromMsp.mspId, sentBody.header.toMsp.mspId]);
            expect(response.body.header.msps[sentBody.header.fromMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps[sentBody.header.toMsp.mspId]).to.have.property('signatures').to.be.an('array');
            expect(response.body.header.msps[sentBody.header.fromMsp.mspId].signatures.length).to.equal(0);
            expect(response.body.header.msps[sentBody.header.toMsp.mspId].signatures.length).to.equal(0);

            expect(response.body).to.have.property('body').that.is.an('object');
            expect(Object.keys(response.body.body)).have.members([]);

            // expect(response.body).to.have.property('history').that.is.an('array');
            // expect(response.body.history.length).to.equal(1);
            // expect(Object.keys(response.body.history[0])).have.members(["date", "action"]);
            // expect(response.body.history[0]).to.have.property('date').that.is.a('string').and.match(DATE_REGEX);
            // expect(response.body.history[0]).to.have.property('action', 'CREATION');

            expect(response.headers).to.have.property('content-location', `${path.replace(/\/$/, '')}/${response.body.contractId}`);

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
