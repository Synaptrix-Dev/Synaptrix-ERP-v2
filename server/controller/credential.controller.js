const Credential = require('../models/credentials.model');

exports.createCredential = async (req, res) => {
    try {
        const credential = new Credential(req.body);
        console.log(credential);
        await credential.save();
        res.status(201).json(credential);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find();
        res.status(200).json(credentials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.getAcceisblesCredentials = async (req, res) => {
//     try {
//         const { userId } = req.query;

//         if (!userId) {
//             return res.status(400).json({ message: 'userId is required in query.' });
//         }

//         // Find credentials where the userId exists in the accesibles array
//         const credentials = await Credential.find({ accesibles: userId });

//         res.status(200).json({ credentials });
//     } catch (error) {
//         console.error('Error fetching credentials:', error);
//         res.status(500).json({ message: 'Server error while fetching credentials.' });
//     }
// };

exports.getAccessibleCredentials = async (req, res) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid id in query' });
    }

    const trimmedId = id.trim();

    try {
        const credentials = await Credential.find({ accesibles: trimmedId });
        if (!credentials.length) {
            return res.status(404).json({ message: 'No accessible credentials found for the given id' });
        }

        return res.status(200).json({ credentials });
    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getAccessedCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find({ adminAccess: true });
        res.status(200).json(credentials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCredentialById = async (req, res) => {
    try {
        const credential = await Credential.findById(req.params.id);
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        res.status(200).json(credential);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCredential = async (req, res) => {
    try {
        const { id, ...updateData } = req.query;

        const idsToProcess = Array.isArray(updateData.ids)
            ? updateData.ids
            : [updateData.ids];

        const credential = await Credential.findById(id);

        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        const responses = [];

        for (const idToProcess of idsToProcess) {
            const index = credential.accesibles.indexOf(idToProcess);

            if (index > -1) {
                // ID is already present, remove it
                credential.accesibles.splice(index, 1);
                responses.push({ id: idToProcess, message: 'Access removed' });
            } else {
                // ID not present, add it
                credential.accesibles.push(idToProcess);
                responses.push({ id: idToProcess, message: 'Access granted to admin' });
            }
        }

        await credential.save();

        res.status(200).json({
            message: 'Credential updated successfully',
            results: responses,
            updatedCredential: credential,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteCredential = async (req, res) => {
    try {
        const credential = await Credential.findByIdAndDelete(req.query.id);
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        res.status(200).json({ message: 'Credential deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
