const testsUtils = require('./testsUtils');
const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;

const globalVersion = '/api/v1';
const route = '/contracts/';
const LocalStorageProvider = require('../providers/LocalStorageProvider');


describe("Tests GET " + route + " API OK", function () {

    it('Get contracts OK', function (done) {
        try {
            let path = globalVersion + route;
            chai.request(testsUtils.getServer())
                .get(`${path}`)
                .end((error, response) => {
                    console.log('response.body: %s', response.body);
                    assert.equal(error, null);
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    assert.exists(response.body);
                    expect(response.body).to.be.an('array');
                    expect(response.body.length).to.equal(3);
                    done();
                });
        } catch (exception) {
            console.log('exception: %s', exception.stack);
            assert.ok(false);
            done();
        }
    });

    xit('Get LocalStorage', function (done) {
        try {

            const setup = async() => {
                const localStorageInstance = new LocalStorageProvider();
                try {
                    await localStorageInstance.initialize();
                } catch (error) {
                    throw error;
                }
                let documents = await localStorageInstance.getDocuments()
                console.log('documents: %s', documents);
                const privateDocument = {
                    "documentId": "id",
                    "type": "contract",
                    "fromMSP": "fromMSP",
                    "toMSP": "toMSP",
                    "data": JSON.stringify({ 'state': 'sent'}),
                    "state": "SENT"
                };
                console.log('privateDocument: %s', privateDocument);


                if (await localStorageInstance.existsDocument(privateDocument.documentId)) {
                    const data = {
                        state: 'state'
                    }
                    await localStorageInstance.updateDocument(privateDocument.documentId, data);
                } else {
                    await localStorageInstance.storeDocument(privateDocument.documentId, privateDocument);
                }

                documents = await localStorageInstance.getDocuments()
                console.log('documents: %s', documents);


                const localStorageInstance2 = new LocalStorageProvider();
                documents = await localStorageInstance2.getDocuments()
                console.log('documents: %s', documents);
                done();
            }
            setup()


        } catch (exception) {
            console.log('exception: %s', exception.stack);
            assert.ok(false);
            done();
        }
    });

    it('Should convert from base64 to string', function (done) {
        base64EncodedString = "SGVsbG8gd29ybGQ=";
        console.log('base64EncodedString: %s', base64EncodedString);
        const decodedString = Buffer.from(base64EncodedString, 'base64').toString();
        console.log('decodedString: %s', decodedString);


        for(var i of ["id1", "id2"]) {
            console.log(i)
        }

        done();
    });
});