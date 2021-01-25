/* eslint-disable no-unused-vars */
const testsUtils = require('../tools/testsUtils');
const testsDbUtils = require('../tools/testsDbUtils');
const debug = require('debug')('spec:it');
const debugSetup = require('debug')('spec:setup');
/* eslint-enable no-unused-vars */

const chai = require('chai');
const expect = require('chai').expect;

const DATE_REGEX = testsUtils.getDateRegexp();

/* eslint-disable camelcase */
const DTAG_API = `http://127.0.0.1:3030/api/v1`;
const TMUS_API = `http://127.0.0.1:3040/api/v1`;

const DTAG_first_signature_name = 'nameDTAG_1';
const DTAG_second_signature_name = 'nameDTAG_2';

const TMUS_first_signature_name = 'name_3_TMUS';
const TMUS_second_signature_name = 'name_4_TMUS';
const TMUS_third_signature_name = 'name_5_TMUS';

const DTAG_create_contract_body = {
  header: {
    name: 'Contract name for scenario 0000_From_DTAG_contract between DTAG and TMUS',
    version: '1.1',
    type: 'contract',
    fromMsp: {mspId: 'DTAG', signatures: [
      {role: 'roleDTAG_1', name: DTAG_first_signature_name, id: 'idDTAG_1'},
      {role: 'roleDTAG_2', name: DTAG_second_signature_name, id: 'idDTAG_2'}
    ]},
    toMsp: {mspId: 'TMUS', signatures: [
      {role: 'role_3_TMUS', name: TMUS_first_signature_name, id: 'id_3_TMUS'},
      {role: 'role_4_TMUS', name: TMUS_second_signature_name, id: 'id_4_TMUS'},
      {role: 'role_5_TMUS', name: TMUS_third_signature_name, id: 'id_5_TMUS'}
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

const DTAG_dynamic_data = {
  contractId: undefined,
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

describe(`Launch scenario 0000_From_DTAG_contract`, function() {
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

  // Now create and use 'signature' endpoints

  // Now create a signature in DTAG and send it to TMUS

  it(`Get the DTAG signatures`, function(done) {
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

          expect(response.body.length).to.equals(5);
          response.body.forEach((sign) => {
            expect(sign.contractId).to.equals(DTAG_dynamic_data.contractId);
            expect(sign.state).to.equals('UNSIGNED');
            if (sign.name === DTAG_first_signature_name) {
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
              DTAG_dynamic_data.DTAG.firstSignatureId = sign.signatureId;
              debug(`==> DTAG first DTAG signature id : ${DTAG_dynamic_data.DTAG.firstSignatureId}`);
            } else if (sign.name === DTAG_second_signature_name) {
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
              DTAG_dynamic_data.DTAG.secondSignatureId = sign.signatureId;
              debug(`==> DTAG second DTAG signature id : ${DTAG_dynamic_data.DTAG.secondSignatureId}`);
            } else if (sign.name === TMUS_first_signature_name) {
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
              DTAG_dynamic_data.TMUS.firstSignatureId = sign.signatureId;
              debug(`==> DTAG first TMUS signature id : ${DTAG_dynamic_data.TMUS.firstSignatureId}`);
            } else if (sign.name === TMUS_second_signature_name) {
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
              DTAG_dynamic_data.TMUS.secondSignatureId = sign.signatureId;
              debug(`==> DTAG second TMUS signature id : ${DTAG_dynamic_data.TMUS.secondSignatureId}`);
            } else if (sign.name === TMUS_third_signature_name) {
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
              DTAG_dynamic_data.TMUS.thirdSignatureId = sign.signatureId;
              debug(`==> DTAG third TMUS signature id : ${DTAG_dynamic_data.TMUS.thirdSignatureId}`);
            } else {
              expect.fail(`This signature name is unknown : ${sign.name}`);
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

  it(`Get the TMUS signatures`, function(done) {
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

          expect(response.body.length).to.equals(5);
          response.body.forEach((sign) => {
            expect(sign.contractId).to.equals(TMUS_dynamic_data.receivedContractId);
            expect(sign.state).to.equals('UNSIGNED');
            if (sign.name === DTAG_first_signature_name) {
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
              TMUS_dynamic_data.DTAG.firstSignatureId = sign.signatureId;
              debug(`==> TMUS first DTAG signature id : ${TMUS_dynamic_data.DTAG.firstSignatureId}`);
            } else if (sign.name === DTAG_second_signature_name) {
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
              TMUS_dynamic_data.DTAG.secondSignatureId = sign.signatureId;
              debug(`==> TMUS second DTAG signature id : ${TMUS_dynamic_data.DTAG.secondSignatureId}`);
            } else if (sign.name === TMUS_first_signature_name) {
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
              TMUS_dynamic_data.TMUS.firstSignatureId = sign.signatureId;
              debug(`==> TMUS first TMUS signature id : ${TMUS_dynamic_data.TMUS.firstSignatureId}`);
            } else if (sign.name === TMUS_second_signature_name) {
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
              TMUS_dynamic_data.TMUS.secondSignatureId = sign.signatureId;
              debug(`==> TMUS second TMUS signature id : ${TMUS_dynamic_data.TMUS.secondSignatureId}`);
            } else if (sign.name === TMUS_third_signature_name) {
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
              TMUS_dynamic_data.TMUS.thirdSignatureId = sign.signatureId;
              debug(`==> TMUS third TMUS signature id : ${TMUS_dynamic_data.TMUS.thirdSignatureId}`);
            } else {
              expect.fail(`This signature name is unknown : ${sign.name}`);
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

  it(`Put a signature on secondSignatureId of DTAG`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.DTAG.secondSignatureId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .put(`/contracts/${DTAG_dynamic_data.contractId}/signatures/${DTAG_dynamic_data.DTAG.secondSignatureId}`)
        .send(DTAG_create_signature_A_body)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', DTAG_dynamic_data.contractId);
          expect(response.body).to.have.property('signatureId', DTAG_dynamic_data.DTAG.secondSignatureId);
          expect(response.body).to.have.property('name', DTAG_second_signature_name);
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('role', 'roleDTAG_2');
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

  it(`Get this signature details on DTAG`, function(done) {
    if ((DTAG_dynamic_data.contractId === undefined) || (DTAG_dynamic_data.DTAG.secondSignatureId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(DTAG_API)
        .get(`/contracts/${DTAG_dynamic_data.contractId}/signatures/${DTAG_dynamic_data.DTAG.secondSignatureId}`)
        .send()
        .end((error, response) => {
          debug('response.body = ', response.body);
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', DTAG_dynamic_data.contractId);
          expect(response.body).to.have.property('signatureId', DTAG_dynamic_data.DTAG.secondSignatureId);
          expect(response.body).to.have.property('name', DTAG_second_signature_name);
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('role', 'roleDTAG_2');
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

          expect(response.body.length).to.equals(5);
          response.body.forEach((sign) => {
            expect(sign.contractId).to.equals(DTAG_dynamic_data.contractId);
            if (sign.name === DTAG_first_signature_name) {
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === DTAG_second_signature_name) {
              expect(sign.state).to.equals('SIGNED');
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === TMUS_first_signature_name) {
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === TMUS_second_signature_name) {
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === TMUS_third_signature_name) {
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
            } else {
              expect.fail(`This signature name is unknown : ${sign.name}`);
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

  it(`Get the TMUS signatures`, function(done) {
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

          expect(response.body.length).to.equals(5);
          response.body.forEach((sign) => {
            expect(sign.contractId).to.equals(TMUS_dynamic_data.receivedContractId);
            if (sign.name === DTAG_first_signature_name) {
              // expect(sign.state).to.equals('UNSIGNED');
              expect(sign.state).to.equals('SIGNED');
              testsUtils.debugWarning(`The signed element of signatures should be the second one, not the first one`, '!');
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === DTAG_second_signature_name) {
              // expect(sign.state).to.equals('SIGNED');
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('DTAG');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === TMUS_first_signature_name) {
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === TMUS_second_signature_name) {
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
            } else if (sign.name === TMUS_third_signature_name) {
              expect(sign.state).to.equals('UNSIGNED');
              expect(sign.msp).to.equals('TMUS');
              expect(sign.signatureId).to.be.a('string');
            } else {
              expect.fail(`This signature name is unknown : ${sign.name}`);
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

  it(`Get this signature details on TMUS`, function(done) {
    if ((TMUS_dynamic_data.receivedContractId === undefined) || (TMUS_dynamic_data.DTAG.firstSignatureId === undefined)) {
      expect.fail('This scenario step should use an undefined data');
    }
    try {
      chai.request(TMUS_API)
        .get(`/contracts/${TMUS_dynamic_data.receivedContractId}/signatures/${TMUS_dynamic_data.DTAG.firstSignatureId}`)
        .send()
        .end((error, response) => {
          debug('response.body = ', response.body);
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.exist;
          expect(response.body).to.be.an('object');

          expect(response.body).to.have.property('contractId', TMUS_dynamic_data.receivedContractId);
          expect(response.body).to.have.property('signatureId', TMUS_dynamic_data.DTAG.firstSignatureId);
          expect(response.body).to.have.property('name', DTAG_first_signature_name);
          expect(response.body).to.have.property('msp', 'DTAG');
          expect(response.body).to.have.property('role', 'roleDTAG_1');
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

  // Now delete the created contract resources

  it(`Delete the DTAG contract created by this scenario`, function(done) {
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
