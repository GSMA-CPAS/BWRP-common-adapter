/**
 * The UsageController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UsageService');
const createUsage = async (request, response) => {
  await Controller.handleRequest(request, response, service.createUsage);
};

const deleteUsageByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUsageByID);
};

const generateSettlementByUsageId = async (request, response) => {
  await Controller.handleRequest(request, response, service.generateSettlementByUsageId);
};

const getUsageByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsageByID);
};

const getUsages = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsages);
};

const sendUsageById = async (request, response) => {
  await Controller.handleRequest(request, response, service.sendUsageById);
};

const updateUsageByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUsageByID);
};


module.exports = {
  createUsage,
  deleteUsageByID,
  generateSettlementByUsageId,
  getUsageByID,
  getUsages,
  sendUsageById,
  updateUsageByID,
};
