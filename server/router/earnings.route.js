const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const protectAPIsMiddleware = require('../middleware/protectAPI');

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS
const earningController = require('../controller/earnings.controller');

// * CREATING ROUTES
router.route('/create-earning').post(earningController.createEarning);
router.route('/get-earnings').get(earningController.getAllEarnings);
router.route('/get-earning-by-id').get(earningController.getEarningById);
router.route('/update-earning').patch(earningController.updateEarning);
router.route('/share-earning').patch(earningController.updateAccessibles);
router.route('/delete-earning').delete(earningController.deleteEarning);

module.exports = router;