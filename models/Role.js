const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Role = mongoose.model('Role', new Schema({
    value: {
        type: String,
        unique: true,
    }
},
{versionKey: false}
));