/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
const debugAction = require('debug')('spec:action');
const debugObjectOnTMUS = require('debug')('spec:TMUS-side:object');
const debugObjectOnDTAG = require('debug')('spec:DTAG-side:object');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const DATE_REGEX = testsUtils.getDateRegexp();

const SHOW_DISCREPANCY_GENERATION_DETAILS = false;

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

const configured_JSON_DTAG_usage_body_to_create = require('./0003_data/0003_JSON_DTAG_usage_body_to_create.json');
const DTAG_create_usage_body = {
  header: {
    name: `Usage from DTAG to TMUS created the ${new Date().toJSON()}`,
    type: 'usage',
    version: '8.2'
  },
  body: configured_JSON_DTAG_usage_body_to_create
};

const configured_JSON_TMUS_usage_body_to_create = require('./0003_data/0003_JSON_TMUS_usage_body_to_create.json');
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
  contractTxId: undefined,
  contractReferenceId: undefined,
  usageId: undefined,
  usageTxId: undefined,
  usageReferenceId: undefined,
  receivedUsageId: undefined
};

const TMUS_dynamic_data = {
  receivedContractId: undefined,
  usageId: undefined,
  usageTxId: undefined,
  usageReferenceId: undefined,
  receivedUsageId: undefined
};

describe(`Launch scenario 0003_Send_usage_from_DTAG_contract`, function() {
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
    debugAction(`${this.test.title}`);
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

  it(`Send the DTAG contract`, function(done) {
    debugAction(`${this.test.title}`);
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
          expect(response.body.header).to.have.property('version', DTAG_create_contract_body.header.version);

          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          expect(response.body.blockchainRef).to.have.property('txId').that.is.a('string');

          DTAG_dynamic_data.contractTxId = response.body.blockchainRef.txId;
          debug(`==> DTAG contract txId : ${DTAG_dynamic_data.contractTxId}`);
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

  it(`Wait this contract on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
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
    debugAction(`${this.test.title}`);
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
          expect(response.body.header).to.have.property('version', DTAG_create_contract_body.header.version);

          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          // not returned yet by blockchain-adapter
          // expect(response.body.blockchainRef).to.have.property('txId', DTAG_dynamic_data.contractTxId);
          expect(response.body.blockchainRef).to.have.property('txId', 'XXXXXXX');

          debugObjectOnTMUS('Received contract from DTAG : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now create and use 'usage' endpoints

  // Now create an usage in DTAG and send it to TMUS

  it(`Create a new DTAG usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
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

  it(`Send DTAG usage to TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/send/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'DTAG');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          expect(response.body.blockchainRef).to.have.property('txId').that.is.a('string');

          DTAG_dynamic_data.usageTxId = response.body.blockchainRef.txId;
          debug(`==> DTAG usage txId : ${DTAG_dynamic_data.usageTxId}`);
          DTAG_dynamic_data.usageReferenceId = response.body.referenceId;
          debug(`==> DTAG usage referenceId : ${DTAG_dynamic_data.usageReferenceId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this usage on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (DTAG_dynamic_data.usageReferenceId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    const waitSettlement = (referenceId, tries, interval) => {
      try {
        chai.request(TMUS_API)
          .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            // const usagesWithSameSettlementReferenceId = response.body.filter((c) => (c.referenceId === referenceId));
            // filter usage with state "received" because GET Usages does not return referenceId
            const usagesWithSameUsageReferenceId = response.body.filter((c) => (c.state === 'RECEIVED'));
            if (usagesWithSameUsageReferenceId.length === 1) {
              testsUtils.debugWarning(`There is no referenceId in usage document returned by the API`, '!');
              TMUS_dynamic_data.receivedUsageId = usagesWithSameUsageReferenceId[0].usageId;
              debug(`==> TMUS received usage id : ${TMUS_dynamic_data.receivedUsageId}`);
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

    waitSettlement(DTAG_dynamic_data.usageReferenceId, 20, 5000);
  });

  it(`Get TMUS usage from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('contractId', TMUS_dynamic_data.receivedContractId);
          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'DTAG');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          // not returned yet by blockchain-adapter
          // expect(response.body.blockchainRef).to.have.property('txId', DTAG_dynamic_data.contractTxId);
          expect(response.body.blockchainRef).to.have.property('txId', 'XXXXXXX');

          debugObjectOnTMUS('Usage received from DTAG : ', response.body);

          if ((response.body) && (response.body.body)) {
            debugObjectOnTMUS('Usage received from DTAG => Usage body metadata : ', response.body.body.metadata);
            if ((response.body.body.data) && (Array.isArray(response.body.body.data))) {
              debugObjectOnTMUS('Usage received from DTAG => Usage body data first rows : ', response.body.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Usage received from DTAG => Usage body data : ', response.body.body.data);
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

  // Now create an usage in TMUS and send it to DTAG

  it(`Create a new TMUS usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
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

  it(`Send TMUS usage to DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}/send/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'TMUS');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          expect(response.body.blockchainRef).to.have.property('txId').that.is.a('string');

          TMUS_dynamic_data.usageTxId = response.body.blockchainRef.txId;
          debug(`==> DTAG usage txId : ${TMUS_dynamic_data.usageTxId}`);
          TMUS_dynamic_data.usageReferenceId = response.body.referenceId;
          debug(`==> TMUS usage referenceId : ${TMUS_dynamic_data.usageReferenceId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this usage on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (TMUS_dynamic_data.usageReferenceId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    const waitSettlement = (referenceId, tries, interval) => {
      try {
        chai.request(DTAG_API)
          .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            // const usagesWithSameUsageReferenceId = response.body.filter((c) => (c.referenceId === referenceId));
            // filter usage with state "received" because GET Usages does not return referenceId
            const usagesWithSameUsageReferenceId = response.body.filter((c) => (c.state === 'RECEIVED'));
            if (usagesWithSameUsageReferenceId.length === 1) {
              testsUtils.debugWarning(`There is no referenceId in settlement document returned by the API`, '!');
              DTAG_dynamic_data.receivedUsageId = usagesWithSameUsageReferenceId[0].usageId;
              debug(`==> DTAG received usage id : ${DTAG_dynamic_data.receivedUsageId}`);
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

    waitSettlement(TMUS_dynamic_data.usageReferenceId, 20, 5000);
  });

  it(`Get DTAG usage from TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('contractId', DTAG_dynamic_data.contractId);
          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'TMUS');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          // not returned yet by blockchain-adapter
          // expect(response.body.blockchainRef).to.have.property('txId', DTAG_dynamic_data.contractTxId);
          expect(response.body.blockchainRef).to.have.property('txId', 'XXXXXXX');

          debugObjectOnDTAG('Usage received from TMUS : ', response.body);

          if ((response.body) && (response.body.body)) {
            debugObjectOnDTAG('Usage received from TMUS => Usage body metadata : ', response.body.body.metadata);
            if ((response.body.body.data) && (Array.isArray(response.body.body.data))) {
              debugObjectOnDTAG('Usage received from TMUS => Usage body data first rows : ', response.body.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Usage received from TMUS => Usage body data : ', response.body.body.data);
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

  // Now on DTAG side create the 2 settlements

  it(`Generate DTAG settlement on DTAG usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
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

          DTAG_dynamic_data.settlementIdFromLocalUsage = response.body.settlementId;
          debug(`==> DTAG new created settlement id from local usage: ${DTAG_dynamic_data.settlementIdFromLocalUsage}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Generate DTAG settlement on TMUS usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageId}/generate/`)
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

          DTAG_dynamic_data.settlementIdFromReceivedUsage = response.body.settlementId;
          debug(`==> DTAG new created settlement id from received usage: ${DTAG_dynamic_data.settlementIdFromReceivedUsage}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Reject DTAG send settlement to TMUS on TMUS usage`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.settlementIdFromReceivedUsage === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/settlements/${DTAG_dynamic_data.settlementIdFromReceivedUsage}/send/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(422);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('internalErrorCode', 2024);
          expect(response.body).to.have.property('message', 'Send settlement not allowed');
          expect(response.body).to.have.property('description', 'It\'s not allowed to send this settlement.');

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now on TMUS side create the 2 settlements

  it(`Generate TMUS settlement on TMUS usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
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

          TMUS_dynamic_data.settlementIdFromLocalUsage = response.body.settlementId;
          debug(`==> TMUS new created settlement id from local usage: ${TMUS_dynamic_data.settlementIdFromLocalUsage}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Generate TMUS settlement on DTAG usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}/generate/`)
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

          TMUS_dynamic_data.settlementIdFromReceivedUsage = response.body.settlementId;
          debug(`==> TMUS  new created settlement id from received usage: ${TMUS_dynamic_data.settlementIdFromReceivedUsage}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Reject TMUS send settlement to DTAG on DTAG usage`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.settlementIdFromReceivedUsage === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/settlements/${TMUS_dynamic_data.settlementIdFromReceivedUsage}/send/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(422);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('internalErrorCode', 2024);
          expect(response.body).to.have.property('message', 'Send settlement not allowed');
          expect(response.body).to.have.property('description', 'It\'s not allowed to send this settlement.');

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now calculate usage discrepancy

  it(`Get DTAG usage discrepancy on received usage from TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageId === undefined) || (DTAG_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/discrepancy/?partnerUsageId=${DTAG_dynamic_data.receivedUsageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          debugObjectOnDTAG('Usage Discrepancy calculated : ', response.body);
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.localUsage) && (response.body.localUsage.body)) {
            debugObjectOnDTAG('Usage Discrepancy calculated with localUsage metadata : ', response.body.localUsage.body.metadata);
            if ((response.body.localUsage.body.data) && (Array.isArray(response.body.localUsage.body.data))) {
              debugObjectOnDTAG('Usage Discrepancy calculated with localUsage data first rows : ', response.body.localUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Usage Discrepancy calculated with localUsage data : ', response.body.localUsage.body.data);
            }
          }
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.remoteUsage) && (response.body.remoteUsage.body)) {
            debugObjectOnDTAG('Usage Discrepancy calculated with remoteUsage metadata : ', response.body.remoteUsage.body.metadata);
            if ((response.body.remoteUsage.body.data) && (Array.isArray(response.body.remoteUsage.body.data))) {
              debugObjectOnDTAG('Usage Discrepancy calculated with remoteUsage data first rows : ', response.body.remoteUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Usage Discrepancy calculated with remoteUsage data : ', response.body.remoteUsage.body.data);
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

  it(`Get TMUS usage discrepancy on received usage from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageId === undefined) || (TMUS_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}/discrepancy/?partnerUsageId=${TMUS_dynamic_data.receivedUsageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          debugObjectOnTMUS('Usage Discrepancy calculated : ', response.body);
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.localUsage) && (response.body.localUsage.body)) {
            debugObjectOnTMUS('Usage Discrepancy calculated with localUsage metadata : ', response.body.localUsage.body.metadata);
            if ((response.body.localUsage.body.data) && (Array.isArray(response.body.localUsage.body.data))) {
              debugObjectOnTMUS('Usage Discrepancy calculated with localUsage data first rows : ', response.body.localUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Usage Discrepancy calculated with localUsage data : ', response.body.localUsage.body.data);
            }
          }
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.remoteUsage) && (response.body.remoteUsage.body)) {
            debugObjectOnTMUS('Usage Discrepancy calculated with remoteUsage metadata : ', response.body.remoteUsage.body.metadata);
            if ((response.body.remoteUsage.body.data) && (Array.isArray(response.body.remoteUsage.body.data))) {
              debugObjectOnTMUS('Usage Discrepancy calculated with remoteUsage data first rows : ', response.body.remoteUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Usage Discrepancy calculated with remoteUsage data : ', response.body.remoteUsage.body.data);
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

  // Now calculate settlement discrepancy

  it(`Get DTAG settlement discrepancy on localy generated settlement from received TMUS usage`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.settlementIdFromLocalUsage === undefined) || (DTAG_dynamic_data.settlementIdFromReceivedUsage === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/settlements/${DTAG_dynamic_data.settlementIdFromLocalUsage}/discrepancy/?partnerSettlementId=${DTAG_dynamic_data.settlementIdFromReceivedUsage}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          debugObjectOnDTAG('Settlement Discrepancy calculated : ', response.body);
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.localUsage) && (response.body.localUsage.body)) {
            debugObjectOnDTAG('Settlement Discrepancy calculated with localUsage metadata : ', response.body.localUsage.body.metadata);
            if ((response.body.localUsage.body.data) && (Array.isArray(response.body.localUsage.body.data))) {
              debugObjectOnDTAG('Settlement Discrepancy calculated with localUsage data first rows : ', response.body.localUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Settlement Discrepancy calculated with localUsage data : ', response.body.localUsage.body.data);
            }
          }
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.remoteUsage) && (response.body.remoteUsage.body)) {
            debugObjectOnDTAG('Settlement Discrepancy calculated with remoteUsage metadata : ', response.body.remoteUsage.body.metadata);
            if ((response.body.remoteUsage.body.data) && (Array.isArray(response.body.remoteUsage.body.data))) {
              debugObjectOnDTAG('Settlement Discrepancy calculated with remoteUsage data first rows : ', response.body.remoteUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnDTAG('Settlement Discrepancy calculated with remoteUsage data : ', response.body.remoteUsage.body.data);
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

  it(`Get TMUS settlement discrepancy on localy generated settlement from received DTAG usage`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.settlementIdFromLocalUsage === undefined) || (TMUS_dynamic_data.settlementIdFromReceivedUsage === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/settlements/${TMUS_dynamic_data.settlementIdFromLocalUsage}/discrepancy/?partnerSettlementId=${TMUS_dynamic_data.settlementIdFromReceivedUsage}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          debugObjectOnTMUS('Settlement Discrepancy calculated : ', response.body);
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.localUsage) && (response.body.localUsage.body)) {
            debugObjectOnTMUS('Settlement Discrepancy calculated with localUsage metadata : ', response.body.localUsage.body.metadata);
            if ((response.body.localUsage.body.data) && (Array.isArray(response.body.localUsage.body.data))) {
              debugObjectOnTMUS('Settlement Discrepancy calculated with localUsage data first rows : ', response.body.localUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Settlement Discrepancy calculated with localUsage data : ', response.body.localUsage.body.data);
            }
          }
          if (SHOW_DISCREPANCY_GENERATION_DETAILS && (response.body.remoteUsage) && (response.body.remoteUsage.body)) {
            debugObjectOnTMUS('Settlement Discrepancy calculated with remoteUsage metadata : ', response.body.remoteUsage.body.metadata);
            if ((response.body.remoteUsage.body.data) && (Array.isArray(response.body.remoteUsage.body.data))) {
              debugObjectOnTMUS('Settlement Discrepancy calculated with remoteUsage data first rows : ', response.body.remoteUsage.body.data.slice(0, 6));
            } else {
              debugObjectOnTMUS('Settlement Discrepancy calculated with remoteUsage data : ', response.body.remoteUsage.body.data);
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
    debugAction(`${this.test.title}`);
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

  it(`Delete the TMUS usage created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
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

  // Now delete the created contract resources

  it(`Delete the DTAG contract created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
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
    debugAction(`${this.test.title}`);
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
