const server = require('supertest');
const expect = require('chai').expect;
const app = require('../Server/server.js');

describe("Handle GET requests for JobID submission", function() {
    it("should pass", function(done){
        server(app)
        .get('/getHtml', {id: 1})
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it("should display invalid jobID if jobID is out of range", function(done){
        server(app)
        .get('/getHtml', {id: -1})
        .expect('Invalid JobID')
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});

describe("Handle GET requests for URL submission", () => {
    it("should pass", function(done){
        server(app)
        .get('/getId', {url: "www.google.com"})
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it("should display invalid URL if URL does not return HTML", function(done){
        server(app)
        .get('/getId', {url: "google"})
        .expect(' Not Available (The URL you entered is not valid) ')
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});