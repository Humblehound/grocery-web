let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//book schema definition
let ItemCountSchema = new Schema(
    {
        device: {type: String, required: true},
        delta: {type: Number, required: true},
        item: {type: Schema.Types.ObjectId, ref: 'Item'}
    }
);

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('ItemCount', ItemCountSchema);