
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
