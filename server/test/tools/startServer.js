const testsUtils = require('../tools/testsUtils');
const debug = require('debug')('spec:startServer');

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

before((done) => {
  nock.cleanAll();
  blockchainAdapterNock.post('/webhooks/subscribe')
    .times(2)
    .reply((pathReceived, bodyReceived) => {
      // Only for exemple
      debug('Webhook subscribe nock used');
      return [
        201,
        '007' + bodyReceived.eventName + 'WWWZZZ',
        undefined
      ];
    });

  testsUtils.startServer()
    .then((startedServer) => {
      done();
    })
    .catch((beforeError) => {
      done(beforeError);
    });
});
