#!/bin/bash
set -e

OPENAPI_VERSION="5.0.0-beta2"
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
