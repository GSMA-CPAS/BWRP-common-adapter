'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  date: {type: Date, required: true},
  action: {type: String, required: true}
}, {_id: false});

const ContractBodySchema = Schema.Types.Mixed;

const SignatureSchema = new Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  role: {type: String, required: true}
}, {_id: false});

const SignatureLinkSchema = new Schema({
  id: {type: String, required: true},
  msp: {type: String, required: true},
  index: {type: Number, required: true},
  txId: {type: String, required: false}
}, {_id: false});

const MspSchema = new Schema({
  mspId: {type: String, required: true},
  minSignatures: {type: Number, required: false, min: 1},
  nbOfsignatures: {type: Number, required: false, min: 1},
  signatures: {type: [SignatureSchema], required: false}
}, {_id: false});

const ContractSchema = new Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  type: {type: String, required: true},
  version: {type: String, required: true},
  fromMsp: {type: MspSchema, required: true},
  toMsp: {type: MspSchema, required: true},
  body: {type: ContractBodySchema, required: true},
  rawData: {type: String, required: false},
  documentId: {type: String, required: false},
  storageKeys: {type: [String], required: false},
  state: {type: String, required: true},
  history: {type: [HistorySchema], required: true},
  creationDate: {type: Date, required: true},
  lastModificationDate: {type: Date, required: true, default: Date.now},
  signatureLink: {type: [SignatureLinkSchema], required: false}
});

ContractSchema.index({id: 1}, {unique: true});

ContractSchema.index({documentId: 1}, {unique: true, partialFilterExpression: {documentId: {$type: 'string'}}});

module.exports = mongoose.model('contracts', ContractSchema, 'contracts');
