"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require("../app/models/user");

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var passwordHash = require('password-hash');
chai.use(chaiHttp);

//Our parent block
describe('Users', function () {
    beforeEach(function (done) {
        //Before each test we empty the database
        User.remove({}, function (err) {
            done();
        });
    });

    var user = {
        email: "JohnDoe@gmail.com",
        password: "myAweSomePass"
    };

    describe('Register', function () {
        it('it should register the user', function (done) {
            chai.request(server).post('/register').send(user).end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message', 'User registered successfully!');
                done();
            });
        });
        it('it should fail to register duplicate user', function (done) {

            chai.request(server).post('/register').send(user).end();

            chai.request(server).post('/register').send(user).end(function (err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message', 'User already exists!');
                done();
            });
        });
    });
    describe('Login', function () {
        afterEach(function (done) {
            User.remove({}, function (err) {
                done();
            });
        });

        var user = {
            email: "JohnDoe@gmail.com",
            password: "myAweSomePass"
        };
        it('it should fail to find the user', function (done) {
            chai.request(server).post('/login').send(user).end(function (err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message', 'User not found');
                done();
            });
        });
        it('it should login the user', function (done) {
            var temp = new User({ email: user.email, password: passwordHash.generate(user.password) });
            temp.save(function (err) {
                chai.request(server).post('/login').send(user).end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message', 'User logged in successfully');
                    res.body.should.have.property('token');
                    done();
                });
            });
        });
        it('it should fail verify the password', function (done) {
            var temp = new User({ email: user.email, password: passwordHash.generate(user.password + " ") });
            temp.save(function (err) {
                user.password = "temp";
                chai.request(server).post('/login').send(user).end(function (err, res) {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message', 'Invalid password');
                    done();
                });
            });
        });
    });
});

//# sourceMappingURL=user-compiled.js.map