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

const BlockchainRefSchema = new Schema({
  type: {type: String, required: true},
  txId: {type: String, required: true},
  timestamp: {type: Date, required: false}
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
  name: {type: String, required: false},
  contractId: {type: String, required: true},
  contractReferenceId: {type: String, required: false},
  settlementId: {type: String, required: false},
  partnerUsageId: {type: String, required: false},
  mspOwner: {type: String, required: true},
  mspReceiver: {type: String, required: true},
  body: {type: MixUsageBodySchema, required: true},
  rawData: {type: String, required: false},
  referenceId: {type: String, required: false},
  blockchainRef: {type: BlockchainRefSchema, required: false},
  storageKeys: {type: [String], required: false},
  state: {type: String, required: true},
  history: {type: [HistorySchema], required: true},
  creationDate: {type: Date, required: true},
  lastModificationDate: {type: Date, required: true, default: Date.now},
});

UsageSchema.index({id: 1}, {unique: true});

module.exports = mongoose.model('usages', UsageSchema, 'usages');
