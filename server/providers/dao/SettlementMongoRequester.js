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
const SettlementMongoModel = require('./SettlementMongoModel');

class SettlementMongoRequester {
  static defineSettlementId() {
    return SettlementMongoRequester.defineRandomizedObjectId();
  }

  static defineRandomizedObjectId() {
    const randomValue = ((Math.random() * 65535) | 1).toString(16);
    const formatedRandomValue = ('000' + randomValue).slice(-4);
    return (new mongoose.mongo.ObjectId().toHexString()) + formatedRandomValue;
  }

  static create(object, next) {
    SettlementMongoModel.create(object, (err, createdSettlement) => {
      if (err) {
        next(err);
      }
      return next(null, createdSettlement);
    });
  }

  static deleteMany(conditions, next) {
    SettlementMongoModel.deleteMany(conditions, (err, settlements) => {
      if (err) {
        next(err);
      }
      return next(null, settlements);
    });
  }

  static findAll(conditions, next) {
    SettlementMongoModel.find(conditions, {_id: false, __v: false, body: false, history: false}, {sort: {creationDate: -1}}, (err, settlements) => {
      if (err) {
        next(err);
      }
      return next(null, settlements);
    });
  }

  static findOne(conditions, next) {
    SettlementMongoModel.findOne(conditions, (err, settlement) => {
      if (err) {
        next(err);
      }
      if (settlement) {
        return next(null, settlement);
      }
      return next({code: 404, name: 'NotFound'}, null);
    });
  }

  static findOneAndUpdate(conditions, updateObject, next) {
    SettlementMongoModel.findOneAndUpdate(conditions, updateObject, {new: true, runValidators: true}, (err, settlement) => {
      if (err) {
        next(err);
      }
      return next(null, settlement);
    });
  }

  static findOneAndRemove(conditions, next) {
    SettlementMongoModel.findOneAndRemove(conditions, (err, settlement) => {
      if (err) {
        next(err);
      }
      if (settlement) {
        return next(null, settlement);
      }
      return next({code: 404, name: 'NotFound'}, null);
    });
  }

  static exists(conditions, next) {
    SettlementMongoModel.exists(conditions, (err, exists) => {
      if (err) {
        next(err);
      }
      return next(null, exists);
    });
  }
}

module.exports = SettlementMongoRequester;
