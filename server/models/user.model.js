const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: false
    },
    workType: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    bankDetails: [{
        accName: { type: String, required: false },
        branch: { type: String, required: false },
        accNum: { type: String, required: false },
        iban: { type: String, required: false },
    }],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

accountSchema.pre('save', async function (next) {
    // Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

// Compare password
accountSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('administrator', accountSchema);
