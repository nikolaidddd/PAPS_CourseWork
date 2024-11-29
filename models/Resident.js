const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Resident = mongoose.model('Resident', new Schema({
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
    address: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    numApart: {
        type: Number,
        required: true
    }
},
{versionKey: false}
));


