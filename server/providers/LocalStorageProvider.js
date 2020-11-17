'use strict';

const got = require('got');
const config = require('../config');
const logger = require('../logger');

const Database = require('mysqlw');

class LocalStorageProvider {

    constructor() {
        this.database = new Database(config.database);
    }

    getDatabase() {
        return this.database;
    }

    async storeDocument(documentId, data) {
        try {
            const documentData = {
                "documentId": documentId,
                "type": data.type,
                "fromMSP": data.fromMSP,
                "toMSP": data.toMSP,
                "data": data.data,
                "state": data.state
            };
            await this.getDatabase().query('INSERT INTO documents SET ?', documentData);
        } catch (error) {
            logger.error('[LocalStorageAdapter::storeDocument] failed to store document - %s', error.message);
            throw error;
        }
    }

    async updateDocument(documentId, data) {
        try {
            await this.getDatabase().query('UPDATE documents SET ? WHERE documentId=?', [data, documentId]);
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::updateDocument] failed to update document with documentId %s - %s', documentId, error.message);
            throw error;
        }
    }

    async getDocument(documentId) {
        let rows;
        try {
            rows = await this.getDatabase().query('SELECT * FROM documents WHERE documentId=?', documentId);
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::getDocument] failed to get document with id %s - %s', documentId, error.message);
            throw error;
        }
        if (rows.length <= 0) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_NOT_FOUND,
                message: 'Document not found'
            }));
        }
        return rows[0];
    }

    async getDocumentIDFromStorageKey(storageKey) {
        let rows;
        try {
            rows = await this.getDatabase().query('SELECT documentId FROM documents WHERE fromStorageKey=? or toStorageKey=?', [storageKey, storageKey]);
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::getDocumentIDFromStorageKey] failed to get documentId from storageKey %s - %s', storageKey, error.message);
            throw error;
        }
        if (rows.length <= 0) {
            throw new Error(JSON.stringify({
                code: ErrorCodes.ERR_NOT_FOUND,
                message: 'Document not found'
            }));
        }
        return rows[0].documentId;
    }

    async getDocuments(type, state) {
        try {
            if (type && state) {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, `state`, `type` FROM documents WHERE `type` = ? AND state = ?', [type, state]);
            } else if (type) {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, `state`, `type` FROM documents WHERE `type` = ?', [type]);
            } else if (state) {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, `state`, `type` FROM documents WHERE `state` = ?', [state]);
            } else {
                return await this.getDatabase().query('SELECT documentId, fromMSP, toMSP, `state`, `type` FROM documents');
            }
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::getDocuments] failed to get documents - %s', error.message);
            throw error;
        }
    }

    async existsDocument(documentId) {
        try {
            const rows = await this.getDatabase().query('SELECT id FROM documents WHERE documentId = ?', documentId);
            if (rows.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            this.getLogger().error('[LocalStorageAdapter::existsDocument] failed to get document id - %s', error.message);
            throw error;
        }
    }


    async initialize() {
        await this.createTableDocuments();
    }

    async createTableDocuments() {
        logger.info('[LocalStorageAdapter::createTableDocuments] begin!');

        try {
            logger.info('[LocalStorageAdapter::createTableDocuments] describe documents begin');

            await this.database.query('describe documents');
            logger.info('[LocalStorageAdapter::createTableDocuments] describe documents end');

            return false;
        } catch (error) {
            logger.info('[LocalStorageAdapter::createTableDocuments] describe documents error');

            if (error.errno === 1146) {
                logger.info('[LocalStorageAdapter::createTableDocuments] describe documents 1146');

                try {
                    await this.database.query(
                        'CREATE TABLE IF NOT EXISTS documents (' +
                        '`id` INT AUTO_INCREMENT, ' +
                        '`documentId` VARCHAR(128) NOT NULL, ' +
                        '`type` VARCHAR(64) NOT NULL, ' +
                        '`fromMSP` VARCHAR(64) NOT NULL, ' +
                        '`toMSP` VARCHAR(64) NOT NULL, ' +
                        '`data` json NOT NULL, ' +
                        '`state` VARCHAR(64) NOT NULL, ' +
                        '`fromStorageKey` VARCHAR(64) AS (SHA2(CONCAT(fromMSP, documentId), 256)) STORED NOT NULL, ' +
                        '`toStorageKey` VARCHAR(64) AS (SHA2(CONCAT(toMSP, documentId), 256)) STORED NOT NULL, ' +
                        'PRIMARY KEY (id), ' +
                        'UNIQUE INDEX documentId (documentId))');
                    logger.info('[LocalStorageAdapter::createTableDocuments] table documents has been created successfully!');
                    return true;

                } catch (error) {
                    logger.info('[LocalStorageAdapter::createTableDocuments] failed to create documents table - %s ', JSON.stringify(error));
                    throw error;
                }
            } else {
                logger.info('[LocalStorageAdapter::createTableDocuments] Error checking database - %s ', JSON.stringify(error));
                throw error;
            }
        }
    }

}

module.exports = LocalStorageProvider;