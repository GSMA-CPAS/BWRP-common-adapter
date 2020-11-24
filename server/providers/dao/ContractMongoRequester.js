'use strict';

const mongoose = require('mongoose');
const ContractMongoModel = require('./ContractMongoModel');

class ContractMongoRequester {

  static defineContractId() {
    return ContractMongoRequester.defineRandomizedObjectId();
  }

  static defineRandomizedObjectId() {
    const randomValue = ((Math.random() * 65535) | 1).toString(16);
    const formatedRandomValue = ('000' + randomValue).slice(-4);
    return (new mongoose.mongo.ObjectId().toHexString()) + formatedRandomValue;
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
    ContractMongoModel.find(conditions, { _id: false, __v: false, body: false, rawData: false, history: false }, { sort:{creationDate: -1}},(err, contracts) => {
      if (err) {
        next(err);
      }
      return next(null, contracts);
    });
  }

  static findOneAndUpdate(conditions, updateObject, next) {
    ContractMongoModel.findOneAndUpdate(conditions, updateObject, { new: true, runValidators: true }, (err, contract) => {
      if (err) {
        next(err);
      }
      return next(null, contract);
    });
  }

}

module.exports = ContractMongoRequester;