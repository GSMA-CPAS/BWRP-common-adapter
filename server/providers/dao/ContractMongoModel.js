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
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  date: {type: Date, required: true},
  action: {type: String, required: true}
}, {_id: false});

const ContractBodySchema = Schema.Types.Mixed;

const BlockchainRefSchema = new Schema({
  type: {type: String, required: true},
  txId: {type: String, required: true},
  timestamp: {type: Date, required: false}
}, {_id: false});

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
  name: {type: String, required: false},
  type: {type: String, required: true},
  version: {type: String, required: true},
  fromMsp: {type: MspSchema, required: true},
  toMsp: {type: MspSchema, required: true},
  body: {type: ContractBodySchema, required: true},
  rawData: {type: String, required: false},
  referenceId: {type: String, required: false},
  blockchainRef: {type: BlockchainRefSchema, required: false},
  storageKeys: {type: [String], required: false},
  state: {type: String, required: true},
  history: {type: [HistorySchema], required: true},
  creationDate: {type: Date, required: true},
  lastModificationDate: {type: Date, required: true, default: Date.now},
  signatureLink: {type: [SignatureLinkSchema], required: false},
  isUsageApproved: {type: Boolean, required: false}
});

ContractSchema.index({id: 1}, {unique: true});

ContractSchema.index({referenceId: 1}, {unique: true, partialFilterExpression: {referenceId: {$type: 'string'}}});

module.exports = mongoose.model('contracts', ContractSchema, 'contracts');
