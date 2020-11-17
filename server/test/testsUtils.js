const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);


let app = undefined;

class TestsUtils {

    static startServer() {
        return new Promise((resolve, reject) => {
            if (app === undefined) {
                console.log("app never started. Start the app.");
                app = require('../index.js');
                console.log("Wait server starting");
                setTimeout(() => {
                    console.log("Server started");
                    resolve(app);
                }, 4000);
            } else {
                console.log("app already started. Return the app.");
                resolve(app);
            }
        });
    }

    static getServer() {
        return app;
    }

}
module.exports = TestsUtils;