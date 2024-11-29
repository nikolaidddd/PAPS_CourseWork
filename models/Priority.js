const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Priority = mongoose.model('Priority', new Schema({
    value: {
        type: String,
        unique: true
    }
},
{versionKey: false}
));


