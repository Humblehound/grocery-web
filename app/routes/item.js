let mongoose = require('mongoose');
let Item = require('../models/item');

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

function deleteItem(req, res) {
    Item.remove({_id: req.params.id}, (err, result) => {
        res.json({message: "Item successfully deleted", result})
    })

}

function updateItem(req, res){
    Item.findById({_id : req.params.id}, (err, item) => {
        if (err) res.send(err);
        Object.assign(item, req.body).save((err, item) => {
            if (err) res.send(err);
            res.json({message: 'Item updated!', item});
        })
    })
}
//export all the functions
module.exports = {getItem, postItem, deleteItem, updateItem};