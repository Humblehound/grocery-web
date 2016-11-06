let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//book schema definition
let UserSchema = new Schema(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        created: {type: Date, default: Date.now},
        items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
    }
);

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('User', UserSchema);