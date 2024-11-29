const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.PlanRequest = mongoose.model('PlanRequest', new Schema({
    address: {
        type: Schema.Types.ObjectId, 
        ref: 'Address'
    },
    type: {
        type: String,
        ref: 'Type'
    },
    executors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ],
    descr: {
        type: String,
    },
    status: {
        type: String,
        ref: 'Status'
    },
    date_start: {
        type: String,
        required: true
    },
    date_end: {
        type: String,
        required: true
    },
    dispatcher: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }
},
{versionKey: false}
));