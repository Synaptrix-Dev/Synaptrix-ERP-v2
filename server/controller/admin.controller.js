const ADMIN = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.adminRegister = async (req, res) => {
    try {
        const { password, email, fullName, image } = req.body;

        let admin = await ADMIN.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }
        admin = new ADMIN({ password, email, fullName, image });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { password, email } = req.body;
        console.log(req.body);

        let admin = await ADMIN.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'There is no user with this email exists' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        await admin.save();

        const token = jwt.sign(
            {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                isAdmin: admin.isAdmin,
                isSuperAdmin: admin.isSuperAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ email, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getAdminById = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'Missing admin id in query' });
        }

        const admin = await ADMIN.findById({ _id: id });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await ADMIN.find().select('fullName email');
        const filteredAdmins = admins.slice(1); // Exclude the 0th index
        res.status(200).json(filteredAdmins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateAdmin = async (req, res) => {
    const { _id } = req.query;
    const updateData = req.body;

    try {
        const updatedAdmin = await ADMIN.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedAdmin) return res.status(404).json({ error: 'Admin not found.' });

        res.status(200).json(updatedAdmin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    const { _id } = req.query;

    try {
        const deletedAdmin = await ADMIN.findByIdAndDelete(_id);
        if (!deletedAdmin) return res.status(404).json({ error: 'Admin not found.' });

        res.status(200).json({ message: 'Admin deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
