/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

const globalVersion = '/api/v1';
const route = '/contracts/event/';

describe(`Tests POST ${route} API OK`, function() {
  describe(`Setup and Test POST ${route} API with minimum event details`, function() {
    it('Post event OK with minimum event details and only contracts in blockchain', function(done) {
      try {
        const path = globalVersion + route;
        const storageKey = 'd22bafe6e5b661e9f7b992889c6602638c885793a81226943618ecf1aa19d486';

        const idDocument1 = 'shuzahxazhxijazechxhuezhasqxsdchezu';
        const document1 = `{
          "type": "contract",
          "version": "2.1",
          "name": "StRiNg-Doc1-${Date.now().toString()}",
          "body": {
            "oneKey": "oneKeyValue",
            "otherKey": "otherKeyValue"
          }
        }`;
        const encodedDocument1 = Buffer.from(document1).toString('base64');

        const idDocument2 = 'zecxezhucheauhxazi';
        const document2 = `{
          "type": "contract",
          "version": "1.8",
          "name": "StRiNg-Doc2-${Date.now().toString()}",
          "body": {
            "test": "1"
          }
        }`;
        const encodedDocument2 = Buffer.from(document2).toString('base64');

        blockchainAdapterNock.get('/private-documents')
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/private-documents');
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `["${idDocument1}", "${idDocument2}"]`,
              undefined
            ];
          });

        blockchainAdapterNock.get(`/private-documents/${idDocument1}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument1}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `{
                "fromMSP":"DTAG",
                "toMSP":"TMUS",
                "data":"${encodedDocument1}",
                "dataHash":"notUsed",
                "timeStamp":"1606828827767664800",
                "id":"d22bafe6e5b661e9f7b992889c6602638c885793a81226943618ecf1aa19d486"
              }`,
              undefined
            ];
          });

        blockchainAdapterNock.get(`/private-documents/${idDocument2}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument2}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              `{
                "fromMSP":"DTAG",
                "toMSP":"TMUS",
                "data":"${encodedDocument2}",
                "dataHash":"notUsed",
                "timeStamp":"1606828827767664800",
                "id":"dezzedzegzxzaxgzuxzeuxgzecgecezdgscgze"
              }`,
              undefined
            ];
          });

        blockchainAdapterNock.delete(`/private-documents/${idDocument1}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument1}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              ``,
              undefined
            ];
          });

        blockchainAdapterNock.delete(`/private-documents/${idDocument2}`)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals(`/private-documents/${idDocument2}`);
            expect(bodyReceived).to.be.empty;
            return [
              200,
              ``,
              undefined
            ];
          });

        const sentBody = {
          msp: 'DTAG',
          eventName: 'STORE:DOCUMENTHASH',
          timestamp: '2020-11-30T16:59:35Z',
          data: {
            storageKey: storageKey
          }
        };

        chai.request(testsUtils.getServer())
          .post(`${path}`)
          .send(sentBody)
          .end((error, response) => {
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);

            response.body.forEach((bodyArrayContent) => {
              expect(bodyArrayContent).to.be.an('Object');
              expect(Object.keys(bodyArrayContent)).have.members(['id', 'type', 'documentId']);
              expect(bodyArrayContent).to.have.property('id').that.is.a('String');
              expect(bodyArrayContent).to.have.property('type', 'contract');
              expect(bodyArrayContent).to.have.property('documentId').that.is.a('String');
            });

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            chai.request(testsUtils.getServer())
              .get(`${globalVersion}/contracts/${response.body[0].id}`)
              .send()
              .end((getError1, getResponse1) => {
                debug('response.body: %s', JSON.stringify(getResponse1.body));
                expect(getError1).to.be.null;
                expect(getResponse1).to.have.status(200);
                expect(getResponse1).to.be.json;
                expect(getResponse1.body).to.exist;
                expect(getResponse1.body).to.be.an('object');
                expect(getResponse1.body).to.have.property('state', 'RECEIVED');

                chai.request(testsUtils.getServer())
                  .get(`${globalVersion}/contracts/${response.body[1].id}`)
                  .send()
                  .end((getError2, getResponse2) => {
                    debug('response.body: %s', JSON.stringify(getResponse2.body));
                    expect(getError2).to.be.null;
                    expect(getResponse2).to.have.status(200);
                    expect(getResponse2).to.be.json;
                    expect(getResponse2.body).to.exist;
                    expect(getResponse2.body).to.be.an('object');
                    expect(getResponse2.body).to.have.property('state', 'RECEIVED');

                    done();
                  });
              });
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });
  });
});
