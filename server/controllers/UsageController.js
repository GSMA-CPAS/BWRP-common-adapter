/**
 * The UsageController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UsageService');
const discrepancyService = require('../services/DiscrepancyService');
const settlementService = require('../services/SettlementService');

const createUsage = async (request, response) => {
  await Controller.handleRequest(request, response, service.createUsage);
};

const deleteUsageById = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUsageById);
};

const generateUsageById = async (request, response) => {
  await Controller.handleRequest(request, response, settlementService.generateUsageById);
};

const getUsageById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsageById);
};

const getUsageDiscrepancy = async (request, response) => {
  await Controller.handleRequest(request, response, discrepancyService.getUsageDiscrepancy);
};

const getUsages = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsages);
};

const sendUsageById = async (request, response) => {
  await Controller.handleRequest(request, response, service.sendUsageById);
};

const updateUsageById = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUsageById);
};


module.exports = {
  createUsage,
  deleteUsageById,
  generateUsageById,
  getUsageById,
  getUsageDiscrepancy,
  getUsages,
  sendUsageById,
  updateUsageById,
};
