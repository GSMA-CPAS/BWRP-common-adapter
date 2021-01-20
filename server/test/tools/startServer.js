const testsUtils = require('../tools/testsUtils');
const debug = require('debug')('spec:startServer');

const nock = require('nock');
const blockchainAdapterNock = nock(testsUtils.getBlockchainAdapterUrl());

before((done) => {
  nock.cleanAll();

  if (process.env.COMMON_ADAPTER_SELF_MSPID === undefined) {
    // SELF MSPID not defined in env configuration
    blockchainAdapterNock.get('/status')
      .times(1)
      .reply((pathReceived, bodyReceived) => {
        // Only for exemple
        debug('Get status nock used');
        return [
          200,
          `{
            "hyperledger": {
              "localMSP": "${testsUtils.getSelfMspId()}"
            }
          }`,
          undefined
        ];
      });
  }

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
