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
const route = '/discovery/msps/{mspID}';

describe(`Tests GET ${route} API OK`, function() {
  describe(`Setup and Test GET ${route} API OK`, function() {
    it('Get msp OK', function(done) {
      try {
        const mspId = 'TMUS';

        blockchainAdapterNock.get('/discovery/msps/'+mspId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/discovery/msps/'+mspId);
            expect(bodyReceived).to.be.empty;
            /* eslint-disable max-len */
            return [
              200,
              `{
                "id":"${mspId}",
                "name":"${mspId}",
                "organizationalUnitIdentifiers":[],
                "rootCerts":"-----BEGIN CERTIFICATE-----\\nMIICjDCCAjKgAwIBAgIRAJjOaZHVFfxz/bB9d1yc1PEwCgYIKoZIzj0EAwIwgZYx\\nCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMREwDwYDVQQHEwhCZWxs\\nZXZ1ZTEaMBgGA1UECRMRMTI5MjAgU0UgMzh0aCBTdC4xDjAMBgNVBBETBTk4MDA2\\nMRcwFQYDVQQKEw50bXVzLm5vbWFkLmNvbTEaMBgGA1UEAxMRY2EudG11cy5ub21h\\nZC5jb20wHhcNMTgxMTI4MTE1MTAwWhcNMjgxMTI1MTE1MTAwWjCBljELMAkGA1UE\\nBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xETAPBgNVBAcTCEJlbGxldnVlMRow\\nGAYDVQQJExExMjkyMCBTRSAzOHRoIFN0LjEOMAwGA1UEERMFOTgwMDYxFzAVBgNV\\nBAoTDnRtdXMubm9tYWQuY29tMRowGAYDVQQDExFjYS50bXVzLm5vbWFkLmNvbTBZ\\nMBMGByqGSM49AgEGCCqGSM49AwEHA0IABB8UR3zwjLnUgr6EbOE1vRkKkyzytL2u\\nvqKfX2sdC4RbAmw0J1q+4d64+ibbuAddVEva47ISns6AZy1w0hbhzL+jXzBdMA4G\\nA1UdDwEB/wQEAwIBpjAPBgNVHSUECDAGBgRVHSUAMA8GA1UdEwEB/wQFMAMBAf8w\\nKQYDVR0OBCIEIHWOUIrrr8PDrzq8IcIOQsGbZxkP8IeruqYro/X12MeiMAoGCCqG\\nSM49BAMCA0gAMEUCIQDS1gduRFUWp5UIcJo2a92S4rqierH7y5TYp0llHXzvZwIg\\nbTLUISBrtW+IcyyFugLpBtRawj+T6Bn8duHp3gPiNSI=\\n-----END CERTIFICATE-----\\n",
                "intermediateCerts":"",
                "admins":"-----BEGIN CERTIFICATE-----\\nMIICdDCCAhqgAwIBAgIQS4Isx6q5locAzer4fabfBjAKBggqhkjOPQQDAjCBljEL\\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xETAPBgNVBAcTCEJlbGxl\\ndnVlMRowGAYDVQQJExExMjkyMCBTRSAzOHRoIFN0LjEOMAwGA1UEERMFOTgwMDYx\\nFzAVBgNVBAoTDnRtdXMubm9tYWQuY29tMRowGAYDVQQDExFjYS50bXVzLm5vbWFk\\nLmNvbTAeFw0xODExMjgxMTUxMDBaFw0yODExMjUxMTUxMDBaMIGRMQswCQYDVQQG\\nEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjERMA8GA1UEBxMIQmVsbGV2dWUxGjAY\\nBgNVBAkTETEyOTIwIFNFIDM4dGggU3QuMQ4wDAYDVQQREwU5ODAwNjEPMA0GA1UE\\nCxMGY2xpZW50MR0wGwYDVQQDDBRBZG1pbkB0bXVzLm5vbWFkLmNvbTBZMBMGByqG\\nSM49AgEGCCqGSM49AwEHA0IABLzmaCG+C37hqX4APK3RZCmO5DeI2Uo8gwHz9vx3\\nrX2vs1+YoNl+er+DXdl0Xr6D2HFkmRoZdhLUeLXgPL2D+4SjTTBLMA4GA1UdDwEB\\n/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIHWOUIrrr8PDrzq8IcIO\\nQsGbZxkP8IeruqYro/X12MeiMAoGCCqGSM49BAMCA0gAMEUCIQCUq4Lj8s/1g1Yv\\nfBRgdwMv8Rvrh+990zA0QPQ8FzgrQgIgFLhxCCceQSiQVBgjHB2BtXPjH7uxuUuC\\n/0CSy8/EDpU=\\n-----END CERTIFICATE-----\\n",
                "tlsRootCerts":"-----BEGIN CERTIFICATE-----\\nMIICkTCCAjegAwIBAgIQPXvcdY50e6vU83e2TzBMWzAKBggqhkjOPQQDAjCBmTEL\\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xETAPBgNVBAcTCEJlbGxl\\ndnVlMRowGAYDVQQJExExMjkyMCBTRSAzOHRoIFN0LjEOMAwGA1UEERMFOTgwMDYx\\nFzAVBgNVBAoTDnRtdXMubm9tYWQuY29tMR0wGwYDVQQDExR0bHNjYS50bXVzLm5v\\nbWFkLmNvbTAeFw0xODExMjgxMTUxMDBaFw0yODExMjUxMTUxMDBaMIGZMQswCQYD\\nVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjERMA8GA1UEBxMIQmVsbGV2dWUx\\nGjAYBgNVBAkTETEyOTIwIFNFIDM4dGggU3QuMQ4wDAYDVQQREwU5ODAwNjEXMBUG\\nA1UEChMOdG11cy5ub21hZC5jb20xHTAbBgNVBAMTFHRsc2NhLnRtdXMubm9tYWQu\\nY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAElx+paHNm79VHq18UVlJrvsU1\\nD2TUFNNA/B1iYvSJR2JSTuhLdbrsye9LSHRQJzpdSPweksrYQJxMoyqBUVa4VKNf\\nMF0wDgYDVR0PAQH/BAQDAgGmMA8GA1UdJQQIMAYGBFUdJQAwDwYDVR0TAQH/BAUw\\nAwEB/zApBgNVHQ4EIgQgf+ohdq5iJ7/Zj+1NhHpthwu2vBG+VvDzOzpiCdqOY5kw\\nCgYIKoZIzj0EAwIDSAAwRQIhAJ4/oXdr9o0sWsBiKyILIyx+4tfFWXRNGLJemb5i\\nQMV2AiBrX3ady0HfQzjIb0zviVDUclcxKkGzSVXqaNoi63fueg==\\n-----END CERTIFICATE-----\\n",
                "tlsIntermediateCerts":""
              }`,
              undefined
            ];
            /* eslint-enable max-len */
          });

        const path = globalVersion + '/discovery/msps/' + mspId;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['id', 'name', 'organizationalUnitIdentifiers', 'rootCerts', 'intermediateCerts', 'admins', 'tlsRootCerts', 'tlsIntermediateCerts']);

            expect(response.body).to.have.property('id', mspId);
            expect(response.body).to.have.property('name', mspId);
            expect(response.body).to.have.property('organizationalUnitIdentifiers').that.is.an('array');
            expect(response.body).to.have.property('rootCerts').that.is.a('string');
            expect(response.body).to.have.property('intermediateCerts').that.is.a('string');
            expect(response.body).to.have.property('admins').that.is.a('string');
            expect(response.body).to.have.property('tlsRootCerts').that.is.a('string');
            expect(response.body).to.have.property('tlsIntermediateCerts').that.is.a('string');

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });
  });

  describe(`Setup and Test GET ${route} API FAILED`, function() {
    it('Get msp FAILED with msp not found error', function(done) {
      try {
        const mspId = 'TMUSS';

        blockchainAdapterNock.get('/discovery/msps/'+mspId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/discovery/msps/'+mspId);
            expect(bodyReceived).to.be.empty;
            return [
              500,
              {message: `MSP 'TMUSS' not found.`},
              undefined
            ];
          });

        const path = globalVersion + '/discovery/msps/' + mspId;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(404);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['internalErrorCode', 'message', 'description']);
            expect(response.body).to.have.property('internalErrorCode', 3003);
            expect(response.body).to.have.property('message', 'Blockchain resource not found');
            expect(response.body).to.have.property('description', 'The requested URI or the requested Blockchain resource does not exist.');

            // expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

            done();
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    });

    it('Get msp FAILED with Blockchain response parsing error', function(done) {
      try {
        const mspId = 'TMUS';

        blockchainAdapterNock.get('/discovery/msps/'+mspId)
          .times(1)
          .reply((pathReceived, bodyReceived) => {
            // Only for exemple
            expect(pathReceived).to.equals('/discovery/msps/'+mspId);
            expect(bodyReceived).to.be.empty;
            /* eslint-disable max-len */
            return [
              200,
              `{
                ""id":"${mspId}",
                "name":"${mspId}",
                "organizationalUnitIdentifiers":[],
                "rootCerts":"-----BEGIN CERTIFICATE-----\\nMIICjDCCAjKgAwIBAgIRAJjOaZHVFfxz/bB9d1yc1PEwCgYIKoZIzj0EAwIwgZYx\\nCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMREwDwYDVQQHEwhCZWxs\\nZXZ1ZTEaMBgGA1UECRMRMTI5MjAgU0UgMzh0aCBTdC4xDjAMBgNVBBETBTk4MDA2\\nMRcwFQYDVQQKEw50bXVzLm5vbWFkLmNvbTEaMBgGA1UEAxMRY2EudG11cy5ub21h\\nZC5jb20wHhcNMTgxMTI4MTE1MTAwWhcNMjgxMTI1MTE1MTAwWjCBljELMAkGA1UE\\nBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xETAPBgNVBAcTCEJlbGxldnVlMRow\\nGAYDVQQJExExMjkyMCBTRSAzOHRoIFN0LjEOMAwGA1UEERMFOTgwMDYxFzAVBgNV\\nBAoTDnRtdXMubm9tYWQuY29tMRowGAYDVQQDExFjYS50bXVzLm5vbWFkLmNvbTBZ\\nMBMGByqGSM49AgEGCCqGSM49AwEHA0IABB8UR3zwjLnUgr6EbOE1vRkKkyzytL2u\\nvqKfX2sdC4RbAmw0J1q+4d64+ibbuAddVEva47ISns6AZy1w0hbhzL+jXzBdMA4G\\nA1UdDwEB/wQEAwIBpjAPBgNVHSUECDAGBgRVHSUAMA8GA1UdEwEB/wQFMAMBAf8w\\nKQYDVR0OBCIEIHWOUIrrr8PDrzq8IcIOQsGbZxkP8IeruqYro/X12MeiMAoGCCqG\\nSM49BAMCA0gAMEUCIQDS1gduRFUWp5UIcJo2a92S4rqierH7y5TYp0llHXzvZwIg\\nbTLUISBrtW+IcyyFugLpBtRawj+T6Bn8duHp3gPiNSI=\\n-----END CERTIFICATE-----\\n",
                "intermediateCerts":"",
                "admins":"-----BEGIN CERTIFICATE-----\\nMIICdDCCAhqgAwIBAgIQS4Isx6q5locAzer4fabfBjAKBggqhkjOPQQDAjCBljEL\\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xETAPBgNVBAcTCEJlbGxl\\ndnVlMRowGAYDVQQJExExMjkyMCBTRSAzOHRoIFN0LjEOMAwGA1UEERMFOTgwMDYx\\nFzAVBgNVBAoTDnRtdXMubm9tYWQuY29tMRowGAYDVQQDExFjYS50bXVzLm5vbWFk\\nLmNvbTAeFw0xODExMjgxMTUxMDBaFw0yODExMjUxMTUxMDBaMIGRMQswCQYDVQQG\\nEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjERMA8GA1UEBxMIQmVsbGV2dWUxGjAY\\nBgNVBAkTETEyOTIwIFNFIDM4dGggU3QuMQ4wDAYDVQQREwU5ODAwNjEPMA0GA1UE\\nCxMGY2xpZW50MR0wGwYDVQQDDBRBZG1pbkB0bXVzLm5vbWFkLmNvbTBZMBMGByqG\\nSM49AgEGCCqGSM49AwEHA0IABLzmaCG+C37hqX4APK3RZCmO5DeI2Uo8gwHz9vx3\\nrX2vs1+YoNl+er+DXdl0Xr6D2HFkmRoZdhLUeLXgPL2D+4SjTTBLMA4GA1UdDwEB\\n/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIHWOUIrrr8PDrzq8IcIO\\nQsGbZxkP8IeruqYro/X12MeiMAoGCCqGSM49BAMCA0gAMEUCIQCUq4Lj8s/1g1Yv\\nfBRgdwMv8Rvrh+990zA0QPQ8FzgrQgIgFLhxCCceQSiQVBgjHB2BtXPjH7uxuUuC\\n/0CSy8/EDpU=\\n-----END CERTIFICATE-----\\n",
                "tlsRootCerts":"-----BEGIN CERTIFICATE-----\\nMIICkTCCAjegAwIBAgIQPXvcdY50e6vU83e2TzBMWzAKBggqhkjOPQQDAjCBmTEL\\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xETAPBgNVBAcTCEJlbGxl\\ndnVlMRowGAYDVQQJExExMjkyMCBTRSAzOHRoIFN0LjEOMAwGA1UEERMFOTgwMDYx\\nFzAVBgNVBAoTDnRtdXMubm9tYWQuY29tMR0wGwYDVQQDExR0bHNjYS50bXVzLm5v\\nbWFkLmNvbTAeFw0xODExMjgxMTUxMDBaFw0yODExMjUxMTUxMDBaMIGZMQswCQYD\\nVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjERMA8GA1UEBxMIQmVsbGV2dWUx\\nGjAYBgNVBAkTETEyOTIwIFNFIDM4dGggU3QuMQ4wDAYDVQQREwU5ODAwNjEXMBUG\\nA1UEChMOdG11cy5ub21hZC5jb20xHTAbBgNVBAMTFHRsc2NhLnRtdXMubm9tYWQu\\nY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAElx+paHNm79VHq18UVlJrvsU1\\nD2TUFNNA/B1iYvSJR2JSTuhLdbrsye9LSHRQJzpdSPweksrYQJxMoyqBUVa4VKNf\\nMF0wDgYDVR0PAQH/BAQDAgGmMA8GA1UdJQQIMAYGBFUdJQAwDwYDVR0TAQH/BAUw\\nAwEB/zApBgNVHQ4EIgQgf+ohdq5iJ7/Zj+1NhHpthwu2vBG+VvDzOzpiCdqOY5kw\\nCgYIKoZIzj0EAwIDSAAwRQIhAJ4/oXdr9o0sWsBiKyILIyx+4tfFWXRNGLJemb5i\\nQMV2AiBrX3ady0HfQzjIb0zviVDUclcxKkGzSVXqaNoi63fueg==\\n-----END CERTIFICATE-----\\n",
                "tlsIntermediateCerts":""
              }`,
              undefined
            ];
            /* eslint-enable max-len */
          });

        const path = globalVersion + '/discovery/msps/' + mspId;
        chai.request(testsUtils.getServer())
          .get(`${path}`)
          .end((error, response) => {
            debug('response.status: %s', JSON.stringify(response.status));
            debug('response.body: %s', JSON.stringify(response.body));
            expect(error).to.be.null;
            expect(response).to.have.status(500);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('object');
            expect(Object.keys(response.body)).have.members(['internalErrorCode', 'message', 'description']);
            expect(response.body).to.have.property('internalErrorCode', 3000);
            expect(response.body).to.have.property('message', 'Blockchain response parsing error');
            expect(response.body).to.have.property('description', 'It\'s not possible to parse the blockchain response.');

            expect(blockchainAdapterNock.isDone(), 'Unconsumed nock error').to.be.true;

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
