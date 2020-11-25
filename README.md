# BWRP-common-adapter
The "Layer 2.5" with all Common functionality APIs

Start Local Mongo Instance via docker-compose (kube version coming soon)

 edit '.env' file to suit your needs
   | Variable | Value | Description |
   |----|---|---|
   | MONGO_VERSION | 4.4-bionic | MongoDB image version. |
   | MONGO_ROOT | root | MongoDB init Root Username [please change] |
   | MONGO_ROOTPW | MongoDB init Root Password [please change] |
   | MONGO_USER | user | User Used by Common-Adapter to access DB [please change] |
   | MONGO_USERPW | userpw | User's Password Used by Common-Adapter to access DB. [please change] |
   | MONGO_DB_HOST | CADB-local | current script docker container host. If you have a seperate host, configure it here. |
   | MONGO_PORT | 27017 | MongoDB port. Change if you are using a different port number. |
   | MONGO_PV_PATH | ./CADB/ | Persistent Storage path for Mongo DB. To reset DB, delete this directory. |
   | LOG_LEVEL | info | Log level in Common-adapter |
   | BLOCKCHAIN_ADAPTER_URL | http://localhost:3333/XXXX | URL to the Blockchain Adapter |
   | COMMON_ADAPTER_PORT | 3000 | Which Port the Common Adapter is exposed on. |



The defaults value in ".env" is sufficient to Run a test node. Please consider modifying it when in production.

To start, please run.

    ./setup.sh build
    ./setup.sh up


--