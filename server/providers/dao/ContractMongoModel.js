'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ContractSchema = new Schema({ 
  id: { type:String, required: true},
  name: { type:String, required: true},
  state: { type:[String], required: true}
});

ContractSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('contracts', ContractSchema, 'contracts');