const Lead = require('../models/leads.model');

// Create a new lead
exports.createLead = async (req, res) => {
    try {
        const { createdBy, leadID, name, email, phone, company, designation, location, status } = req.body;
        const lead = new Lead({ createdBy, leadID, name, email, phone, designation, company, location, status });
        console.log(req.body);
        const savedLead = await lead.save();
        res.status(201).json(savedLead);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAccessibleLeads = async (req, res) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid id in query' });
    }

    const trimmedId = id.trim();

    try {
        const leads = await Lead.find({ accesibles: trimmedId });
        if (!leads.length) {
            return res.status(404).json({ message: 'No accessible leads found for the given id' });
        }

        return res.status(200).json({ leads });
    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.updateLeadsAccess = async (req, res) => {
    try {
        const { id, ...updateData } = req.query;

        const idsToProcess = Array.isArray(updateData.ids)
            ? updateData.ids
            : [updateData.ids];

        const leads = await Lead.findById(id);

        if (!leads) {
            return res.status(404).json({ message: 'leads not found' });
        }

        const responses = [];

        for (const idToProcess of idsToProcess) {
            const index = leads.accesibles.indexOf(idToProcess);

            if (index > -1) {
                // ID is already present, remove it
                leads.accesibles.splice(index, 1);
                responses.push({ id: idToProcess, message: 'Access removed' });
            } else {
                // ID not present, add it
                leads.accesibles.push(idToProcess);
                responses.push({ id: idToProcess, message: 'Access granted to admin' });
            }
        }

        await leads.save();

        res.status(200).json({
            message: 'leads updated successfully',
            results: responses,
            updatedleads: leads,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all leads
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single lead using query ?id=...
exports.getLeadById = async (req, res) => {
    const { id } = req.query;
    try {
        if (!id) return res.status(400).json({ message: 'Missing id in query' });
        const lead = await Lead.findById(id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.status(200).json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a lead using query ?id=...
exports.updateLead = async (req, res) => {
    const { id } = req.query;
    try {
        if (!id) return res.status(400).json({ message: 'Missing id in query' });
        const updatedLead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLead) return res.status(404).json({ message: 'Lead not found' });
        res.status(200).json(updatedLead);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a lead using query ?id=...
exports.deleteLead = async (req, res) => {
    const { id } = req.query;
    try {
        if (!id) return res.status(400).json({ message: 'Missing id in query' });
        const deletedLead = await Lead.findByIdAndDelete(id);
        if (!deletedLead) return res.status(404).json({ message: 'Lead not found' });
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
