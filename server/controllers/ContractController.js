/**
 * The ContractController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ContractService');
const createContract = async (request, response) => {
  await Controller.handleRequest(request, response, service.createContract);
};

const deleteContractByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteContractByID);
};

const getContractByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.getContractByID);
};

const getContracts = async (request, response) => {
  await Controller.handleRequest(request, response, service.getContracts);
};

const sendContractByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.sendContractByID);
};

const updateContractByID = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateContractByID);
};


module.exports = {
  createContract,
  deleteContractByID,
  getContractByID,
  getContracts,
  sendContractByID,
  updateContractByID,
};
