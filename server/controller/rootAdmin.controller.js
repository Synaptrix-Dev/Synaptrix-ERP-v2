const ADMIN = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.adminRegister = async (req, res) => {
    try {
        const { password, email, fullName } = req.body;

        let admin = await ADMIN.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }
        admin = new ADMIN({ password, email, fullName });
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
                isSuperAdmin: admin.isSuperAdmin
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

exports.getAdminImage = async (req, res) => {
    try {
        const { ids } = req.query;

        if (!ids) {
            return res.status(400).json({ message: 'Missing admin ids in query' });
        }

        // Split the comma-separated IDs
        const idArray = ids.split(',').map(id => id.trim()).filter(id => id);

        if (idArray.length === 0) {
            return res.status(400).json({ message: 'No valid admin IDs provided' });
        }

        // Fetch admins by IDs
        const admins = await ADMIN.find({ _id: { $in: idArray } }).select('image');

        if (!admins || admins.length === 0) {
            return res.status(404).json({ message: 'No admins found' });
        }

        // Format response to include admin ID and image
        const response = admins.map(admin => ({
            _id: admin._id,
            image: admin.image || null
        }));

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        const admins = await ADMIN.find().select('fullName email isAdmin');
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
