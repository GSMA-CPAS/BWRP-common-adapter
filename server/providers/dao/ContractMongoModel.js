'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var HistorySchema = new Schema({ 
  date: { type: Date, required: true },
  action: { type: String, required: true }
}, { _id: false });

var BankDetails = Schema.Types.Mixed;

var DiscountModelsSchema = Schema.Types.Mixed;

var GeneralInformationSchema = new Schema({ 
  name: { type: String, required: false },
  type: { type: String, required: false },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  prolongationLength: { type: String, required: false }
}, { _id: false });

var ContractBodySchema = new Schema({ 
  taps: { type: [String], required: false },
  bankDetails: { type: Map, of: BankDetails, required: false },
  discountModels: { type: DiscountModelsSchema, required: false },
  generalInformation: { type: GeneralInformationSchema, required: false }
}, { _id: false });

var SignatureSchema = new Schema({ 
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true }
}, { _id: false });

var MspSchema = new Schema({ 
  mspId: { type: String, required: true },
  minSignatures: { type: Number, required: false, min: 1 },
  nbOfsignatures: { type: Number, required: false, min: 1 },
  signatures: { type: [SignatureSchema], required: false }
}, { _id: false });

var ContractSchema = new Schema({ 
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  version: { type: String, required: true },
  fromMsp: { type: MspSchema, required: true },
  toMsp: { type: MspSchema, required: true },
  body: { type: ContractBodySchema, required: true },
  rawData: { type: String, required: false },
  state: { type: String, required: true },
  history: { type: [HistorySchema], required: true },
  creationDate: { type: Date, required: true },
  lastModificationDate: { type: Date, required: true, default: Date.now }
});

ContractSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('contracts', ContractSchema, 'contracts');