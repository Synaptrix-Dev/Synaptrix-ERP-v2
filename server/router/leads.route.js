const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const protectAPIsMiddleware = require('../middleware/protectAPI');

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS - SIMULATION 😎
const leadsController = require('../controller/leads.controller')

// * CREATING ROUTES - ADMIN AUTHENTICATION 😎 ============================================
router.route('/add-lead').post(leadsController.createLead);
router.route('/add-bulk-lead').post(leadsController.createBulkLead);
router.route('/get-leads').get(leadsController.getAllLeads);
router.route('/get-accessed-leads').get(leadsController.getAccessibleLeads);
router.route('/update-lead').put(leadsController.updateLead);
router.route('/update-leads-access').put(leadsController.updateLeadsAccess);
router.route('/delete-lead').delete(leadsController.deleteLead);


module.exports = router;

