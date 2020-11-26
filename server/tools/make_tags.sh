#!/bin/sh
if [ $# -eq 1 ]; then
    COMMIT_HASH=$1
elif [ -e "../.git" ]; then
    COMMIT_HASH=$(cat ../.git/FETCH_HEAD | cut -f1)
else
    echo "failed to fetch commit hash, not updating tags..,"
    exit 0
fi;

API_HASH=$(md5sum api/openapi.yaml | cut -d ' ' -f 1)
API_VERSION=$(head api/openapi.yaml | grep "version:" | tr -s ' '| cut  -d ' ' -f3)

OUT=".status_info"

echo "exports.tags = {" > $OUT
echo "  \"commitHash\": \"$COMMIT_HASH\"," >> $OUT
echo "  \"apiHash\": \"$API_HASH\"," >> $OUT
echo "  \"apiVersion\": \"$API_VERSION\"," >> $OUT
echo "};" >> $OUT
