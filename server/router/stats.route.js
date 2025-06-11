const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const protectAPIsMiddleware = require("../middleware/protectAPI");

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS - SIMULATION 😎
const statsController = require("../controller/stats.controller");

// * CREATING ROUTES - 😎 ============================================
router.route("/get").get(statsController.getStats);


module.exports = router;
