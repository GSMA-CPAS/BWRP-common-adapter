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
