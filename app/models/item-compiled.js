'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//book schema definition
var ItemSchema = new Schema({
    name: { type: String, required: true },
    store: { type: String },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('item', ItemSchema);

//# sourceMappingURL=item-compiled.js.map