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

/**
 * The SettlementController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/SettlementService');
const discrepancyService = require('../services/DiscrepancyService');

const getSettlementById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getSettlementById);
};

const getSettlementDiscrepancy = async (request, response) => {
  await Controller.handleRequest(request, response, discrepancyService.getSettlementDiscrepancy);
};

const getSettlements = async (request, response) => {
  await Controller.handleRequest(request, response, service.getSettlements);
};

const rejectSettlementById = async (request, response) => {
  await Controller.handleRequest(request, response, service.rejectSettlementById);
};

const sendSettlementById = async (request, response) => {
  await Controller.handleRequest(request, response, service.sendSettlementById);
};


module.exports = {
  getSettlementById,
  getSettlementDiscrepancy,
  getSettlements,
  rejectSettlementById,
  sendSettlementById,
};
