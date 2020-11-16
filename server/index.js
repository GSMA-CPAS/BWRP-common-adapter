const logger = require('./logger');
const ExpressServer = require('./expressServer');


//if (process.env.BSA_CONFIG_DIR == undefined) {
//    console.log('> config directory not defined, please set env var BSA_CONFIG_DIR');
//    process.exit(1);
//}


//if (process.env.BSA_PORT == undefined) {
//    console.log('> port not defined, please set env var BSA_PORT');
//    process.exit(1);
//}

//const serverPort = process.env.BSA_PORT;
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