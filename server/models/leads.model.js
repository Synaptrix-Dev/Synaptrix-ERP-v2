const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    leadID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    accesibles: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

module.exports = mongoose.model('leads', leadSchema);