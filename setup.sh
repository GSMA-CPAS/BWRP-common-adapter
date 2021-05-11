# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

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
  IMAGE=$(docker image ls common-adapter -q)
  docker tag $IMAGE common-adapter:$HASH
  docker save common-adapter:latest -o ./docker_images/common-adapter:latest.tar
  docker save common-adapter:$HASH -o ./docker_images/common-adapter:$HASH.tar
}

function install() {
  docker image ls common-adapter
  echo "#Current available images"
  echo
  echo
  echo "Please choose a image to install"
  i=1
  for f in `ls -t ./docker_images/`
    do
      echo "    [$i] =>  $f"
      choose[$i]=$f
      ((i=$i+1))
    done
  read -n 1 -p "Input Selection:" sel
  echo
  echo
  docker load -i ./docker_images/${choose[$sel]}
  docker image ls common-adapter
}

function mongo_init() {
  mkdir -p ${COMMON_ADAPTER_MONGO_PV_PATH}
  echo "db.createUser(
    {
        user: \"${COMMON_ADAPTER_MONGO_USER}\",
        pwd: \"${COMMON_ADAPTER_MONGO_USERPW}\",
        roles: [
            {
                role: \"readWrite\",
                db: \"commondb\"
            }
        ]
    }
);
" > ${COMMON_ADAPTER_MONGO_PV_PATH}mongo-init.js
}

function up() {
  LISTS=($(docker image ls common-adapter | awk '{if(NR>1)print $1 ":" $2}'))
  if [ ${#LISTS[@]} -eq 0 ]; then
    install
  fi

  SELECTED=${LISTS[0]}

  if [ ${#LISTS[@]} -gt 1 ]; then
    echo "Please choose a version to run"
    i=1
    for f in ${LISTS[@]}
      do
        echo "    [$i] =>  $f"
        choose[$i]=$f
        ((i=$i+1))
      done
    read -n 1 -p "Input Selection:" sel
    echo
    echo
    SELECTED=${choose[$sel]}
  fi

  TAG=$(echo $SELECTED | cut -d':' -f 2)
  export COMMON_ADAPTER_TAG=$TAG
  mongo_init
  docker-compose up
}


function clean() {
  docker rm common-adapter-local CADB-local
  #need new way
  #docker image rm common-adapter -f
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
