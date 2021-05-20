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

'use strict';

const mongoose = require('mongoose');
const ContractMongoModel = require('./ContractMongoModel');

class ContractMongoRequester {
  static defineContractId() {
    return ContractMongoRequester.defineRandomizedObjectId();
  }

  static defineSignatureId() {
    return ContractMongoRequester.defineRandomizedObjectId();
  }

  static defineRandomizedObjectId() {
    const randomValue = ((Math.random() * 65535) | 1).toString(16);
    const formatedRandomValue = ('000' + randomValue).slice(-4);
    return (new mongoose.mongo.ObjectId().toHexString()) + formatedRandomValue;
  }

  static getIndexes(next) {
    ContractMongoModel.collection.getIndexes()
      .then((indexes) => {
        return next(null, indexes);
      })
      .catch((err) => {
        next(err);
      });
  }

  static create(object, next) {
    ContractMongoModel.create(object, (err, createdContract) => {
      if (err) {
        next(err);
      }
      return next(null, createdContract);
    });
  }

  static deleteMany(conditions, next) {
    ContractMongoModel.deleteMany(conditions, (err, contracts) => {
      if (err) {
        next(err);
      }
      return next(null, contracts);
    });
  }

  static findAll(conditions, next) {
    ContractMongoModel.find(conditions, {_id: false, __v: false, rawData: false, history: false}, {sort: {creationDate: -1}}, (err, contracts) => {
      if (err) {
        next(err);
      }
      return next(null, contracts);
    });
  }

  static findOneAndUpdate(conditions, updateObject, next) {
    ContractMongoModel.findOneAndUpdate(conditions, updateObject, {new: true, runValidators: true}, (err, contract) => {
      if (err) {
        next(err);
      }
      return next(null, contract);
    });
  }

  static findOne(conditions, next) {
    ContractMongoModel.findOne(conditions, (err, contract) => {
      if (err) {
        next(err);
      }
      if (contract) {
        return next(null, contract);
      }
      return next({code: 404, name: 'NotFound'}, null);
    });
  }

  static findOneAndRemove(conditions, next) {
    ContractMongoModel.findOneAndRemove(conditions, (err, contract) => {
      if (err) {
        next(err);
      }
      if (contract) {
        return next(null, contract);
      }
      return next({code: 404, name: 'NotFound'}, null);
    });
  }

  static exists(conditions, next) {
    ContractMongoModel.exists(conditions, (err, exists) => {
      if (err) {
        next(err);
      }
      return next(null, exists);
    });
  }
}

module.exports = ContractMongoRequester;
