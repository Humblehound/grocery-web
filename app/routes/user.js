let User = require('../models/user');
let Item = require('../models/item');
let passwordHash = require('password-hash');
let jwt = require('jsonwebtoken');
let config = require('config');

function login(req, res) {

    var user = new User(req.body);

    if (!user.email) {
        return res.status(400).json({message: "Email must not be empty"});
    }

    if (!user.password) {
        return res.status(400).json({message: "Password must not be empty"});
    }

    User.findOne({email: user.email}, function (err, databaseuser) {
        if (!databaseuser) {
            return res.status(404).json({message: "User not found"});
        }

        if (!passwordHash.verify(user.password, databaseuser.password)) {
            res.status(403);
            return res.status(403).json({message: "Invalid password"});
        }

        var token = jwt.sign(user, config.secret, {
            expiresIn: 1440 // expires in 24 hours
        });

        res.json({message: "User logged in successfully", token: token, userId: databaseuser._id})
    });
}

function register(req, res) {

    var user = new User(req.body);

    console.log(req.body)

    if (!user.email) {
        console.log(user)
        return res.status(400).json({message: "Email must not be empty"});
    }

    if (!user.password) {
        return res.status(400).json({message: "Password must not be empty"});
    }

    user.password = passwordHash.generate(user.password)
    user.save((err) => {
        if (err) {
            if (err.code == 11000) {
                res.status(403);
                res.json({message: "User already exists!"}, 400);
            } else {
                res.json(err);
            }
        }
        else {
            var token = jwt.sign(user, config.secret, {
                expiresIn: 1440 // expires in 24 hours
            });

            res.json({message: "User registered successfully", token: token, userId: user._id})
        }
    });
}

function deleteUser(req, res) {

    User.findById(req.params.id, (err, user) => {
        Item.remove({owner: user._id},(err, result) => {
            User.remove({_id: req.params.id}, (err, result) => {
                if(err)
                    res.json(err);
                else
                    res.status(200).json({message: "Account deleted"});
            });
        });
    });
}

module.exports = {login, register, deleteUser};