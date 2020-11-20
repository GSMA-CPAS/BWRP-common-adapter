'use strict';

const ContractMongoModel = require('./ContractMongoModel');

class ContractMongoRequester {

  static findAll(conditions, next) {
    ContractMongoModel.find(conditions, [], {sort:{creationDate: -1}},(err, contracts) => {
      if (err) {
        next(err);
      }
      return next(null, contracts);
    });
  }

}

module.exports = ContractMongoRequester;