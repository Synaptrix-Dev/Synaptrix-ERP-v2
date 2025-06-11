const Earning = require('../models/earnings.model');

exports.createEarning = async (req, res) => {
    try {
        const earning = new Earning(req.body);
        await earning.save();
        res.status(201).json(earning);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all earnings
exports.getAllEarnings = async (req, res) => {
    try {
        const earnings = await Earning.find();
        res.status(200).json(earnings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific earning by ID
exports.getEarningById = async (req, res) => {
    try {
        const earning = await Earning.findById(req.query.id);
        if (!earning) {
            return res.status(404).json({ message: 'Earning not found' });
        }
        res.status(200).json(earning);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an earning by ID
exports.updateEarning = async (req, res) => {
    try {
        const earning = await Earning.findByIdAndUpdate(req.query.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!earning) {
            return res.status(404).json({ message: 'Earning not found' });
        }
        res.status(200).json(earning);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an earning by ID (via param or query)
exports.deleteEarning = async (req, res) => {
    try {
        const earningId = req.params.id || req.query.id;
        const earning = await Earning.findByIdAndDelete(earningId);
        if (!earning) {
            return res.status(404).json({ message: 'Earning not found' });
        }
        res.status(200).json({ message: 'Earning deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAccessibles = async (req, res) => {
    try {
        const { id } = req.query; // Earning ID
        const { adminId, add } = req.body; // adminId to add/remove, add=true to add, false to remove

        const earning = await Earning.findById(id);
        if (!earning) {
            return res.status(404).json({ message: 'Earning not found' });
        }

        if (add) {
            if (!earning.accesibles.includes(adminId)) {
                earning.accesibles.push(adminId);
            }
        } else {
            earning.accesibles = earning.accesibles.filter(id => id !== adminId);
        }

        await earning.save();
        res.status(200).json(earning);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};