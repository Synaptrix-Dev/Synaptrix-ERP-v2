const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: false
    },
    clientName: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    platform: {
        type: String,
        required: false
    },
    referenceName: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    amount: {
        type: String,
        required: false
    },
    accesibles: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

module.exports = mongoose.model('earnings', earningSchema);