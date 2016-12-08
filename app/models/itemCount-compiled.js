'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//book schema definition
var ItemCountSchema = new Schema({
    device: { type: String, required: true },
    delta: { type: Number, required: true },
    item: { type: Schema.Types.ObjectId, ref: 'Item' }
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('ItemCount', ItemCountSchema);

//# sourceMappingURL=itemCount-compiled.js.map