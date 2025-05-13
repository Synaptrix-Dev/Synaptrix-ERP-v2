const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const protectAPIsMiddleware = require('../middleware/protectAPI');
const { verifyAdminToken } = require('../middleware/admin-token-middleware');

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS - SIMULATION 😎
const adminAuth = require('../controller/admin.controller')

// * CREATING ROUTES - ADMIN AUTHENTICATION 😎 ============================================
router.route('/register').post(adminAuth.adminRegister);
router.route('/login').post(adminAuth.adminLogin);
router.route("/authenticate").post(verifyAdminToken, (req, res) => {
  res.status(200).json({
    user: req.user,
    message: "Welcome to SynaptrixSol Administrator Portal",
  });
});

router.route('/get-admins').get(adminAuth.getAllAdmins);
router.route('/get-admin-info').get(adminAuth.getAdminById);
router.route('/update-admin').put(adminAuth.updateAdmin);
router.route('/delete-admins').delete(adminAuth.deleteAdmin);


module.exports = router;

