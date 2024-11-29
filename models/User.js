const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.User = mongoose.model('User', new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resident: {type: Schema.Types.ObjectId, ref: 'Resident'},
    roles: [{
        type: String,
        required: true,
        ref: 'Role'
    }]
},
{versionKey: false}
));


