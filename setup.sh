#!/bin/bash

source .env

function printHelp() {
  echo "Usage: "
  echo "  setup.sh build"
  echo "  setup.sh up"
  echo "  setup.sh down"
  echo "  setup.sh clean"
  echo
}

function build() {
#  HASH=$(cat .git/modules/common-adapter/HEAD || echo "NO_HEAD" | head -1 | cut -f1)
  HASH=$(cat .git/packed-refs |grep master | awk '{ print $1 }')
  docker-compose build --build-arg COMMIT_HASH="$HASH" $1 || exit 1
  mkdir -p ${MONGO_PV_PATH}
  echo "db.createUser( 
    {
        user: \"${MONGO_USER}\",
        pwd: \"${MONGO_USERPW}\",
        roles: [
            {
                role: \"readWrite\",
                db: \"commondb\"
            }
        ]
    }
);
" > ${MONGO_PV_PATH}mongo-init.js


}

function up() {
  docker-compose up
}

function clean() {
  docker rm common-adapter-local CADB-local
  docker image rm common-adapter
}



# Print help when there are no arguments
if [ "$#" -eq 0 ]
then
  printHelp >&2
  exit 1
fi
# Check if the function exists (bash specific)
if declare -f "$1" > /dev/null
then
  # call arguments verbatim
  "$@"
else
  # Show a helpful error
  echo "'$1' is not a known function name" >&2
  printHelp >&2
  exit 1
fi
