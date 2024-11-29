const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Address = mongoose.model('Address', new Schema({
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    numHome: {
        type: Number,
        required: true
    }
},
{versionKey: false}
));


