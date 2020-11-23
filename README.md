

# BWRP-common-adapter
The "Layer 2.5" with all Common functionality APIs

Start Local Mongo Instance via docker-compose (kube version coming soon)

    docker-compose -f docker-mongo.yaml up -d 2>&1

this give you a Mongo DB, with "Persistant Volume" created ./MDB/ 
accessable via 

    MDB-local:27017  0.0.0.0:27017

with

    User    : user
    Password: userpwd

to stop the docker.

    docker-compose -f docker-mongo.yaml down

If you need a "fresh" db, Stop the instance, Delete the ./MDB/ and start the instance again.

--