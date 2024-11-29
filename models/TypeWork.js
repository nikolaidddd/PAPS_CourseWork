const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.TypeWork = mongoose.model('TypeWork', new Schema({
    name: {
        type: String,
        required: true
    },
    works: [
        {
            type: String,
            required: true
        }
    ]
},
{versionKey: false}
));


