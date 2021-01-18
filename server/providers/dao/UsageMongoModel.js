'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  date: {type: Date, required: true},
  action: {type: String, required: true}
}, {_id: false});

const UsageDataSchema = new Schema({
  year: {type: Number, required: false},
  month: {type: Number, required: false},
  hpmn: {type: String, required: false},
  vpmn: {type: String, required: false},
  service: {type: String, required: false},
  value: {type: Number, required: false},
  units: {type: String, required: false},
  charges: {type: String, required: false},
  taxes: {type: String, required: false},
}, {_id: false});

// eslint-disable-next-line no-unused-vars
const UsageBodySchema = new Schema({
  data: {type: [UsageDataSchema], required: false}
}, {_id: false});

const MixUsageBodySchema = Schema.Types.Mixed;

const UsageSchema = new Schema({
  id: {type: String, required: true},
  type: {type: String, required: true},
  version: {type: String, required: true},
  name: {type: String, required: true},
  contractId: {type: String, required: true},
  mspOwner: {type: String, required: true},
  mspReceiver: {type: String, required: true},
  body: {type: MixUsageBodySchema, required: true},
  history: {type: [HistorySchema], required: true},
  creationDate: {type: Date, required: true},
  lastModificationDate: {type: Date, required: true, default: Date.now},
  state: {type: String, required: true},
});

UsageSchema.index({id: 1}, {unique: true});

module.exports = mongoose.model('usages', UsageSchema, 'usages');
