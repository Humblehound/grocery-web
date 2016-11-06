//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require("../app/models/user")

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let passwordHash = require('password-hash');
chai.use(chaiHttp);


//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    let user = {
        email: "JohnDoe@gmail.com",
        password: "myAweSomePass"
    };

    describe('Register', () => {
        it('it should register the user', (done) => {
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message', 'User registered successfully!');
                        done()
                    }
                );
        });
        it('it should fail to register duplicate user', (done) => {

            chai.request(server)
                .post('/register')
                .send(user).end()

            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message', 'User already exists!');
                        done()
                    }
                );
        });
    })
    describe('Login', () => {
        afterEach((done) => {
            User.remove({}, (err) => {
                done();
            });
        });

        let user = {
            email: "JohnDoe@gmail.com",
            password: "myAweSomePass"
        };
        it('it should fail to find the user', (done) => {
            chai.request(server)
                .post('/login')
                .send(user)
                .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message', 'User not found');
                        done()
                    }
                );
        })
        it('it should login the user', (done) => {
            var temp = new User({email: user.email, password: passwordHash.generate(user.password)});
            temp.save((err) => {
                chai.request(server)
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message', 'User logged in successfully');
                            res.body.should.have.property('token');
                            done()
                        }
                    );
            })
        })
        it('it should fail verify the password', (done) => {
            var temp = new User({email: user.email, password: passwordHash.generate(user.password + " ")});
            temp.save((err) => {
                user.password = "temp"
                chai.request(server)
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                            res.should.have.status(403);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message', 'Invalid password');
                            done()
                        }
                    );
            })
        })
    })
});
