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
