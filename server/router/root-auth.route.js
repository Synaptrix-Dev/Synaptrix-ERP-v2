const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const protectAPIsMiddleware = require('../middleware/protectAPI');
const { verifyRootToken } = require('../middleware/root-token-middleware');

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS - SIMULATION 😎
const rootAuth = require('../controller/rootAdmin.controller')

// * CREATING ROUTES - ADMIN AUTHENTICATION 😎 ============================================
router.route('/register').post(rootAuth.adminRegister);
router.route('/login').post(rootAuth.adminLogin);
router.route("/authenticate").post(verifyRootToken, (req, res) => {
  res.status(200).json({
    user: req.user,
    message: "Welcome to SynaptrixSol Root Portal",
  });
});

router.route('/get-admins').get(rootAuth.getAllAdmins);
router.route('/get-admin-info').get(rootAuth.getAdminById);
router.route('/update-admin').put(rootAuth.updateAdmin);
router.route('/delete-admins').delete(rootAuth.deleteAdmin);
router.route('/get-image').get(rootAuth.getAdminImage);


module.exports = router;

