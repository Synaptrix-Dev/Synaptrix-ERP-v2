const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    deadline: {
        type: String,
        required: false
    },
    client: {
        type: String,
        required: false
    },
    clientEmail: {
        type: String,
        required: false
    },
    clientPhone: {
        type: String,
        required: false
    },
    tech: [{
        type: String,
        required: false
    }],
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    budget: {
        type: String,
        required: false
    },
    milestones: [{
        name: {
            type: String,
            required: false
        },
        deliveryDate: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: false
        },
        cost: {
            type: String,
            required: false
        }
    }],
    attachements: {
        type: String,
        required: false
    },
    accesibles: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

module.exports = mongoose.model('projects', projectsSchema);
