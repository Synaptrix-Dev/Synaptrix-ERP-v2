const Project = require('../models/projects.model');


exports.createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        const savedProject = await project.save();
        res.status(201).json({
            success: true,
            data: savedProject
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const query = req.query;
        const projects = await Project.find(query);
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.query.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }
        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


exports.updateProjectAccess = async (req, res) => {
    try {
        const { id, adminId, action } = req.query;

        if (!id || !adminId || !action) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameters: id, adminId, or action'
            });
        }

        if (!['add', 'remove'].includes(action)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid action. Must be "add" or "remove"'
            });
        }

        const update = action === 'add'
            ? { $addToSet: { accesibles: adminId } }
            : { $pull: { accesibles: adminId } };

        const project = await Project.findByIdAndUpdate(
            id,
            update,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Access ${action === 'add' ? 'granted to' : 'revoked from'} admin`,
            updatedProject: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Existing updateProject controller (unchanged, included for reference)
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            req.query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }
        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete(req.query);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update milestone status
exports.updateMilestoneStatus = async (req, res) => {
    try {
        const { projectId, milestoneId, status } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        const milestone = project.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({
                success: false,
                error: 'Milestone not found'
            });
        }

        milestone.status = status;
        await project.save();

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get projects where user ID is in accessibles array
exports.getAccessibleProjects = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const projects = await Project.find({ accesibles: id });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};