const testsUtils = require('./testsUtils');

before(done => {
    testsUtils.startServer()
        .then(startedServer => {
            done();
        })
        .catch(beforeError => {
            done(beforeError);
        });
});
