'use strict';

var mongoose = require('mongoose');
var Item = require('../models/item');

function postItem(req, res) {
    var newItem = new Item(req.body);

    newItem.save(function (err, item) {
        if (err) {
            res.send(err);
        } else {
            //If no errors, send it back to the client
            res.json({ message: "Item successfully added!", item: item });
        }
    });
}

function getItem(req, res) {
    Item.findById(req.params.id, function (err, item) {
        if (err) res.send(err);
        res.json(item);
    });
}

function deleteItem(req, res) {
    Item.remove({ _id: req.params.id }, function (err, result) {
        res.json({ message: "Item successfully deleted", result: result });
    });
}

function updateItem(req, res) {
    Item.findbyId({ _id: req.params.id }, function (err, item) {
        if (err) res.send(err);
        Object.assign(item, req.body).save(function (err, item) {
            if (err) res.send(err);
            res.json({ message: 'Item updated!', item: item });
        });
    });
}
//export all the functions
module.exports = { getItem: getItem, postItem: postItem, deleteItem: deleteItem, updateItem: updateItem };

//# sourceMappingURL=item-compiled.js.map