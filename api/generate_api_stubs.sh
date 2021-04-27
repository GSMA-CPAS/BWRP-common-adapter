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
set -e

OPENAPI_VERSION="5.1.0"
OPENAPI_JAR=openapi-generator-cli-${OPENAPI_VERSION}.jar

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR

if [ ! -f .bin/${OPENAPI_JAR} ]; then
	echo "> downloading OPENAPI generator"
	mkdir -p .bin
	cd .bin
	wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/${OPENAPI_VERSION}/openapi-generator-cli-${OPENAPI_VERSION}.jar
	cd ..
fi

echo "> generating server api stubs"
java -jar .bin/${OPENAPI_JAR} generate  -i openapi.yaml  -g nodejs-express-server -o ../server

echo "> generating markdown"
java -jar .bin/${OPENAPI_JAR} generate  -i openapi.yaml  -g markdown -o doc
