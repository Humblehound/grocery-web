'use strict';

var User = require('../models/user');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var config = require('config');

function login(req, res) {

    var user = new User(req.body);

    if (!user.email) {
        res.status(403);
        res.json({ message: "Email must not be empty", user: user });
    }

    if (!user.password) {
        res.status(403);
        res.json({ message: "Password must not be empty", user: user });
    }

    User.findOne({ email: user.email }, function (err, databaseuser) {
        if (!databaseuser) {
            res.status(403);
            return res.json({ message: "User not found", user: user });
        }

        if (!passwordHash.verify(user.password, databaseuser.password)) {
            res.status(403);
            return res.json({ message: "Invalid password", user: user });
        }

        var token = jwt.sign(user, config.secret, {
            expiresIn: 1440 // expires in 24 hours
        });

        databaseuser.populate('items');
        res.json({ message: "User logged in successfully", user: user, token: token });
    });
}

function register(req, res) {

    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            if (err.code == 11000) {
                res.status(403);
                res.json({ message: "User already exists!" });
            } else {
                res.json(err);
            }
        } else {
            res.json({ message: "User registered successfully!" });
        }
    });
}

module.exports = { login: login, register: register };

//# sourceMappingURL=user-compiled.js.map