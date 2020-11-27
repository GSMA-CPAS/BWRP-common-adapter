
# Local Network

## Requirements

* Docker & Docker-Compose
* Linux or MAC OS X
* OpenSSL 1.1.1

## Installation

### (1) Clone git submodules

<pre>
$ cd BWRP-development-setup
$ git submodule update --init
</pre>

### (2) Create ``.env`` file in BWRP-development-setup (example .env-template)

<pre>
$ cp .env-template .env
$ vi .env #add passwords etc.
</pre>

###  \*\*NEW\*\* (2.1) Extend ``.env`` file in BWRP-development-setup to include common-adapter.

<pre>
$ cat ./common-adapter/local-development/.env >> .env
$ vi .env #modify passwords etc.
</pre>
All required variables has been pre-populated with default. modify where you see fit. Or else it will run fine.

### (3) Update ``/etc/hosts``. Replace 192.168.2.119 with your host ip

<pre>
192.168.2.119  dtag.poc.com.local
192.168.2.119  tmus.poc.com.local
</pre>

### \*\*NEW\*\* (4) Build required images

~~$ ./nomad.sh build~~

build required image including common-adapter.
<pre>
$ ./common-adapter/local-development/setup.sh build
</pre>
***\*this has script has inherited the same "build" component from "nomad.sh build" but extended with extras that common-adapter needs.***


Possible issues:
-  ERROR: Pool overlaps with other one on this address space / or other resources on docker/
Free the needed resource or change the used one, examle prune/free the used network or change the netowrk range in docker-compose.yaml.
-  ERROR: Service 'blockchain-adapter-tmus' failed to build: Get https://registry-1.docker.io/v2/: dial tcp: lookup registry-1.docker.io on [::1]:53: read udp [::1]:41959->[::1]:53: read: connection refused
edit /etc/resolve.comf to include:
nameserver 8.8.8.8

### (5) Launch network

<pre>
$ ./nomad.sh up
</pre>

Wait until cluster stable appears

### (6) Setup channel and chaincode

Open new tab in the current terminal

<pre>
$ cd BWRP-development-setup
$ ./nomad.sh setup
</pre>

Wait until chaincode is committed

### (7) Launch webapp

**DTAG**

Url: https://dtag.poc.com.local


Login as admin (password is admin)

**TMUS**

Url: https://tmus.poc.com.local

###  \*\*NEW\*\*(8) Test common-adapter API layer
basic test using the included Swagger interface. or you can submit curl to the endpoints.
**DTAG**
endpoint: http://dtag.poc.com.local:3030/
apidocs: http://dtag.poc.com.local:3030/api-docs/

**TMUS**
endpoint: http://tmus.poc.com.local:3040/
apidocs: http://tmus.poc.com.local:3040/api-docs/
eg.
<pre>
$ curl -X GET http://dtag.poc.com.local:3030/api/v1/status/
{"commitHash":"5595f2d7656e50bec710605872dd5b8007ad3ecb","apiHash":"85cb88adc1d1cb42ab2e563cc3e6177b","apiVersion":"0.0.1"}
</pre>


## Test blockchain-adapter rest-api

Install curl and jq:
<pre>
$ apt install jq curl
</pre>

Run the test script:
<pre>
$ ./blockchain-adapter/test_query.sh
</pre>

It should finish with:  Verified OK

If it fails with hostname not found you can set the hostnames in /etc/hosts or run the script inside docker or change the hosts inside the script to localhost:
<pre>
BSA_DTAG="localhost:8081"
BSA_TMUS="localhost:8082"
</pre>

## upgrade Chaincode

<pre>
$ cd chaincode
$ git pull
$ ./nomad.sh upgradeChaincodes
</pre>

