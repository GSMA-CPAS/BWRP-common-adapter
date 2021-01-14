#!/bin/bash

source .env

function printHelp() {
  echo "Usage: "
  echo "  setup.sh build"
  echo
}

function build() {
echo $COMPOSE_FILE
#  HASH=$(cat .git/modules/common-adapter/HEAD || echo "NO_HEAD" | head -1 | cut -f1)
#  HASH=$(cat .git/ORIG_HEAD || echo "NO_HEAD" | head -1 | cut -f1)
  HASH=$(cat .git/modules/blockchain-adapter/HEAD || echo "NO_HEAD" | head -1 | cut -f1)
  HASH2="12341234"
  docker-compose build --build-arg BSA_COMMIT_HASH="$HASH" --build-arg COMMIT_HASH="$HASH2"  $1 || exit 1
  mkdir -p ${DTAG_COMMON_ADAPTER_MONGO_PV_PATH}
  echo "db.createUser(
    {
        user: \"${DTAG_COMMON_ADAPTER_MONGO_USER}\",
        pwd: \"${DTAG_COMMON_ADAPTER_MONGO_USERPW}\",
        roles: [
            {
                role: \"readWrite\",
                db: \"commondb\"
            }
        ]
    }
);
" > ${DTAG_COMMON_ADAPTER_MONGO_PV_PATH}mongo-init.js

  mkdir -p ${TMUS_COMMON_ADAPTER_MONGO_PV_PATH}
  echo "db.createUser(
    {
        user: \"${TMUS_COMMON_ADAPTER_MONGO_USER}\",
        pwd: \"${TMUS_COMMON_ADAPTER_MONGO_USERPW}\",
        roles: [
            {
                role: \"readWrite\",
                db: \"commondb\"
            }
        ]
    }
);
" > ${TMUS_COMMON_ADAPTER_MONGO_PV_PATH}mongo-init.js

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

