const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Employee = mongoose.model('Employee', new Schema({
    surname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        required: true,
        ref: 'Role'
    }]
},
{versionKey: false}
));


