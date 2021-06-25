
# BWRP-common-adapter
The "Layer 2.5" with all Common functionality APIs

Start Common-Adapter Instance (with mongoDB) via docker-compose (kube version coming soon)

 edit '.env' file to suit your needs
   | Variable | Value | Description |
   |----|---|---|
   | COMMON_ADAPTER_MONGO_VERSION | 4.4-bionic | MongoDB image version. |
   | COMMON_ADAPTER_MONGO_ROOT | root | MongoDB init Root Username [please change] |
   | COMMON_ADAPTER_MONGO_ROOTPW | MongoDB init Root Password [please change] |
   | COMMON_ADAPTER_MONGO_USER | user | User Used by Common-Adapter to access DB [please change] |
   | COMMON_ADAPTER_MONGO_USERPW | userpw | User's Password Used by Common-Adapter to access DB. [please change] |
   | COMMON_ADAPTER_MONGO_DB_HOST | CADB-local | current script docker container host. If you have a seperate host, configure it here. |
   | COMMON_ADAPTER_MONGO_PORT | 27017 | MongoDB port. Change if you are using a different port number. |
   | COMMON_ADAPTER_MONGO_PV_PATH | ./CADB/ | Persistent Storage path for Mongo DB. To reset DB, delete this directory. |
   | COMMON_ADAPTER_LOG_LEVEL | info | Log level in Common-adapter |
   | COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_URL | http://localhost:3333/XXXX | URL to the Blockchain Adapter |
   | COMMON_ADAPTER_PORT | 3000 | Which Port the Common Adapter is exposed on. |



The defaults value in ".env" is sufficient to Run a test node. Please consider modifying it when in production.

To start, please run.

    ./setup.sh build
    ./setup.sh up

Once its up and running, you can access the API via

     http://<yourhost>:<COMMON_ADAPTER_PORT>/api-docs/

--

# For local dev

```
cd server
```

## Start local mongodb on 27917

```
npm run startTestDB
```

## Run tests

```
npm run test
```

## Start local mongodb on 27917

```
npm run stopTestDB
```

--

# For development-setup tests using exposed APIs

```
cd server
```

## Run CI tests

```
npm run ci
```
These tests are not used to check the schema of all the responses returned by Common-Adapter, but only to validate that the sequence of requests provides the expected basic functionalities.

## Edit test environment variables

This edition of test environment variables is not mandatory, but if you wish, you can modify some test environment variables by updating this file:
```
test/env.json
```

Initialized with this content by default:
```
{
  "COMMON_ADAPTER_CALCULATION_SERVICE_URL": "http://127.0.0.1:8989",
  "COMMON_ADAPTER_SELF_HOST": "http://my-public-ip.com",
  "COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_URL": "http://127.0.0.1:8081",
  "COMMON_ADAPTER_BLOCKCHAIN_ADAPTER_WEBHOOK_EVENTS": "[\"STORE:PAYLOADLINK\", \"STORE:SIGNATURE\"]",
  "MOCHA_SCENARIO_FILTER": "",
  "MOCHA_SCENARIO_0003_DATASET": "elira_dataset_on_discrepancy_service"
}
```

Setting "MOCHA_SCENARIO_FILTER" with values "0000", "0001", "0002" or "0003", you can launch only the wanted scenario from "test/scenarios" folder.

Setting "MOCHA_SCENARIO_0003_DATASET" with values "elira_dataset_on_discrepancy_service", "federico_dataset_on_discrepancy_service", "guillaume_dataset_on_discrepancy_service", "initial_dataset_on_discrepancy_service" or "kong_dataset_on_discrepancy_service", you can choose the dataset from "0003_data" folder to launch during the "0003" scenario. Each of these dataset folders contains a "README.md" file to explain the deployed versions needed to run this dataset. 

## How to Contribute

Contribution and feedback is encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](./CONTRIBUTING.md). By participating in this project, you agree to abide by its [Code of Conduct](./CODE_OF_CONDUCT.md) at all times.

## Contributors

Our commitment to open source means that we are enabling -in fact encouraging- all interested parties to contribute and become part of its developer community.

## Licensing

Copyright (c) 2021 GSMA and all contributors.

Licensed under the **Apache License, Version 2.0** (the "License"); you may not use this file except in compliance with the License.

You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](./LICENSE) for the specific language governing permissions and limitations under the License.

