const debug = require('debug')('spec:testsDbUtils');

const ContractMongoRequester = require('../../providers/dao/ContractMongoRequester');
const UsageMongoRequester = require('../../providers/dao/UsageMongoRequester');
const SettlementMongoRequester = require('../../providers/dao/SettlementMongoRequester');

class TestsDbUtils {
  static removeAllContracts(conditions) {
    return new Promise((resolve, reject) => {
      ContractMongoRequester.deleteMany(conditions, (err, contracts) => {
        if (err) {
          debug('deleteMany contracts failure : ', err);
          reject(err);
        } else {
          debug('deleteMany contracts done with success');
          resolve(contracts);
        }
      });
    });
  }

  static removeAllUsages(conditions) {
    return new Promise((resolve, reject) => {
      UsageMongoRequester.deleteMany(conditions, (err, usages) => {
        if (err) {
          debug('deleteMany usages failure : ', err);
          reject(err);
        } else {
          debug('deleteMany usages done with success');
          resolve(usages);
        }
      });
    });
  }

  static removeAllSettlements(conditions) {
    return new Promise((resolve, reject) => {
      SettlementMongoRequester.deleteMany(conditions, (err, settlements) => {
        if (err) {
          debug('deleteMany settlements failure : ', err);
          reject(err);
        } else {
          debug('deleteMany settlements done with success');
          resolve(settlements);
        }
      });
    });
  }

  static createContract(contract) {
    return new Promise((resolve, reject) => {
      // Define automatic values
      contract.id = ContractMongoRequester.defineContractId();
      if (contract.creationDate === undefined) {
        contract.creationDate = Date.now();
      }
      if (contract.state === undefined) {
        contract.state = 'DRAFT';
      }
      if (contract.type === undefined) {
        contract.type = 'contract';
      }
      if (contract.history === undefined) {
        contract.history = [];
      }
      contract.history.push({
        date: contract.creationDate,
        action: 'CREATION'
      });

      // Launch db request
      ContractMongoRequester.create(contract, (err, createdContract) => {
        if (err) {
          debug('create contract failure : ', err);
          reject(err);
        } else {
          debug('create contract done with success');
          resolve(createdContract);
        }
      });
    });
  }

  static initDbWithContracts(contracts) {
    return new Promise((resolve, reject) => {
      TestsDbUtils.removeAllContracts({})
        .then((removeAllContractsResp) => {
          const contractsCreationPromises = [];
          if ((contracts !== undefined) && (Array.isArray(contracts))) {
            contracts.forEach((contract) => {
              contractsCreationPromises.push(TestsDbUtils.createContract(contract));
            });
          }
          Promise.all(contractsCreationPromises)
            .then((contractsCreationPromisesResp) => {
              debug('initDbWithContracts done with success');
              resolve(contractsCreationPromisesResp);
            })
            .catch((contractsCreationPromisesError) => {
              debug('initDbWithContracts failure : ', contractsCreationPromisesError);
              reject(contractsCreationPromisesError);
            });
        })
        .catch((removeAllContractsError) => {
          reject(removeAllContractsError);
        });
    });
  }

  static createUsage(usage) {
    return new Promise((resolve, reject) => {
      // Define automatic values
      usage.id = UsageMongoRequester.defineUsageId();
      if (usage.creationDate === undefined) {
        usage.creationDate = Date.now();
      }
      if (usage.state === undefined) {
        usage.state = 'DRAFT';
      }
      if (usage.type === undefined) {
        usage.type = 'usage';
      }
      if (usage.history === undefined) {
        usage.history = [];
      }
      usage.history.push({
        date: usage.creationDate,
        action: 'CREATION'
      });

      // Launch db request
      UsageMongoRequester.create(usage, (err, createdUsage) => {
        if (err) {
          debug('create usage failure : ', err);
          reject(err);
        } else {
          debug('create usage done with success');
          resolve(createdUsage);
        }
      });
    });
  }

  static initDbWithUsages(usages) {
    return new Promise((resolve, reject) => {
      TestsDbUtils.removeAllUsages({})
        .then((removeAllUsagesResp) => {
          const usagesCreationPromises = [];
          if ((usages !== undefined) && (Array.isArray(usages))) {
            usages.forEach((usage) => {
              usagesCreationPromises.push(TestsDbUtils.createUsage(usage));
            });
          }
          Promise.all(usagesCreationPromises)
            .then((usagesCreationPromisesResp) => {
              debug('initDbWithUsages done with success');
              resolve(usagesCreationPromisesResp);
            })
            .catch((usagesCreationPromisesError) => {
              debug('initDbWithUsages failure : ', usagesCreationPromisesError);
              reject(usagesCreationPromisesError);
            });
        })
        .catch((removeAllUsagesError) => {
          reject(removeAllUsagesError);
        });
    });
  }

  static createSettlement(settlement) {
    return new Promise((resolve, reject) => {
      // Define automatic values
      settlement.id = SettlementMongoRequester.defineSettlementId();
      if (settlement.creationDate === undefined) {
        settlement.creationDate = Date.now();
      }
      if (settlement.state === undefined) {
        settlement.state = 'DRAFT';
      }
      if (settlement.type === undefined) {
        settlement.type = 'settlement';
      }
      if (settlement.history === undefined) {
        settlement.history = [];
      }
      settlement.history.push({
        date: settlement.creationDate,
        action: 'CREATION'
      });

      // Launch db request
      SettlementMongoRequester.create(settlement, (err, createdSettlement) => {
        if (err) {
          debug('create settlement failure : ', err);
          reject(err);
        } else {
          debug('create settlement done with success');
          resolve(createdSettlement);
        }
      });
    });
  }

  static initDbWithSettlements(settlements) {
    return new Promise((resolve, reject) => {
      TestsDbUtils.removeAllSettlements({})
        .then((removeAllSettlementsResp) => {
          const settlementsCreationPromises = [];
          if ((settlements !== undefined) && (Array.isArray(settlements))) {
            settlements.forEach((settlement) => {
              settlementsCreationPromises.push(TestsDbUtils.createSettlement(settlement));
            });
          }
          Promise.all(settlementsCreationPromises)
            .then((settlementsCreationPromisesResp) => {
              debug('initDbWithSettlements done with success');
              resolve(settlementsCreationPromisesResp);
            })
            .catch((settlementsCreationPromisesError) => {
              debug('initDbWithSettlements failure : ', settlementsCreationPromisesError);
              reject(settlementsCreationPromisesError);
            });
        })
        .catch((removeAllSettlementsError) => {
          reject(removeAllSettlementsError);
        });
    });
  }
}

module.exports = TestsDbUtils;
