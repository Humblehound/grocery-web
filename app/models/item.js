let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//book schema definition
let ItemSchema = new Schema(
    {
        name: {type: String, required: true},
        store: {type: String},
        price: {type: Number, required: true},
        amount: {type: Number, required: true},
        owner: {type: Schema.Types.ObjectId, ref: 'User'}
    }
);

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('Item', ItemSchema);