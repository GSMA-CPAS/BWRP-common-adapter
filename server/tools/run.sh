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

echo "#####################################################################"
echo "# WARNING: setting TLS to insecure!"
echo "#          THIS IS UNSAFE! DO NOT DO THIS IN PRODUCTION SYSTEMS"
echo "#"
echo "# cryptogen used in network local generated invalid certs with extension any"
echo "#####################################################################"
export NODE_TLS_REJECT_UNAUTHORIZED=0


if [ ! -z "$BSA_DEBUG" ] && [ "$BSA_DEBUG" -eq "1" ]; then
    # export LOG_LEVEL_CONSOLE=${LOG_LEVEL_CONSOLE:-info}
    # export LOG_CONSOLE_STDOUT=${LOG_CONSOLE_STDOUT:-false}

    #export DISCOVERY_AS_LOCALHOST=false
    #export LOG_LEVEL_APP=debug
    #export LOG_LEVEL_DB=debug
    #export LOG_LEVEL_CONSOLE=debug

    export HFC_LOGGING='{"debug":"console","info":"console"}'

    #export GRPC_VERBOSITY="DEBUG"
    #export GRPC_TRACE="all"
fi

unset http_proxy
unset https_proxy



#BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
#$BASE/make_tags.sh || echo "skipped make tag"

export DEBUG=bsa:webhook 
npm run start
