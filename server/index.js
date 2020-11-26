const logger = require('./logger');
const ExpressServer = require('./expressServer');
const serverPort = 3000;

const launchServer = async () => {
    try {
        this.expressServer = new ExpressServer(serverPort, 'api/openapi.yaml');
        this.expressServer.launch();
        logger.info('Express server running');
    } catch (error) {
        logger.error('Express Server failure', error.message);
        await this.close();
    }
};

launchServer().catch((e) => logger.error(e));

// for tests
module.exports = this.expressServer.app;
