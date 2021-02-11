'use strict';

const mongoose = require('mongoose');
const UsageMongoModel = require('./UsageMongoModel');

class UsageMongoRequester {
  static defineUsageId() {
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
