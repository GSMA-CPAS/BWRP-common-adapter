// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

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
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);

const skipFlag = (process.env.MOCHA_SCENARIO_FILTER !== '') && (process.env.MOCHA_SCENARIO_FILTER !== '0004');

const DATE_REGEX = testsUtils.getDateRegexp();

/* eslint-disable camelcase */
const DTAG_API = `http://127.0.0.1:3030/api/v1`;
const TMUS_API = `http://127.0.0.1:3040/api/v1`;

const datasetName = (process.env.MOCHA_SCENARIO_0003_DATASET !== undefined) && (process.env.MOCHA_SCENARIO_0003_DATASET !== '') ? process.env.MOCHA_SCENARIO_0003_DATASET : 'initial_dataset_on_discrepancy_service';
const datasetPath = `./0003_data/${datasetName}`;

const configured_JSON_DTAG_contract_body_to_create = require(`${datasetPath}/0003_JSON_DTAG_contract_body_to_create.json`);
const DTAG_create_contract_body = {
  header: {
    name: 'Contract name for scenario 0000_From_DTAG_contract between DTAG and TMUS',
    version: '1.1',
    type: 'contract',
    fromMsp: {mspId: 'DTAG'},
    toMsp: {mspId: 'TMUS'}
  },
  body: configured_JSON_DTAG_contract_body_to_create
};

const configured_JSON_DTAG_usage_body_to_create = require(`${datasetPath}/0003_JSON_DTAG_usage_body_to_create.json`);
const DTAG_create_usage_body = {
  header: {
    name: `Usage from DTAG to TMUS created the ${new Date().toJSON()}`,
    type: 'usage',
    version: '8.2'
  },
  body: configured_JSON_DTAG_usage_body_to_create
};

const configured_JSON_TMUS_usage_body_to_create = require(`${datasetPath}/0003_JSON_TMUS_usage_body_to_create.json`);
const TMUS_create_usage_body = {
  header: {
    name: `Usage from TMUS to DTAG created the ${new Date().toJSON()}`,
    type: 'usage',
    version: '9.3'
  },
  body: configured_JSON_TMUS_usage_body_to_create
};
const DTAG_create_usage_body_for_rejection = {
  header: {
    name: `Usage from DTAG to TMUS created the ${new Date().toJSON()} that will be rejected`,
    type: 'usage',
    version: '8.2'
  },
  body: configured_JSON_DTAG_usage_body_to_create
};

const TMUS_create_usage_body_for_rejection = {
  header: {
    name: `Usage from TMUS to DTAG created the ${new Date().toJSON()} that will be rejected`,
    type: 'usage',
    version: '9.3'
  },
  body: configured_JSON_TMUS_usage_body_to_create
};
const DTAG_create_signature_A_body = {
  signature: 'signature',
  certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA..AAAA...',
  algorithm: 'secp384r1'
};
const TMUS_create_signature_A_body = {
  signature: 'signature',
  certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA..AAAA...',
  algorithm: 'secp384r2'
};

const DTAG_dynamic_data = {
  contractId: undefined,
  contractTxId: undefined,
  contractReferenceId: undefined,
  usageId: undefined,
  usageTxId: undefined,
  usageReferenceId: undefined,
  receivedUsageId: undefined,
  usageIdForReject: undefined,
  usageTxIdForReject: undefined,
  usageReferenceIdForReject: undefined,
  receivedUsageIdForReject: undefined,
};

const TMUS_dynamic_data = {
  receivedContractId: undefined,
  usageId: undefined,
  usageTxId: undefined,
  usageReferenceId: undefined,
  receivedUsageId: undefined,
  usageIdForReject: undefined,
  usageTxIdForReject: undefined,
  usageReferenceIdForReject: undefined,
  receivedUsageIdForReject: undefined,
};


describe(`Launch scenario 0004_Usage_completion`, function() {
  before(function(done) {
    if (skipFlag) {
      this.skip();
    }
    debugSetup('==> verify that DTAG and TMUS APIs are UP');
    try {
      chai.request(DTAG_API)
        .get(`/status`)
        .end((error, response) => {
          debug('response.body: %s', JSON.stringify(response.body));
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.have.property('commitHash');
          expect(response.body).to.have.property('apiHash');
          expect(response.body).to.have.property('apiVersion');
          chai.request(TMUS_API)
            .get(`/status`)
            .end((error, response) => {
              debug('response.body: %s', JSON.stringify(response.body));
              expect(error).to.be.null;
              expect(response).to.have.status(200);
              expect(response).to.be.json;
              expect(response.body).to.exist;
              expect(response.body).to.have.property('commitHash');
              expect(response.body).to.have.property('apiHash');
              expect(response.body).to.have.property('apiVersion');

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
      expect.fail('This scenario step should not use an undefined data');
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
      expect.fail('This scenario step should not use an undefined data');
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
      expect.fail('This scenario step should not use an undefined data');
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
          expect(response.body.blockchainRef).to.have.property('txId', DTAG_dynamic_data.contractTxId);
          // expect(response.body.blockchainRef).to.have.property('txId', 'XXXXXXX');

          debugObjectOnTMUS('Received contract from DTAG : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Test the reject end point:
  // we upload and send usage on both partner
  // and then we reject them
  it(`Create a new DTAG usage for reject for this contract`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      testsUtils.debugWarning(`Is it possible to create an usage on a contract not SIGNED?`, '?');
      chai.request(DTAG_API)
        .post(`/contracts/${DTAG_dynamic_data.contractId}/usages/`)
        .send(DTAG_create_usage_body_for_rejection)
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

          DTAG_dynamic_data.usageIdForReject = response.body.usageId;
          debug(`==> DTAG new created usage id : ${DTAG_dynamic_data.usageIdForReject}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`Create a new TMUS usage for reject for this contract`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      testsUtils.debugWarning(`Is it possible to create an usage on a contract not SIGNED?`, '?');
      chai.request(TMUS_API)
        .post(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/`)
        .send(TMUS_create_usage_body_for_rejection)
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

          TMUS_dynamic_data.usageIdForReject = response.body.usageId;
          debug(`==> TMUS new created usage id : ${TMUS_dynamic_data.usageIdForReject}`);
          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`Send DTAG usage for reject to TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageIdForReject}/send/`)
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

          DTAG_dynamic_data.usageTxIdForReject = response.body.blockchainRef.txId;
          debug(`==> DTAG usage txId : ${DTAG_dynamic_data.usageTxIdForReject}`);
          DTAG_dynamic_data.usageReferenceIdForReject = response.body.referenceId;
          debug(`==> DTAG usage referenceId : ${DTAG_dynamic_data.usageReferenceIdForReject}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`Wait this usage for reject on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (DTAG_dynamic_data.usageReferenceIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    const waitUsage = (referenceId, tries, interval) => {
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

            // const usagesWithSameUsageReferenceId = response.body.filter((c) => (c.referenceId === referenceId));
            // filter usage with state "received" because GET Usages does not return referenceId
            const usagesWithSameUsageReferenceId = response.body.filter((c) => (c.state === 'RECEIVED'));
            if (usagesWithSameUsageReferenceId.length === 1) {
              testsUtils.debugWarning(`There is no referenceId in usage document returned by the API`, '!');
              TMUS_dynamic_data.receivedUsageIdForReject = usagesWithSameUsageReferenceId[0].usageId;
              debug(`==> TMUS received usage id : ${TMUS_dynamic_data.receivedUsageIdForReject}`);
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitUsage(referenceId, (tries - 1));
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

    waitUsage(DTAG_dynamic_data.usageReferenceIdForReject, 20, 5000);
  });
  it(`Send TMUS usage for reject to DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageIdForReject}/send/`)
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

          testsUtils.debugWarning(`partnerUsageId is set but this is not RESTfull compliant`, '?');

          expect(response.body).to.have.property('partnerUsageId', TMUS_dynamic_data.receivedUsageIdForReject);


          TMUS_dynamic_data.usageTxIdForReject = response.body.blockchainRef.txId;
          debug(`==> DTAG usage txId : ${TMUS_dynamic_data.usageTxIdForReject}`);
          TMUS_dynamic_data.usageReferenceIdForReject = response.body.referenceId;
          debug(`==> TMUS usage referenceId : ${TMUS_dynamic_data.usageReferenceIdForReject}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`Wait this usage for reject on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (TMUS_dynamic_data.usageReferenceIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    const waitUsage = (referenceId, tries, interval) => {
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
              DTAG_dynamic_data.receivedUsageIdForReject = usagesWithSameUsageReferenceId[0].usageId;
              debug(`==> DTAG received usage id : ${DTAG_dynamic_data.receivedUsageIdForReject}`);
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitUsage(referenceId, (tries - 1));
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

    waitUsage(TMUS_dynamic_data.usageReferenceIdForReject, 20, 5000);
  });
  it(`On DTAG - Reject usage sent for reject`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageIdForReject}/reject/`)
        .send()
        .end((error, response) => {
          console.log(response.body);
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

          expect(response.body).to.have.property('tag', 'REJECTED');


          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`On DTAG - Reject usage received for reject`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedUsageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageIdForReject}/reject/`)
        .send()
        .end((error, response) => {
          console.log(response.body);
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'TMUS');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          expect(response.body.blockchainRef).to.have.property('txId').that.is.a('string');
          expect(response.body).to.have.property('tag', 'REJECTED');


          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`On TMUS - Reject usage sent for reject`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageIdForReject}/reject/`)
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

          testsUtils.debugWarning(`partnerUsageId is set but this is not RESTfull compliant`, '?');

          expect(response.body).to.have.property('partnerUsageId', TMUS_dynamic_data.receivedUsageIdForReject);


          expect(response.body).to.have.property('tag', 'REJECTED');


          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`On TMUS - Reject usage received for reject`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedUsageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .put(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageIdForReject}/reject/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('state', 'RECEIVED');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'DTAG');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          expect(response.body.blockchainRef).to.have.property('txId').that.is.a('string');


          expect(response.body).to.have.property('tag', 'REJECTED');


          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });


  it(`Create a new DTAG usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
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
          if ((response.body.body.inbound) && (Array.isArray(response.body.body.inbound))) {
            debugObjectOnDTAG('Usage body inbound first rows : ', response.body.body.inbound.slice(0, 2));
          } else {
            debugObjectOnDTAG('Usage body inbound : ', response.body.body.inbound);
          }
          if ((response.body.body.outbound) && (Array.isArray(response.body.body.outbound))) {
            debugObjectOnDTAG('Usage body outbound first rows : ', response.body.body.outbound.slice(0, 2));
          } else {
            debugObjectOnDTAG('Usage body outbound : ', response.body.body.outbound);
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
      expect.fail('This scenario step should not use an undefined data');
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
      expect.fail('This scenario step should not use an undefined data');
    }
    const waitUsage = (referenceId, tries, interval) => {
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

            // const usagesWithSameUsageReferenceId = response.body.filter((c) => (c.referenceId === referenceId));
            // filter usage with state "received" because GET Usages does not return referenceId
            const usagesWithSameUsageReferenceId = response.body.filter((c) => ((c.state === 'RECEIVED') && (!c.tag)));
            if (usagesWithSameUsageReferenceId.length === 1) {
              testsUtils.debugWarning(`There is no referenceId in usage document returned by the API`, '!');
              TMUS_dynamic_data.receivedUsageId = usagesWithSameUsageReferenceId[0].usageId;
              debug(`==> TMUS received usage id : ${TMUS_dynamic_data.receivedUsageId}`);
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitUsage(referenceId, (tries - 1));
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

    waitUsage(DTAG_dynamic_data.usageReferenceId, 20, 5000);
  });

  it(`On TMUS - Get usage received from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
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
          expect(response.body.blockchainRef).to.have.property('txId', DTAG_dynamic_data.usageTxId);
          // expect(response.body.blockchainRef).to.have.property('txId', 'XXXXXXX');

          debugObjectOnTMUS('Usage received from DTAG : ', response.body);

          if ((response.body) && (response.body.body)) {
            debugObjectOnTMUS('Usage received from DTAG => Usage body metadata : ', response.body.body.metadata);
            if ((response.body.body.inbound) && (Array.isArray(response.body.body.inbound))) {
              debugObjectOnTMUS('Usage received from DTAG => Usage body inbound first rows : ', response.body.body.inbound.slice(0, 2));
            } else {
              debugObjectOnTMUS('Usage received from DTAG => Usage body inbound : ', response.body.body.inbound);
            }
            if ((response.body.body.outbound) && (Array.isArray(response.body.body.outbound))) {
              debugObjectOnTMUS('Usage received from DTAG => Usage body outbound first rows : ', response.body.body.outbound.slice(0, 2));
            } else {
              debugObjectOnTMUS('Usage received from DTAG => Usage body outbound : ', response.body.body.outbound);
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

  it(`Create a new TMUS usage for this contract`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
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
          if ((response.body.body.inbound) && (Array.isArray(response.body.body.inbound))) {
            debugObjectOnTMUS('Usage body inbound first rows : ', response.body.body.inbound.slice(0, 2));
          } else {
            debugObjectOnTMUS('Usage body inbound : ', response.body.body.inbound);
          }
          if ((response.body.body.outbound) && (Array.isArray(response.body.body.outbound))) {
            debugObjectOnTMUS('Usage body outbound first rows : ', response.body.body.outbound.slice(0, 2));
          } else {
            debugObjectOnTMUS('Usage body outbound : ', response.body.body.outbound);
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
      expect.fail('This scenario step should not use an undefined data');
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

          testsUtils.debugWarning(`partnerUsageId is set but this is not RESTfull compliant`, '?');

          expect(response.body).to.have.property('partnerUsageId', TMUS_dynamic_data.receivedUsageId);


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
      expect.fail('This scenario step should not use an undefined data');
    }
    const waitUsage = (referenceId, tries, interval) => {
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
            const usagesWithSameUsageReferenceId = response.body.filter((c) => (c.state === 'RECEIVED') && (!c.tag));
            if (usagesWithSameUsageReferenceId.length === 1) {
              testsUtils.debugWarning(`There is no referenceId in settlement document returned by the API`, '!');
              DTAG_dynamic_data.receivedUsageId = usagesWithSameUsageReferenceId[0].usageId;
              debug(`==> DTAG received usage id : ${DTAG_dynamic_data.receivedUsageId}`);
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitUsage(referenceId, (tries - 1));
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

    waitUsage(TMUS_dynamic_data.usageReferenceId, 20, 5000);
  });

  it(`On DTAG - Get usage received from TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
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
          expect(response.body.blockchainRef).to.have.property('txId', TMUS_dynamic_data.usageTxId);
          // expect(response.body.blockchainRef).to.have.property('txId', 'XXXXXXX');

          debugObjectOnDTAG('Usage received from TMUS : ', response.body);

          if ((response.body) && (response.body.body)) {
            debugObjectOnDTAG('Usage received from TMUS => Usage body metadata : ', response.body.body.metadata);
            if ((response.body.body.inbound) && (Array.isArray(response.body.body.inbound))) {
              debugObjectOnDTAG('Usage received from TMUS => Usage body inbound first rows : ', response.body.body.inbound.slice(0, 2));
            } else {
              debugObjectOnDTAG('Usage received from TMUS => Usage body inbound : ', response.body.body.inbound);
            }
            if ((response.body.body.outbound) && (Array.isArray(response.body.body.outbound))) {
              debugObjectOnDTAG('Usage received from TMUS => Usage body outbound first rows : ', response.body.body.outbound.slice(0, 2));
            } else {
              debugObjectOnDTAG('Usage received from TMUS => Usage body outbound : ', response.body.body.outbound);
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

  it(`On DTAG - Get usage sent to TMUS for partnerUsageId`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
          expect(response.body).to.have.property('contractId', DTAG_dynamic_data.contractId);
          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');
          expect(response.body).to.have.property('mspOwner', 'DTAG');
          testsUtils.debugWarning(`partnerUsageId is set but this is not RESTfull compliant`, '?');

          expect(response.body).to.have.property('partnerUsageId', DTAG_dynamic_data.receivedUsageId);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On DTAG - Get the signatures on usage sent by DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(0);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On DTAG - Get the signatures on usage received from TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(0);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On TMUS - Get the signatures on usage sent by TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(0);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On TMUS - Get the signatures on usage received from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(0);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On DTAG - Post a signature on DTAG sent usage`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .post(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/signatures/`)
        .send(DTAG_create_signature_A_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId', DTAG_dynamic_data.usageId);
          expect(response.body).to.have.property('signatureId').that.is.a('string');
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('algorithm', DTAG_create_signature_A_body.algorithm);
          expect(response.body).to.have.property('certificate', DTAG_create_signature_A_body.certificate);
          expect(response.body).to.have.property('signature', DTAG_create_signature_A_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          // DTAG_dynamic_data.DTAG.sentUsageSignatureId = response.body.signatureId;

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this signature on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    const waitSignature = ( tries, interval) => {
      try {
        chai.request(TMUS_API)
          .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}/signatures/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            if (response.body.length == 1) {
              debug(`==> TMUS received signature : ${JSON.stringify(response.body[0])}`);
              done();
            } else if (tries > 0) {
              debug(`==> TMUS not yet received signature : tries = ${tries}`);

              setTimeout(() => {
                waitSignature( (tries - 1));
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

    waitSignature( 20, 5000);
  });

  it(`On DTAG - Get the signatures on usage sent by DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(1);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On TMUS - Get the signatures on usage received from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(1);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On TMUS - Post a signature on usage received from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      chai.request(TMUS_API)
        .post(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}/signatures/`)
        .send(TMUS_create_signature_A_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId', TMUS_dynamic_data.receivedUsageId);
          expect(response.body).to.have.property('signatureId').that.is.a('string');
          expect(response.body).to.have.property('msp', 'TMUS');
          expect(response.body).to.have.property('algorithm', TMUS_create_signature_A_body.algorithm);
          expect(response.body).to.have.property('certificate', TMUS_create_signature_A_body.certificate);
          expect(response.body).to.have.property('signature', TMUS_create_signature_A_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          // DTAG_dynamic_data.DTAG.sentUsageSignatureId = response.body.signatureId;

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this signature on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    const waitSignature = ( tries, interval) => {
      try {
        chai.request(DTAG_API)
          .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/signatures/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            if (response.body.length == 2) {
              debug(`==> DTAG received signature : ${JSON.stringify(response.body[0])}`);
              done();
            } else if (tries > 0) {
              debug(`==> DTAG not yet received signature : tries = ${tries}`);

              setTimeout(() => {
                waitSignature( (tries - 1));
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

    waitSignature( 20, 5000);
  });

  it(`On TMUS - Get the signatures on usage received from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(2);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On DTAG - Get the signatures on usage sent by DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(2);
          debugObjectOnDTAG('signatures : ', response.body);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`On DTAG - Post a signature on usage received from TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .post(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageId}/signatures/`)
        .send(DTAG_create_signature_A_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId', DTAG_dynamic_data.receivedUsageId);
          expect(response.body).to.have.property('signatureId').that.is.a('string');
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('algorithm', DTAG_create_signature_A_body.algorithm);
          expect(response.body).to.have.property('certificate', DTAG_create_signature_A_body.certificate);
          expect(response.body).to.have.property('signature', DTAG_create_signature_A_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          // DTAG_dynamic_data.DTAG.sentUsageSignatureId = response.body.signatureId;

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this signature on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    const waitSignature = ( tries, interval) => {
      try {
        chai.request(TMUS_API)
          .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}/signatures/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            if (response.body.length == 1) {
              debug(`==> TMUS received signature : ${JSON.stringify(response.body[0])}`);
              done();
            } else if (tries > 0) {
              debug(`==> TMUS not yet received signature : tries = ${tries}`);

              setTimeout(() => {
                waitSignature( (tries - 1));
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

    waitSignature( 20, 5000);
  });

  it(`On TMUS - Post a signature on TMUS sent usage`, function(done) {
    debugAction(`${this.test.title}`);
    try {
      chai.request(TMUS_API)
        .post(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}/signatures/`)
        .send(TMUS_create_signature_A_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId', TMUS_dynamic_data.usageId);
          expect(response.body).to.have.property('signatureId').that.is.a('string');
          expect(response.body).to.have.property('msp', 'TMUS');
          expect(response.body).to.have.property('algorithm', TMUS_create_signature_A_body.algorithm);
          expect(response.body).to.have.property('certificate', TMUS_create_signature_A_body.certificate);
          expect(response.body).to.have.property('signature', TMUS_create_signature_A_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          // DTAG_dynamic_data.DTAG.sentUsageSignatureId = response.body.signatureId;

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait this signature on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    const waitSignature = ( tries, interval) => {
      try {
        chai.request(DTAG_API)
          .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageId}/signatures/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            if (response.body.length == 2) {
              debug(`==> DTAG received signature : ${JSON.stringify(response.body[0])}`);
              done();
            } else if (tries > 0) {
              debug(`==> DTAG not yet received signature : tries = ${tries}`);

              setTimeout(() => {
                waitSignature( (tries - 1));
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

    waitSignature( 20, 5000);
  });

  // Check all usage documents should be APPROVED
  it(`On DTAG - Get usage received from TMUS and check tag`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
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

          expect(response.body).to.have.property('tag', 'APPROVED');
          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`On DTAG - Get usage sent to TMUS and check tag`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('tag', 'APPROVED');
          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`On TMUS - Get usage received from DTAG and check tag`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
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

          expect(response.body).to.have.property('tag', 'APPROVED');
          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });
  it(`On TMUS - Get usage sent to DTAG and check tag`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('tag', 'APPROVED');
          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });


  // Now delete the created usage resources

  it(`On DTAG - Delete the DTAG usage created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
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
  it(`On DTAG - Delete the usage received from TMUS by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .delete(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
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
  it(`On DTAG - Delete the DTAG usage for reject created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.usageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .delete(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.usageIdForReject}`)
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
  it(`On DTAG - Delete the usage received for reject from TMUS by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.receivedUsageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .delete(`/contracts/${DTAG_dynamic_data.contractId}/usages/${DTAG_dynamic_data.receivedUsageIdForReject}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
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

  it(`on DTAG - Delete the DTAG contract created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
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

  it(`on TMUS - Delete the TMUS usage created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
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
  it(`on TMUS - Delete the usage received from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedUsageId === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .delete(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
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
  it(`on TMUS - Delete the TMUS usage for reject created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.usageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .delete(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.usageIdForReject}`)
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
  it(`on TMUS - Delete the usage received for reject from DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.receivedUsageIdForReject === undefined)) {
      expect.fail('This scenario step should not use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .delete(`/contracts/${TMUS_dynamic_data.receivedContractId}/usages/${TMUS_dynamic_data.receivedUsageIdForReject}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('usageId').that.is.a('string');
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

  it(`on TMUS - Delete the contract received from DTAG created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should not use an undefined data');
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
