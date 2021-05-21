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
const UsageMongoModel = require('./UsageMongoModel');

class UsageMongoRequester {
  static defineUsageId() {
    return UsageMongoRequester.defineRandomizedObjectId();
  }

  static defineSignatureId() {
    return UsageMongoRequester.defineRandomizedObjectId();
  }

  static defineRandomizedObjectId() {
    const randomValue = ((Math.random() * 65535) | 1).toString(16);
    const formatedRandomValue = ('000' + randomValue).slice(-4);
    return (new mongoose.mongo.ObjectId().toHexString()) + formatedRandomValue;
  }

  static create(object, next) {
    UsageMongoModel.create(object, (err, createdUsage) => {
      if (err) {
        next(err);
      }
      return next(null, createdUsage);
    });
  }

  static deleteMany(conditions, next) {
    UsageMongoModel.deleteMany(conditions, (err, usages) => {
      if (err) {
        next(err);
      }
      return next(null, usages);
    });
  }

  static findAll(conditions, next) {
    UsageMongoModel.find(conditions, {_id: false, __v: false, body: false, rawData: false, history: false}, {sort: {creationDate: -1}}, (err, usages) => {
      if (err) {
        next(err);
      }
      return next(null, usages);
    });
  }

  static findOne(conditions, next) {
    UsageMongoModel.findOne(conditions, (err, usage) => {
      if (err) {
        next(err);
      }
      if (usage) {
        return next(null, usage);
      }
      return next({code: 404, name: 'NotFound'}, null);
    });
  }

  static findOneAndUpdate(conditions, updateObject, next) {
    UsageMongoModel.findOneAndUpdate(conditions, updateObject, {new: true, runValidators: true}, (err, usage) => {
      if (err) {
        next(err);
      }
      return next(null, usage);
    });
  }

  static findOneAndRemove(conditions, next) {
    UsageMongoModel.findOneAndRemove(conditions, (err, usage) => {
      if (err) {
        next(err);
      }
      if (usage) {
        return next(null, usage);
      }
      return next({code: 404, name: 'NotFound'}, null);
    });
  }

  static exists(conditions, next) {
    UsageMongoModel.exists(conditions, (err, exists) => {
      if (err) {
        next(err);
      }
      return next(null, exists);
    });
  }
}

module.exports = UsageMongoRequester;
