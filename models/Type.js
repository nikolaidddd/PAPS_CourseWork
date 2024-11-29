const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Type = mongoose.model('Type', new Schema({
    value: {
        type: String,
        unique: true
    }
},
{versionKey: false}
));


