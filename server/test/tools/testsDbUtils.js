const debug = require('debug')('spec:testsDbUtils');

const ContractMongoRequester = require('../../providers/dao/ContractMongoRequester');

class TestsDbUtils {

  static removeAllContracts(conditions) {
    return new Promise((resolve, reject) => {
      ContractMongoRequester.deleteMany(conditions, (err, contracts) => {
        if (err) {
          debug("deleteMany contracts failure : ", err);
          reject(err);
        } else {
          debug("deleteMany contracts done with success");
          resolve(contracts);  
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
        contract.state = "DRAFT";
      }
      if (contract.type === undefined) {
        contract.type = "contract";
      }
      if (contract.history === undefined) {
        contract.history = [];
      }
      contract.history.push({
        date: contract.creationDate,
        action: "CREATION"
      });

      // Launch db request
      ContractMongoRequester.create(contract, (err, createdContract) => {
        if (err) {
          debug("create contract failure : ", err);
          reject(err);
        } else {
          debug("create contract done with success");
          resolve(createdContract);  
        }
      });
    });
  }

  static initDbWithContracts(contracts) {
    return new Promise((resolve, reject) => {
      TestsDbUtils.removeAllContracts({})
        .then(removeAllContractsResp => {
          const contractsCreationPromises = [];
          if ((contracts !== undefined) && (Array.isArray(contracts))) {
            contracts.forEach(contract => {
              contractsCreationPromises.push(TestsDbUtils.createContract(contract));
            })
          }
          Promise.all(contractsCreationPromises)
            .then(contractsCreationPromisesResp => {
              debug("initDbWithContracts done with success");
              resolve(contractsCreationPromisesResp);
            })
            .catch(contractsCreationPromisesError => {
              debug("initDbWithContracts failure : ", contractsCreationPromisesError);
              reject(contractsCreationPromisesError);
            });
        })
        .catch(removeAllContractsError => {
          reject(removeAllContractsError);
        });
    });
  }  

}
module.exports = TestsDbUtils;