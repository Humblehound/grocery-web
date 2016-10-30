'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//book schema definition
var UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now },
    items: [{ type: Schema.Types.ObjectId, ref: 'item' }]
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('user', UserSchema);

//# sourceMappingURL=user-compiled.js.map