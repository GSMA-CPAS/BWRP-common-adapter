/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
const debugObjectOnTMUS = require('debug')('spec:TMUS-side:object');
const debugObjectOnDTAG = require('debug')('spec:DTAG-side:object');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const DATE_REGEX = testsUtils.getDateRegexp();

/* eslint-disable camelcase */
const DTAG_API = `http://127.0.0.1:3030/api/v1`;
const TMUS_API = `http://127.0.0.1:3040/api/v1`;

const DTAG_create_contract_body = {
  header: {
    name: 'Contract name for scenario 0000_From_DTAG_contract between DTAG and TMUS',
    version: '1.1',
    type: 'contract',
    fromMsp: {mspId: 'DTAG'},
    toMsp: {mspId: 'TMUS'}
  },
  body: {
    generalInformation: {
      name: 'Nae',
      type: 'Special',
      startDate: '2020-05-01T00:00:00.000Z',
      endDate: '2020-12-01T00:00:00.000Z',
      prolongationLength: null,
      taxesIncluded: true,
      authors: 'fd',
      TMUS: {
        currencyForAllDiscounts: 'JPY',
        tadigCodes: {
          codes: 'dfd',
          includeContractParty: true
        }
      },
      DTAG: {
        currencyForAllDiscounts: 'EUR',
        tadigCodes: {
          codes: 'fds',
          includeContractParty: false
        }
      }
    }
  }
};

const configured_JSON_DTAG_usage_body_to_create = require('./0001_data/0001_JSON_DTAG_usage_body_to_create.json');
const DTAG_create_usage_body = {
  header: {
    name: `Usage from DTAG to TMUS created the ${new Date().toJSON()}`,
    type: 'usage',
    version: '8.2'
  },
  body: configured_JSON_DTAG_usage_body_to_create
};

const configured_JSON_TMUS_usage_body_to_create = require('./0001_data/0001_JSON_TMUS_usage_body_to_create.json');
const TMUS_create_usage_body = {
  header: {
    name: `Usage from TMUS to DTAG created the ${new Date().toJSON()}`,
    type: 'usage',
    version: '9.3'
  },
  body: configured_JSON_TMUS_usage_body_to_create
};

const DTAG_dynamic_data = {
  contractId: undefined,
  contractReferenceId: undefined,
  usageId: undefined,
  settlementId: undefined,
  settlementReferenceId: undefined,
  receivedSettlementId: undefined
};

const TMUS_dynamic_data = {
  receivedContractId: undefined,
  usageId: undefined,
  settlementId: undefined,
  settlementReferenceId: undefined,
  receivedSettlementId: undefined
};

describe(`Launch scenario 0001_Create_settlement_from_DTAG_contract`, function() {
  before((done) => {
    debugSetup('==> verify that DTAG and TMUS APIs are UP');
    try {
      chai.request(DTAG_API)
        .get(`/status`)
        .end((error, response) => {
          debug('response.body: %s', JSON.stringify(response.body));
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.have.property('commitHash', 'unknown');
          expect(response.body).to.have.property('apiHash', 'unknown');
          expect(response.body).to.have.property('apiVersion', '?.?.?');
          chai.request(TMUS_API)
            .get(`/status`)
            .end((error, response) => {
              debug('response.body: %s', JSON.stringify(response.body));
              expect(error).to.be.null;
              expect(response).to.have.status(200);
              expect(response).to.be.json;
              expect(response.body).to.exist;
              expect(response.body).to.have.property('commitHash', 'unknown');
              expect(response.body).to.have.property('apiHash', 'unknown');
              expect(response.body).to.have.property('apiVersion', '?.?.?');

              debugSetup('==> they are UP');
              done();
            });
        });
    } catch (exception) {
      debugSetup('Error during scenario setup : ', exception);
      debugSetup('==> failed!');
      expect.fail('scenario test throws an exception');
    }
  });

  // Create and use 'contract' endpoints

  it.skip(`Delete all DTAG existing contracts`, function(done) {
    // Not usefull
  });

  it.skip(`Delete all TMUS existing contracts`, function(done) {
    // Not usefull
  });

  it(`Create a new DTAG contract`, function(done) {
    try {
      chai.request(DTAG_API)
        .post(`/contracts/`)
        .send(DTAG_create_contract_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId').that.is.a('string');
          expect(response.body).to.have.property('state', 'DRAFT');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          DTAG_dynamic_data.contractId = response.body.contractId;
          debug(`==> DTAG new created contract id : ${DTAG_dynamic_data.contractId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  const sent_update_body = {
    header: {
      name: DTAG_create_contract_body.header.name,
      version: '4.2',
      type: DTAG_create_contract_body.header.type,
      fromMsp: DTAG_create_contract_body.header.fromMsp,
      toMsp: DTAG_create_contract_body.header.toMsp
    },
    body: DTAG_create_contract_body.body
  };

  it(`Update the DTAG contract`, function(done) {
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}`)
        .send(sent_update_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('header').that.is.an('object');
          expect(response.body.header).to.have.property('version', sent_update_body.header.version);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get the DTAG contract`, function(done) {
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('header').that.is.an('object');
          expect(response.body.header).to.have.property('version', sent_update_body.header.version);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get all DTAG contracts`, function(done) {
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          const contractsWithSameContractId = response.body.filter((c) => (c.contractId === DTAG_dynamic_data.contractId));
          expect(contractsWithSameContractId.length).equals(1);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Send the DTAG contract`, function(done) {
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/send/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('header').that.is.an('object');
          expect(response.body.header).to.have.property('version', sent_update_body.header.version);

          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');

          DTAG_dynamic_data.contractReferenceId = response.body.referenceId;
          debug(`==> DTAG contract referenceId : ${DTAG_dynamic_data.contractReferenceId}`);

          debugObjectOnDTAG('Sent contract : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get the DTAG contract in raw format`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.contractReferenceId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}?format=RAW`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', DTAG_dynamic_data.contractId);
          expect(response.body).to.have.property('referenceId', DTAG_dynamic_data.contractReferenceId);
          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('raw').that.is.a('string');

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Reject update for DTAG contract in state SENT`, function(done) {
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}`)
        .send(sent_update_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(422);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('internalErrorCode', 2000);
          expect(response.body).to.have.property('message', 'Contract modification not allowed');
          expect(response.body).to.have.property('description', `It's not allowed to update this contract or its state.`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this contract on TMUS`, function(done) {
    if (DTAG_dynamic_data.contractReferenceId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    const waitContract = (referenceId, tries, interval) => {
      try {
        chai.request(TMUS_API)
          .get(`/contracts/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            const contractsWithSameContractReferenceId = response.body.filter((c) => (c.referenceId === referenceId));
            if (contractsWithSameContractReferenceId.length === 1) {
              TMUS_dynamic_data.receivedContractId = contractsWithSameContractReferenceId[0].contractId;
              debug(`==> TMUS received contract id : ${TMUS_dynamic_data.receivedContractId}`);
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitContract(referenceId, (tries - 1));
              }, interval);
            } else {
              done('No more tries');
            }
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    };

    waitContract(DTAG_dynamic_data.contractReferenceId, 10, 5000);
  });

  it(`Get TMUS contract in state RECEIVED`, function(done) {
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('header').that.is.an('object');
          expect(response.body.header).to.have.property('version', sent_update_body.header.version);

          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');

          debugObjectOnTMUS('Received contract from DTAG : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Reject update for TMUS contract in state RECEIVED`, function(done) {
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}`)
        .send(sent_update_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(422);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('internalErrorCode', 2000);
          expect(response.body).to.have.property('message', 'Contract modification not allowed');
          expect(response.body).to.have.property('description', `It's not allowed to update this contract or its state.`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now create and use 'usage' endpoints

  // Now create an usage in DTAG and send the settlement on TMUS

  it(`Create a new DTAG usage for this contract`, function(done) {
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      testsUtils.debugWarning(`Is it possible to create an usage on a contract not SIGNED?`, '?');
      chai.request(DTAG_API)
        .post(`/contracts/${DTAG_dynamic_data.contractId}/usages/`)
        .send(DTAG_create_usage_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'DRAFT');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          DTAG_dynamic_data.usageId = response.body.usageId;
          debug(`==> DTAG new created usage id : ${DTAG_dynamic_data.usageId}`);

          debugObjectOnDTAG('Usage body metadata : ', response.body.body.metadata);
          if ((response.body.body.data) && (Array.isArray(response.body.body.data))) {
            debugObjectOnDTAG('Usage body data first rows : ', response.body.body.data.slice(0, 6));
          } else {
            debugObjectOnDTAG('Usage body data : ', response.body.body.data);
          }

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Generate a settlement on DTAG usage for this contract`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/generate/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('settlementId').that.is.a('string');
          expect(response.body).to.have.property('state', 'DRAFT');
          expect(response.body).to.have.property('mspOwner', 'DTAG');
          expect(response.body).to.have.property('body').that.is.an('object');
          expect(response.body.body).to.have.property('generatedResult').that.is.an('object');
          expect(response.body.body).to.have.property('usage').that.is.an('object');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          DTAG_dynamic_data.settlementId = response.body.settlementId;
          debug(`==> DTAG new created settlement id : ${DTAG_dynamic_data.settlementId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Send DTAG settlement to TMUS`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.settlementId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/settlements/${DTAG_dynamic_data.settlementId}/send/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('settlementId').that.is.a('string');
          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'DTAG');

          DTAG_dynamic_data.settlementReferenceId = response.body.referenceId;
          debug(`==> DTAG settlement referenceId : ${DTAG_dynamic_data.settlementReferenceId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this settlement on TMUS`, function(done) {
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (DTAG_dynamic_data.settlementReferenceId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    const waitSettlement = (referenceId, tries, interval) => {
      try {
        chai.request(TMUS_API)
          .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/settlements/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            // const settlementsWithSameSettlementReferenceId = response.body.filter((c) => (c.referenceId === referenceId));
            // filter settlement with state "received" because GET Settlements does not return referenceId
            const settlementsWithSameSettlementReferenceId = response.body.filter((c) => (c.state === 'RECEIVED'));
            if (settlementsWithSameSettlementReferenceId.length === 1) {
              testsUtils.debugWarning(`There is no referenceId in settlement document returned by the API`, '!');
              TMUS_dynamic_data.receivedSettlementId = settlementsWithSameSettlementReferenceId[0].settlementId;
              debug(`==> TMUS received settlement id : ${TMUS_dynamic_data.receivedSettlementId}`);
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitSettlement(referenceId, (tries - 1));
              }, interval);
            } else {
              done('No more tries');
            }
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    };

    waitSettlement(DTAG_dynamic_data.settlementReferenceId, 20, 5000);
  });

  it(`Get TMUS settlement from DTAG`, function(done) {
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedSettlementId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/settlements/${TMUS_dynamic_data.receivedSettlementId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('settlementId').that.is.a('string');
          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'DTAG');

          debugObjectOnTMUS('Settlement received from DTAG : ', response.body);

          if ((response.body.body) && (response.body.body.usage) && (response.body.body.usage.body)) {
            debugObjectOnTMUS('Settlement received from DTAG => embedded usage body metadata : ', response.body.body.usage.body.metadata);
            if ((response.body.body.usage.body.data) && (Array.isArray(response.body.body.usage.body.data))) {
              debugObjectOnTMUS('Settlement received from DTAG => embedded usage body data first rows : ', response.body.body.usage.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Settlement received from DTAG => embedded usage body data : ', response.body.body.usage.body.data);
            }
          }

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now create an usage in TMUS and send the settlement on DTAG

  it(`Create a new TMUS usage for this contract`, function(done) {
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      testsUtils.debugWarning(`Is it possible to create an usage on a contract not SIGNED?`, '?');
      chai.request(TMUS_API)
        .post(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/`)
        .send(TMUS_create_usage_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'DRAFT');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          TMUS_dynamic_data.usageId = response.body.usageId;
          debug(`==> TMUS new created usage id : ${TMUS_dynamic_data.usageId}`);

          debugObjectOnTMUS('Usage body metadata : ', response.body.body.metadata);
          if ((response.body.body.data) && (Array.isArray(response.body.body.data))) {
            debugObjectOnTMUS('Usage body data first rows : ', response.body.body.data.slice(0, 6));
          } else {
            debugObjectOnTMUS('Usage body data : ', response.body.body.data);
          }

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Generate a settlement on TMUS usage for this contract`, function(done) {
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}/generate/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('settlementId').that.is.a('string');
          expect(response.body).to.have.property('state', 'DRAFT');
          expect(response.body).to.have.property('mspOwner', 'TMUS');
          expect(response.body).to.have.property('body').that.is.an('object');
          expect(response.body.body).to.have.property('generatedResult').that.is.an('object');
          expect(response.body.body).to.have.property('usage').that.is.an('object');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          TMUS_dynamic_data.settlementId = response.body.settlementId;
          debug(`==> TMUS new created settlement id : ${TMUS_dynamic_data.settlementId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Send TMUS settlement to DTAG`, function(done) {
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.settlementId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/settlements/${TMUS_dynamic_data.settlementId}/send/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('settlementId').that.is.a('string');
          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'TMUS');

          TMUS_dynamic_data.settlementReferenceId = response.body.referenceId;
          debug(`==> TMUS settlement referenceId : ${TMUS_dynamic_data.settlementReferenceId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this settlement on DTAG`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (TMUS_dynamic_data.settlementReferenceId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    const waitSettlement = (referenceId, tries, interval) => {
      try {
        chai.request(DTAG_API)
          .get(`/contracts/${DTAG_dynamic_data.contractId}/settlements/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            // const settlementsWithSameSettlementReferenceId = response.body.filter((c) => (c.referenceId === referenceId));
            // filter settlement with state "received" because GET Settlements does not return referenceId
            const settlementsWithSameSettlementReferenceId = response.body.filter((c) => (c.state === 'RECEIVED'));
            if (settlementsWithSameSettlementReferenceId.length === 1) {
              testsUtils.debugWarning(`There is no referenceId in settlement document returned by the API`, '!');
              DTAG_dynamic_data.receivedSettlementId = settlementsWithSameSettlementReferenceId[0].settlementId;
              debug(`==> DTAG received settlement id : ${DTAG_dynamic_data.receivedSettlementId}`);
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitSettlement(referenceId, (tries - 1));
              }, interval);
            } else {
              done('No more tries');
            }
          });
      } catch (exception) {
        debug('exception: %s', exception.stack);
        expect.fail('it test throws an exception');
        done();
      }
    };

    waitSettlement(TMUS_dynamic_data.settlementReferenceId, 20, 5000);
  });

  it(`Get DTAG settlement from TMUS`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedSettlementId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/settlements/${DTAG_dynamic_data.receivedSettlementId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('settlementId').that.is.a('string');
          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'TMUS');

          debugObjectOnDTAG('Settlement received from TMUS : ', response.body);

          if ((response.body.body) && (response.body.body.usage) && (response.body.body.usage.body)) {
            debugObjectOnDTAG('Settlement received from TMUS => embedded usage body metadata : ', response.body.body.usage.body.metadata);
            if ((response.body.body.usage.body.data) && (Array.isArray(response.body.body.usage.body.data))) {
              debugObjectOnDTAG('Settlement received from TMUS => embedded usage body data first rows : ', response.body.body.usage.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Settlement received from TMUS => embedded usage body data : ', response.body.body.usage.body.data);
            }
          }

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now delete the created settlement resources

  it(`Put DTAG discrepancy on received settlement from TMUS`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedSettlementId === undefined) || (DTAG_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/settlements/${DTAG_dynamic_data.receivedSettlementId}/discrepancy/?usageId=${DTAG_dynamic_data.usageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          debugObjectOnDTAG('Discrepancy created : ', response.body);
          if ((response.body.localUsage) && (response.body.localUsage.body)) {
            debugObjectOnDTAG('Discrepancy created with localUsage metadata : ', response.body.localUsage.body.metadata);
            if ((response.body.localUsage.body.data) && (Array.isArray(response.body.localUsage.body.data))) {
              debugObjectOnDTAG('Discrepancy created with localUsage data first rows : ', response.body.localUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Discrepancy created with localUsage data : ', response.body.localUsage.body.data);
            }
          }
          if ((response.body.remoteUsage) && (response.body.remoteUsage.body)) {
            debugObjectOnDTAG('Discrepancy created with remoteUsage metadata : ', response.body.remoteUsage.body.metadata);
            if ((response.body.remoteUsage.body.data) && (Array.isArray(response.body.remoteUsage.body.data))) {
              debugObjectOnDTAG('Discrepancy created with remoteUsage data first rows : ', response.body.remoteUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Discrepancy created with remoteUsage data : ', response.body.remoteUsage.body.data);
            }
          }

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Put TMUS discrepancy on received settlement from DTAG`, function(done) {
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageId === undefined) || (TMUS_dynamic_data.receivedSettlementId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}/discrepancy/?settlementId=${TMUS_dynamic_data.receivedSettlementId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          debugObjectOnTMUS('Discrepancy created : ', response.body);
          if ((response.body.localUsage) && (response.body.localUsage.body)) {
            debugObjectOnTMUS('Discrepancy created with localUsage metadata : ', response.body.localUsage.body.metadata);
            if ((response.body.localUsage.body.data) && (Array.isArray(response.body.localUsage.body.data))) {
              debugObjectOnTMUS('Discrepancy created with localUsage data first rows : ', response.body.localUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Discrepancy created with localUsage data : ', response.body.localUsage.body.data);
            }
          }
          if ((response.body.remoteUsage) && (response.body.remoteUsage.body)) {
            debugObjectOnTMUS('Discrepancy created with remoteUsage metadata : ', response.body.remoteUsage.body.metadata);
            if ((response.body.remoteUsage.body.data) && (Array.isArray(response.body.remoteUsage.body.data))) {
              debugObjectOnTMUS('Discrepancy created with remoteUsage data first rows : ', response.body.remoteUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Discrepancy created with remoteUsage data : ', response.body.remoteUsage.body.data);
            }
          }

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now delete the created settlement resources

  it.skip(`Delete DTAG sent settlement`, function(done) {
    // Does not exist
  });

  it.skip(`Delete DTAG received settlement`, function(done) {
    // Does not exist
  });

  it.skip(`Delete TMUS sent settlement`, function(done) {
    // Does not exist
  });

  it.skip(`Delete TMUS received settlement`, function(done) {
    // Does not exist
  });

  // Now delete the created usage resources

  it(`Delete the DTAG usage created by this scenario`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .delete(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'DRAFT');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Delete the TMUS usage created by this scenario`, function(done) {
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .delete(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'DRAFT');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now delete the created contract resources

  it(`Delete the DTAG contract created by this scenario`, function(done) {
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      testsUtils.debugWarning(`Is it possible to delete a SENT contract?`, '?');
      chai.request(DTAG_API)
        .delete(`/contracts/${DTAG_dynamic_data.contractId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId').that.is.a('string');
          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Delete the TMUS contract created by this scenario`, function(done) {
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      testsUtils.debugWarning(`Is it possible to delete a RECEIVED contract?`, '?');
      chai.request(TMUS_API)
        .delete(`/contracts/${TMUS_dynamic_data.receivedContractId}`)
        .send(DTAG_create_contract_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId').that.is.a('string');
          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('creationDate').that.is.a('string').and.match(DATE_REGEX);
          expect(response.body).to.have.property('lastModificationDate').that.is.a('string').and.match(DATE_REGEX);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
});
/* eslint-enable camelcase */
