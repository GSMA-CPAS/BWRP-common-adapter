'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  date: {type: Date, required: true},
  action: {type: String, required: true}
}, {_id: false});

const BlockchainRefSchema = new Schema({
  type: {type: String, required: true},
  txId: {type: String, required: true},
  timestamp: {type: Date, required: true}
}, {_id: false});

const MixSettlementBodySchema = Schema.Types.Mixed;

const SettlementSchema = new Schema({
  id: {type: String, required: true},
  type: {type: String, required: true},
  version: {type: String, required: true},
  name: {type: String, required: true},
  contractId: {type: String, required: true},
  contractReferenceId: {type: String, required: false},
  usageId: {type: String, required: false},
  mspOwner: {type: String, required: true},
  mspReceiver: {type: String, required: true},
  body: {type: MixSettlementBodySchema, required: true},
  rawData: {type: String, required: false},
  referenceId: {type: String, required: false},
  blockchainRef: {type: BlockchainRefSchema, required: false},
  storageKeys: {type: [String], required: false},
  state: {type: String, required: true},
  history: {type: [HistorySchema], required: true},
  creationDate: {type: Date, required: true},
  lastModificationDate: {type: Date, required: true, default: Date.now},
});

SettlementSchema.index({id: 1}, {unique: true});

module.exports = mongoose.model('settlements', SettlementSchema, 'settlements');
