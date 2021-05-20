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

const http = require('http');
const textBody = require('body');
const {promisify} = require('util');
const sleep = promisify(setTimeout);

// config
let port = 8086;
let blockchainadapterHost = 'localhost';
let blockchainadapterPort = 8085;

const USE_ACKNOWLEDGE = true;

if (process.env.WEBHOOK_DUMMY_PORT != undefined) {
  port = process.env.WEBHOOK_DUMMY_PORT;
}
if (process.env.WEBHOOK_DUMMY_BSA_HOST != undefined) {
  blockchainadapterHost = process.env.WEBHOOK_DUMMY_BSA_HOST;
}
if (process.env.WEBHOOK_DUMMY_BSA_PORT != undefined) {
  blockchainadapterPort = process.env.WEBHOOK_DUMMY_BSA_PORT;
}

console.log('> listening on port ' + port);

/** test subsciption
 */
function testSubscription() {
  const timeout = 1;
  console.log('> will subscribe in '+timeout+' seconds');
  sleep(timeout * 1000).then(() => {
    // subscribe
    subscribe().then( (subscriptionID) => {
      console.log('> will unsubscribe in '+timeout+' seconds');
      sleep(timeout * 1000).then(() => {
        // unsubscribe
        unsubscribe(subscriptionID).then(() => {
          // final subscription stays active
          subscribe();
        });
      });
    }).catch( (err) => {
      console.log(err);
      process.exit(0);
    });
  });
}

/** test unsubscribing
 * @param {string} id - subscription id
 * @return {promise}
 */
function unsubscribe(id) {
  return new Promise( (resolve, reject) => {
    console.log('> will unsubscribe ['+id+'] now');

    const options = {
      hostname: blockchainadapterHost,
      port: blockchainadapterPort,
      path: '/webhooks/' + id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      if (res.statusCode == 200) {
        resolve();
      } else {
        reject(res.statusCode);
      }
    });

    req.on('error', (e) => {
      reject(e);
    });

    // Write data to request body
    req.write('');
    req.end();
  });
}

/** test subscribing
 * @return {promise}
 */
function subscribe() {
  return new Promise( (resolve, reject) => {
    console.log('> will subscribe now');
    const data = '{"callbackUrl":"http://localhost:' + port + '/signature_cb","eventName":"STORE:SIGNATURE"}';
    const options = {
      hostname: blockchainadapterHost,
      port: blockchainadapterPort,
      path: '/webhooks/subscribe',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (id) => {
        console.log('> done. got subscription id ' + id);
        if (res.statusCode == 201) {
          resolve(id);
        }
      });

      if (res.statusCode != 201) {
        reject(res.statusCode);
      }
    });

    req.on('error', (e) => {
      reject(e);
    });

    // Write data to request body
    req.write(data);
    req.end();
  });
}

// schedule some tests
testSubscription();

http.createServer(function(req, res) {
  textBody(req, res, function(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end('error');
    }

    console.log('> incoming ' + req.method + ' ' + req.url + ': ' + body);

    if (USE_ACKNOWLEDGE) {
      // acknowledge
      res.statusCode = 202;
    } else {
      // send nack, this will disable further events
      res.statusCode = 204;
    }

    res.end('');
  });
}).listen(port);
