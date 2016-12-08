let mongoose = require('mongoose');
let Item = require('../models/item');
let ItemCount = require('../models/itemCount');

function postItem(req, res) {
    var newItem = new Item(req.body);

    newItem.save((err, item) => {
        if (err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Item successfully added!", item});
        }
    })
}

function getItem(req, res) {
    Item.findById(req.params.id, (err, item) => {
        if (err) res.send(err);
        res.json(item);
    });
}

function getItems(req, res) {
    console.log(req.query.userId)
    Item.find({'owner': req.query.userId}, (err, data) => {
        if (err) res.send(err);
        res.status(200).json(data);
    });
}

function deleteItem(req, res) {
    Item.remove({_id: req.params.id}, (err, result) => {
        res.json({message: "Item successfully deleted", result})
    })
}

function updateItem(req, res) {
    Item.findById({_id: req.params.id}, (err, item) => {
        if (err) res.send(err);
        Object.assign(item, req.body).save((err, item) => {
            if (err) res.send(err);
            res.json({message: 'Item updated!', item});
        })
    })
}

function synchronize(req, res) {
    console.log(req.body);
    ItemCount.findOne({item: req.body.item, device: req.body.device}, (err, item) => {
        if (err) res.send(err);
        if (item == null) {
            var newItemCount = new ItemCount(req.body);
            newItemCount.save((err, item) => {
                if (err) {
                    res.send(err);
                } else {
                    ItemCount.find({item: req.body.item}, (err, items) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log(items);
                            res.json(items);
                        }
                    });
                }
            })
        } else {
            Object.assign(item, req.body).save((err, item) => {
                if (err) {
                    res.send(err);
                } else {
                    ItemCount.find({item: req.body.item}, (err, items) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log(items);
                            res.json(items);
                        }

                    });
                }

            })
        }
    })
}


//export all the functions
module.exports = {getItem, getItems, postItem, deleteItem, updateItem, synchronize};