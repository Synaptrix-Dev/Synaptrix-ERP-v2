const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const protectAPIsMiddleware = require('../middleware/protectAPI');

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS - SIMULATION 😎
const credsController = require('../controller/credential.controller')

// * CREATING ROUTES - ADMIN AUTHENTICATION 😎 ============================================
router.route('/post-creds').post(credsController.createCredential);
router.route('/get-creds').get(credsController.getAllCredentials);
router.route('/get-accessed-creds').get(credsController.getAccessibleCredentials);
router.route('/update-creds').put(credsController.updateCredential);
router.route('/delete-creds').delete(credsController.deleteCredential);


module.exports = router;

