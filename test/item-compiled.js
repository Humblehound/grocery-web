'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Item = require('../app/models/item');
var User = require('../app/models/user');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var config = require('config');
var jwt = require('jsonwebtoken');

chai.use(chaiHttp);

//Our parent block
describe('Items', function () {

    var token;

    before(function (done) {
        var user = new User({ name: "mockUser", password: "mockpassword" });
        token = jwt.sign(user, config.secret, {
            expiresIn: 1440 // expires in 24 hours
        });
        done();
    });
    beforeEach(function (done) {
        //Before each test we empty the database
        Item.remove({}, function (err) {
            done();
        });
    });

    /*
     * Test the /POST route
     */
    describe('/POST item', function () {
        it('it should not POST an item without a name', function (done) {
            var item = {
                price: 0,
                amount: 0
            };
            chai.request(server).post('/item').set('x-access-token', token).send(item).end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('name');
                res.body.errors.name.should.have.property('kind').eql('required');
                done();
            });
        });
        it('it should POST an item', function (done) {
            var owner = new User({
                email: "myMan@gmail.com",
                password: "wtf"
            });
            var item = {
                name: 'duuude',
                price: 0,
                amount: 0,
                owner: owner
            };
            chai.request(server).post('/item').set('x-access-token', token).send(item).end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Item successfully added!');
                res.body.item.should.have.property('name');
                res.body.item.should.have.property('price');
                res.body.item.should.have.property('amount');
                res.body.item.should.have.property('owner');
                done();
            });
        });
    });
    describe('/PUT item', function () {
        it('it should PUT an item', function (done) {
            var item = new Item({ name: "MyMan", price: 1.0, amount: 2 });
            item.save(function (err, item) {
                item.price = 2;
                chai.request(server).put('/item/' + item.id).set('x-access-token', token).send(item).end(function (err, res) {
                    if (err) console.log(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Item updated!');
                    res.body.item.should.have.property('name');
                    res.body.item.should.have.property('price').eql(2);
                    res.body.item.should.have.property('amount').eql(2);
                    done();
                });
            });
        });
    });
});

//# sourceMappingURL=item-compiled.js.map