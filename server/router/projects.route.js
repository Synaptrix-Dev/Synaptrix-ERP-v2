const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const protectAPIsMiddleware = require('../middleware/protectAPI');

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS - SIMULATION 😎
const projectsController = require('../controller/projects.controller');

// * CREATING ROUTES - 😎 ============================================
router.route('/create').post(projectsController.createProject);
router.route('/get').get(projectsController.getProjects);
router.route('/get-all-projects').get(projectsController.getAllProjects);
router.route('/get-project-by-id').get(projectsController.getProjectById);
router.route('/update-project-access').put(projectsController.updateProjectAccess);
router.route('/delete').delete(projectsController.deleteProject);
router.route('/milestone-status').put(projectsController.updateMilestoneStatus);
router.route('/get-accessible-projects').get(projectsController.getAccessibleProjects);

module.exports = router;