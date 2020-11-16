/**
 * The SettlementController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/SettlementService');
const createSettlement = async (request, response) => {
  await Controller.handleRequest(request, response, service.createSettlement);
};

const deleteSettlementByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteSettlementByID);
};

const getSettlementByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.getSettlementByID);
};

const getSettlements = async (request, response) => {
  await Controller.handleRequest(request, response, service.getSettlements);
};

const updateSettlementByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateSettlementByID);
};


module.exports = {
  createSettlement,
  deleteSettlementByID,
  getSettlementByID,
  getSettlements,
  updateSettlementByID,
};
