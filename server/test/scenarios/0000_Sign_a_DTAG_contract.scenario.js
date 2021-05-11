/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
const debugAction = require('debug')('spec:action');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const skipFlag = (process.env.MOCHA_SCENARIO_FILTER !== '') && (process.env.MOCHA_SCENARIO_FILTER !== '0000');

const DATE_REGEX = testsUtils.getDateRegexp();

/* eslint-disable camelcase */
const DTAG_API = `http://127.0.0.1:3030/api/v1`;
const TMUS_API = `http://127.0.0.1:3040/api/v1`;

const DTAG_create_contract_body = {
  header: {
    name: 'Contract name for scenario 0000_From_DTAG_contract between DTAG and TMUS',
    version: '1.1',
    type: 'contract',
    fromMsp: {mspId: 'DTAG', signatures: [
      {role: 'roleDTAG_1', name: 'nameDTAG_1', id: 'idDTAG_1'},
      {role: 'roleDTAG_2', name: 'nameDTAG_2', id: 'idDTAG_2'}
    ]},
    toMsp: {mspId: 'TMUS', signatures: [
      {role: 'role_3_TMUS', name: 'name_3_TMUS', id: 'id_3_TMUS'},
      {role: 'role_4_TMUS', name: 'name_4_TMUS', id: 'id_4_TMUS'},
      {role: 'role_5_TMUS', name: 'name_5_TMUS', id: 'id_5_TMUS'}
    ]}
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

const DTAG_create_signature_A_body = {
  signature: 'signature',
  certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA..AAAA...',
  algorithm: 'secp384r1'
};
const DTAG_create_signature_B_body = {
  signature: 'signature',
  certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA..BBBB...',
  algorithm: 'secp384r1'
};
const TMUS_create_signature_A_body = {
  signature: 'signature',
  certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA..AAAA...',
  algorithm: 'secp384r2'
};
const TMUS_create_signature_B_body = {
  signature: 'signature',
  certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA..BBBB...',
  algorithm: 'secp384r2'
};
const TMUS_create_signature_C_body = {
  signature: 'signature',
  certificate: '-----BEGIN CERTIFICATE-----\nMIICYjCCAemgAwIBA..CCCC...',
  algorithm: 'secp384r2'
};

const DTAG_dynamic_data = {
  contractId: undefined,
  contractTxId: undefined,
  contractReferenceId: undefined,
  DTAG: {
    firstSignatureId: undefined,
    secondSignatureId: undefined
  },
  TMUS: {
    firstSignatureId: undefined,
    secondSignatureId: undefined,
    thirdSignatureId: undefined
  }
};

const TMUS_dynamic_data = {
  receivedContractId: undefined,
  DTAG: {
    firstSignatureId: undefined,
    secondSignatureId: undefined
  },
  TMUS: {
    firstSignatureId: undefined,
    secondSignatureId: undefined,
    thirdSignatureId: undefined
  }
};

describe(`Launch scenario 0000_Sign_a_DTAG_contract`, function() {
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
    debugAction(`${this.test.title}`);
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
    debugAction(`${this.test.title}`);
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
    debugAction(`${this.test.title}`);
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
          expect(response.body.header).to.have.property('version', sent_update_body.header.version);

          expect(response.body).to.have.property('state', 'SENT');
          expect(response.body).to.have.property('referenceId').that.is.a('string');

          expect(response.body).to.have.property('blockchainRef').that.is.an('object');
          expect(response.body.blockchainRef).to.have.property('type', 'hlf');
          expect(response.body.blockchainRef).to.have.property('txId').that.is.a('string');

          DTAG_dynamic_data.contractTxId = response.body.blockchainRef.txId;
          debug(`==> DTAG contract txId : ${DTAG_dynamic_data.contractTxId}`);
          DTAG_dynamic_data.contractReferenceId = response.body.referenceId;
          debug(`==> DTAG contract referenceId : ${DTAG_dynamic_data.contractReferenceId}`);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get the DTAG contract in raw format`, function(done) {
    debugAction(`${this.test.title}`);
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

    waitContract(DTAG_dynamic_data.contractReferenceId, 20, 5000);
  });

  // Now create and use 'signature' endpoints

  // Now create a signature in DTAG and send it to TMUS

  it(`Get the DTAG signatures`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(0);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get the TMUS signatures`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(0);

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Post a signature on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .post(`/contracts/${DTAG_dynamic_data.contractId}/signatures/`)
        .send(DTAG_create_signature_A_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', DTAG_dynamic_data.contractId);
          expect(response.body).to.have.property('signatureId').that.is.a('string');
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('algorithm', DTAG_create_signature_A_body.algorithm);
          expect(response.body).to.have.property('certificate', DTAG_create_signature_A_body.certificate);
          expect(response.body).to.have.property('signature', DTAG_create_signature_A_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          DTAG_dynamic_data.DTAG.firstSignatureId = response.body.signatureId;

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get this signature details on DTAG`, function(done) {
    debugAction(`${this.test.title}`);
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.DTAG.firstSignatureId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/signatures/${DTAG_dynamic_data.DTAG.firstSignatureId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', DTAG_dynamic_data.contractId);
          expect(response.body).to.have.property('signatureId', DTAG_dynamic_data.DTAG.firstSignatureId);
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('algorithm', DTAG_create_signature_A_body.algorithm);
          expect(response.body).to.have.property('certificate', DTAG_create_signature_A_body.certificate);
          expect(response.body).to.have.property('signature', DTAG_create_signature_A_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get the DTAG signatures`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(1);
          response.body.forEach((sign) => {
            expect(sign.contractId).to.equals(DTAG_dynamic_data.contractId);
            expect(sign.signatureId).to.be.a('string');
            expect(sign.msp).to.equals('DTAG');
            expect(sign.state).to.equals('SIGNED');
          });

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait TMUS signatures with 1 signed signatures`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    const waitSignedSignatures = (signedSignaturesWanted, tries, interval) => {
      try {
        chai.request(TMUS_API)
          .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/signatures/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            const numberOfSignedSignatures = response.body.filter((c) => (c.state === 'SIGNED')).length;
            if (numberOfSignedSignatures === signedSignaturesWanted) {
              expect(response.body.length).to.equals(1);
              response.body.forEach((sign) => {
                expect(sign.contractId).to.equals(TMUS_dynamic_data.receivedContractId);
                expect(sign.signatureId).to.be.a('string');
                expect(sign.msp).to.equals('DTAG');
                expect(sign.state).to.equals('SIGNED');
                TMUS_dynamic_data.DTAG.firstSignatureId = sign.signatureId;
              });
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitSignedSignatures(signedSignaturesWanted, (tries - 1));
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

    waitSignedSignatures(1, 10, 5000);
  });

  it(`Get this signature details on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.DTAG.firstSignatureId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/signatures/${TMUS_dynamic_data.DTAG.firstSignatureId}`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', TMUS_dynamic_data.receivedContractId);
          expect(response.body).to.have.property('signatureId', TMUS_dynamic_data.DTAG.firstSignatureId);
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('algorithm', DTAG_create_signature_A_body.algorithm);
          expect(response.body).to.have.property('certificate', DTAG_create_signature_A_body.certificate);
          expect(response.body).to.have.property('signature', DTAG_create_signature_A_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  // Now create a signature in TMUS and send it to DTAG

  it(`Post a signature on TMUS`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .post(`/contracts/${TMUS_dynamic_data.receivedContractId}/signatures/`)
        .send(TMUS_create_signature_C_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', TMUS_dynamic_data.receivedContractId);
          expect(response.body).to.have.property('signatureId').that.is.a('string');
          expect(response.body).to.have.property('msp', 'TMUS');
          expect(response.body).to.have.property('algorithm', TMUS_create_signature_C_body.algorithm);
          expect(response.body).to.have.property('certificate', TMUS_create_signature_C_body.certificate);
          expect(response.body).to.have.property('signature', TMUS_create_signature_C_body.signature);
          expect(response.body).to.have.property('state', 'SIGNED');

          TMUS_dynamic_data.TMUS.firstSignatureId = response.body.signatureId;

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Get the TMUS signatures`, function(done) {
    debugAction(`${this.test.title}`);
    if (TMUS_dynamic_data.receivedContractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/signatures/`)
        .send()
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('array');

          expect(response.body.length).to.equals(2);
          response.body.forEach((sign) => {
            expect(sign.contractId).to.equals(TMUS_dynamic_data.receivedContractId);
            expect(sign.signatureId).to.be.a('string');
            expect(sign.msp).to.match(new RegExp('^(DTAG|TMUS)$'));
            expect(sign.state).to.equals('SIGNED');
            if (sign.msp === 'DTAG') {
              expect(sign.signatureId).to.equals(TMUS_dynamic_data.DTAG.firstSignatureId);
            } else if (sign.msp === 'TMUS') {
              expect(sign.signatureId).to.equals(TMUS_dynamic_data.TMUS.firstSignatureId);
            }
          });

          done();
        });
    } catch (exception) {
      debug('exception: %s', exception.stack);
      expect.fail('it test throws an exception');
      done();
    }
  });

  it(`Wait DTAG signatures with 2 signed signatures`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    const waitSignedSignatures = (signedSignaturesWanted, tries, interval) => {
      try {
        chai.request(DTAG_API)
          .get(`/contracts/${DTAG_dynamic_data.contractId}/signatures/`)
          .send()
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.exist;
            expect(response.body).to.be.an('array');

            const numberOfSignedSignatures = response.body.filter((c) => (c.state === 'SIGNED')).length;

            if (numberOfSignedSignatures === signedSignaturesWanted) {
              expect(response.body.length).to.equals(2);
              response.body.forEach((sign) => {
                expect(sign.contractId).to.equals(DTAG_dynamic_data.contractId);
                expect(sign.signatureId).to.be.a('string');
                expect(sign.msp).to.match(new RegExp('^(DTAG|TMUS)$'));
                expect(sign.state).to.equals('SIGNED');
                if (sign.msp === 'DTAG') {
                  expect(sign.signatureId).to.equals(DTAG_dynamic_data.DTAG.firstSignatureId);
                } else if (sign.msp === 'TMUS') {
                  DTAG_dynamic_data.DTAG.firstSignatureId = sign.signatureId;
                }
              });
              done();
            } else if (tries > 0) {
              setTimeout(() => {
                waitSignedSignatures(signedSignaturesWanted, (tries - 1));
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

    waitSignedSignatures(2, 20, 5000);
  });

  // Now delete the created contract resources

  it(`Delete the DTAG contract created by this scenario`, function(done) {
    debugAction(`${this.test.title}`);
    if (DTAG_dynamic_data.contractId === undefined) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
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
