const Lead = require('../models/leads.model');

// Create a new lead
exports.createLead = async (req, res) => {
    try {
        const { createdBy, leadID, name, email, type, phone, company, designation, location, status } = req.body;
        const lead = new Lead({ createdBy, leadID, type, name, email, phone, designation, company, location, status });
        console.log(req.body);
        const savedLead = await lead.save();
        res.status(201).json(savedLead);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.createBulkLead = async (req, res) => {
    try {
        const leadsData = req.body; // Expecting an array or single object
        let savedLeads;

        // Check if req.body is an array for bulk creation
        if (Array.isArray(leadsData)) {
            // Validate and map each lead to ensure required fields are present
            const leads = leadsData.map(({ createdBy, leadID, name, email, website, type, phone, company, designation, location, status }) => {
                if (!createdBy || !leadID || !name || !email) {
                    throw new Error('Missing required fields in one or more leads');
                }
                return { createdBy, leadID, type, name, email, phone, designation, website, company, location, status };
            });

            // Bulk insert leads
            savedLeads = await Lead.insertMany(leads);
        } else {
            // Handle single lead creation (existing logic)
            const { createdBy, leadID, name, email, type, phone, company, designation, location, status } = leadsData;
            if (!createdBy || !leadID || !name || !email) {
                throw new Error('Missing required fields');
            }
            const lead = new Lead({ createdBy, leadID, type, name, email, phone, designation, company, location, status });
            savedLeads = await lead.save();
        }

        // Return the saved lead(s)
        res.status(201).json(savedLeads);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// exports.getAccessibleLeads = async (req, res) => {
//     const { id } = req.query;

//     if (!id || typeof id !== 'string') {
//         return res.status(400).json({ message: 'Missing or invalid id in query' });
//     }

//     const trimmedId = id.trim();

//     try {
//         const leads = await Lead.find({ accesibles: trimmedId });
//         if (!leads.length) {
//             return res.status(404).json({ message: 'No accessible leads found for the given id' });
//         }

//         return res.status(200).json({ leads });
//     } catch (error) {
//         console.error('❌ Error:', error);
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };

exports.getAccessibleLeads = async (req, res) => {
    const { id, page = 1, limit = 10, search, status, source, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Validate id
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid id in query' });
    }

    const trimmedId = id.trim();

    // Build query
    const query = { accesibles: trimmedId };

    // Add search functionality (assuming leads have fields like name, email, etc.)
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    // Add filters
    if (status) {
        query.status = status;
    }
    if (source) {
        query.source = source;
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    try {
        // Execute query with pagination and sorting
        const [leads, total] = await Promise.all([
            Lead.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Lead.countDocuments(query),
        ]);

        // Return empty leads with pagination data instead of 404
        return res.status(200).json({
            leads,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
            },
            message: leads.length === 0 ? 'No leads found with this filter/search' : undefined,
        });
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
// exports.getAllLeads = async (req, res) => {
//     try {
//         const leads = await Lead.find();
//         res.status(200).json(leads);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.getAllLeads = async (req, res) => {
    try {
        // Extract pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object from query parameters
        const filter = {};

        // Handle search query
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                // Add more fields to search as needed, e.g., { phone: searchRegex }
            ];
        }

        // Add specific filters
        if (req.query.status) filter.status = req.query.status;
        if (req.query.source) filter.source = req.query.source;

        // Query leads with pagination, filters, and search
        const leads = await Lead.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by creation date (newest first)

        // Get total count for pagination metadata
        const total = await Lead.countDocuments(filter);

        res.status(200).json({
            leads,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
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
