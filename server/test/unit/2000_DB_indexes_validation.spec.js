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
/* eslint-enable no-unused-vars */

const expect = require('chai').expect;

describe('DB indexes validation', function() {
  const contract1 = {
    name: 'Contract name between A1 and B1',
    state: 'DRAFT',
    type: 'contract',
    version: '1.1.0',
    fromMsp: {
      mspId: 'A1'
    },
    toMsp: {
      mspId: 'B1'
    },
    body: {},
    rawData: 'Ctr_raw-data-1',
    referenceId: 'sazuisazuishauzshauzdhzadhzadhzadbsqxqs'
  };

  const contract2 = {
    name: 'Contract name between A1 and C1',
    state: 'DRAFT',
    type: 'contract',
    version: '9.1.0',
    fromMsp: {
      mspId: 'A1'
    },
    toMsp: {
      mspId: 'C1'
    },
    body: {},
    rawData: 'Ctr_raw-data-1'
  };

  before((done) => {
    debugSetup('==> init db with 2 contracts');
    testsDbUtils.initDbWithContracts([contract1, contract2])
      .then((initDbWithContractsResp) => {
        contract1.id = initDbWithContractsResp[0].id;
        contract2.id = initDbWithContractsResp[1].id;
        debugSetup('The db is initialized with 2 contracts : ', initDbWithContractsResp.map((c) => c.id));

        debugSetup('==> done!');
        done();
      })
      .catch((initDbWithContractsError) => {
        debugSetup('Error initializing the db content : ', initDbWithContractsError);
        debugSetup('==> failed!');
        done(initDbWithContractsError);
      });
  });

  it('Should reject a contract creation with an already existing referenceId', function(done) {
    const newContractWithSameDocumetId = {
      name: 'New Contract Name',
      state: 'DRAFT',
      type: 'contract',
      version: '1.3.0',
      fromMsp: {
        mspId: 'A2'
      },
      toMsp: {
        mspId: 'B2'
      },
      body: {},
      rawData: 'Ctr_raw-data-2',
      referenceId: contract1.referenceId
    };

    testsDbUtils.createContract(newContractWithSameDocumetId)
      .then((createContractResp) => {
        debugSetup('Should not be resolved!', createContractResp);
        done('The creation of a contract with an existing referenceId should be rejected!');
      })
      .catch((createContractError) => {
        try {
          expect(JSON.stringify(createContractError)).to.equal(`{"driver":true,"name":"MongoError","index":0,"code":11000,"keyPattern":{"referenceId":1},"keyValue":{"referenceId":"${contract1.referenceId}"}}`);
          done();
        } catch (expectError) {
          // throw expectError;
          done(expectError);
        }
      });
  });

  it('Should accept a contract creation with an undefined referenceId', function(done) {
    const newContractWithUndefinedDocumetId = {
      name: 'New Contract Name',
      state: 'DRAFT',
      type: 'contract',
      version: '9.3.0',
      fromMsp: {
        mspId: 'A2'
      },
      toMsp: {
        mspId: 'C2'
      },
      body: {},
      rawData: 'Ctr_raw-data-2'
    };

    testsDbUtils.createContract(newContractWithUndefinedDocumetId)
      .then((createContractResp) => {
        expect(createContractResp).to.be.an('Object');
        expect(createContractResp).to.have.property('name', newContractWithUndefinedDocumetId.name);
        expect(createContractResp).to.have.property('state', newContractWithUndefinedDocumetId.state);
        expect(createContractResp).to.have.property('type', newContractWithUndefinedDocumetId.type);
        expect(createContractResp).to.have.property('version', newContractWithUndefinedDocumetId.version);
        expect(createContractResp).to.have.property('referenceId', undefined);
        done();
      })
      .catch((createContractError) => {
        done(createContractError);
      });
  });
});
