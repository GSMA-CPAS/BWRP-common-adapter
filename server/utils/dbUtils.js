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

'use strict';

const config = require('../config');
const logger = require('../logger');

const mongoose = require('mongoose');

const connectMongo = (url, createConnectionTimeout, heartbeatFrequency, poolSize) => {
  return new Promise((resolve, reject) => {
    let neverConnected = true;

    mongoose.connection.on('connecting', () => {
      logger.info(`[DbUtils::connectMongo] Connecting to MongoDB... `);
    });

    mongoose.connection.on('error', (error) => {
      logger.error(`[DbUtils::connectMongo] MongoDB connection error: ${JSON.stringify(error)} `);
    });

    mongoose.connection.on('connected', () => {
      neverConnected = false;
      logger.info(`[DbUtils::connectMongo] Connected to MongoDB!`);
    });

    mongoose.connection.on('open', () => {
      logger.info(`[DbUtils::connectMongo] MongoDB connection opened!`);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info(`[DbUtils::connectMongo] MongoDB reconnected!`);
    });

    mongoose.connection.on('reconnectFailed', () => {
      logger.info(`[DbUtils::connectMongo] MongoDB reconnectFailed!`);
    });

    mongoose.connection.on('close', () => {
      logger.info(`[DbUtils::connectMongo] MongoDB connection closed!`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.error(`[DbUtils::connectMongo] MongoDB disconnected!`);
      if (neverConnected === true) {
        reject(new Error('MongoDB disconnected!'));
      }
    });

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,

      serverSelectionTimeoutMS: createConnectionTimeout,
      heartbeatFrequencyMS: heartbeatFrequency,
      poolSize: poolSize
    };

    function connect() {
      mongoose.connect(url, options)
        .then((_resp) => {
          // Do nothing
        })
        .catch((_err) => {
          // Do nothing
        });
    }

    connect();
  });
};

class DbUtils {
  static startAndMaintainDbConnection() {
    return new Promise((resolve, reject) => {
      const mongoUrl = config.DB_URL;
      const mongoCreateConnectionTimeout = config.DB_CREATE_CONNECTION_TIMEOUT;
      const mongoHeartbeatFrequency = config.DB_HEARTBEAT_FREQUENCY;
      const mongoPoolSize = config.DB_POOL_SIZE;

      connectMongo(mongoUrl, mongoCreateConnectionTimeout, mongoHeartbeatFrequency, mongoPoolSize)
        .then((_neverUsed) => {
          // Do nothing
        })
        .catch((err) => {
          logger.error(`[DbUtils::startAndMaintainDbConnection] Could not connect to DB for ${mongoCreateConnectionTimeout} ms. DB Connection = { url: '${mongoUrl}', createConnectionTimeout: '${mongoCreateConnectionTimeout}', heartbeatFrequency: '${mongoHeartbeatFrequency}', poolSize: '${mongoPoolSize}' }`);
          return reject(err);
        });
    });
  }
}

module.exports = DbUtils;
