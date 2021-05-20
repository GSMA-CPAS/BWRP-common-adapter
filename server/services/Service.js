// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

class Service {
  static rejectResponse(error, code = 500) {
    let returnedResponse;
    if ((error !== undefined) && (error.error !== undefined) && (error.code !== undefined)) {
      // for internal errorUtils errors
      returnedResponse = {error: error.error, code: error.code};
    } else if ((error !== undefined) && (error.message !== undefined)) {
      // for backend errors
      returnedResponse = {error: error.message, code};
    } else {
      // others errors
      returnedResponse = {error: 'Invalid input', code: 405};
    }
    return returnedResponse;
  }

  static successResponse(payload, code = 200, headers = undefined) {
    return {payload, code, headers};
  }
}

module.exports = Service;
