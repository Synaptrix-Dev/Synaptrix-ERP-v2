const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    accName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    emailAddress: {
        type: String,
        required: false
    },
    authentication: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    accesibles: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

module.exports = mongoose.model('credentials', credentialSchema);