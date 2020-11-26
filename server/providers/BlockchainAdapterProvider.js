'use strict';

const got = require('got');
const config = require('../config');
const logger = require('../logger');

class BlockchainAdapterProvider {

    constructor() {
    }

    /**
     *
     * @param msp
     * @returns {Promise<string>}
     */
    async discovery(msp) {
        try {
            let response;
            if (msp) {
                response = await got(config.BLOCKCHAIN_ADAPTER_URL + '/discovery/msps/' + msp);
            } else {
                response = await got(config.BLOCKCHAIN_ADAPTER_URL + '/discovery/msps');
            }
            return response.body;
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::discovery] failed to discover msp - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @returns {Promise<string>}
     */
    async getPrivateDocumentIDs() {
        try {
            const ids = await got(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents').json();
            logger.debug('[BlockchainAdapterProvider::getPrivateDocumentIDs] all ids: - %s', JSON.stringify(ids));
            return ids; 
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::getPrivateDocumentIDs] failed to get documents - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param documentId
     * @returns {Promise<string>}
     */
    async getPrivateDocument(documentId) {
        try {
            return await got(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents/' + documentId).json();
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::getPrivateDocument] failed to get document - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param documentId
     * @returns {Promise<string>}
     */
    async deletePrivateDocument(documentId) {
        try {
            return await got.delete(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents/' + documentId).json();
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::deletePrivateDocument] failed to get document - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param toMSP
     * @param dataBase64
     * @returns {Promise<string>}
     */
    async uploadPrivateDocument(toMSP, dataBase64) {
        try {
            const response = await got.post(config.BLOCKCHAIN_ADAPTER_URL + '/private-documents', {
                json: {
                    toMSP: toMSP,
                    data: dataBase64
                },
                responseType: 'json'
            });
            return response.body;
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::uploadPrivateDocument] failed to upload document - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param documentId
     * @param msp
     * @returns {Promise<string>}
     */
    async getSignatures(documentId, msp) {
        try {
            const response = await got(config.BLOCKCHAIN_ADAPTER_URL + '/signatures/' + documentId + '/' + msp);
            return response.body;
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::getSignatures] failed to get signatures - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param documentId
     * @param certificate
     * @param algorithm
     * @param signature
     * @returns {Promise<string>}
     */
    async uploadSignature(documentId, certificate, algorithm, signature) {
        try {
            const response = await got.put(config.BLOCKCHAIN_ADAPTER_URL + '/signatures/' + documentId, {
                json: {
                    certificate: certificate,
                    algorithm: algorithm,
                    signature: signature,
                },
                responseType: 'json'
            });
            return response.body;
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::uploadSignature] failed to upload signature - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @param callbackUrl
     * @param eventName
     * @returns {Promise<string>}
     */
    async webhookSubscribe(eventName, callbackUrl) {
        try {
            const response = await got.post(config.BLOCKCHAIN_ADAPTER_URL + '/webhooks/subscribe', {
                json: {
                    "eventName": eventName,
                    "callbackUrl": callbackUrl
                },
                responseType: 'text'
            });
            return response.body;
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::webhookSubscribe] failed to subscribe - %s', error.message);
            throw error;
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            const webhooks = config.BLOCKCHAIN_ADAPTER_WEBHOOKS;
            for (const webhook of webhooks) {
                await this.webhookSubscribe(webhook.eventName, webhook.callbackUrl);
                logger.info('[BlockchainAdapterProvider::initialize] webhook subscribe: %s -> %s', webhook.eventName, webhook.callbackUrl);
            }
        } catch (error) {
            logger.error('[BlockchainAdapterProvider::initialize] failed to initialize adapter - %s', error.message);
            throw error;
        }
    }
}

module.exports = BlockchainAdapterProvider;