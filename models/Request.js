const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.Request = mongoose.model('Request', new Schema({
    resident: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Resident'
    },
    type: {
        type: String,
        required: true,
        ref: 'Type'
    },
    status: {
        type: String,
        required: true,
        ref: 'Status'
    },
    date: {
        type: String,
        required: true
    },
    descr: {
        type: String,
        required: true
    },
    executor: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    dispatcher: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    priority: {
        type: String,
        ref: 'Priority'
    },
    typework: {
        name: {
            type: String,
            required: true,
            ref: 'TypeWork'
        },
        work: {
                type: String,
                required: true,
                ref: 'TypeWork'
        }
    }
},
{versionKey: false}
));