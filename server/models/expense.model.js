const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    date: {
        type: String,
        required: false
    },
    investedAt: {
        type: String,
        required: false
    },
    amount: {
        type: String,
        required: false
    },
    receiptsCodes: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    outstandingAmount: {
        type: String,
        required: false
    },
    contribution: {
        type: String,
        required: false
    },
    accesibles: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

module.exports = mongoose.model('leads', leadSchema);