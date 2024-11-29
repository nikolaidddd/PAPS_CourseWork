const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Status = mongoose.model('Status', new Schema({
    value: {
        type: String,
        unique: true
    }
},
{versionKey: false}
));

