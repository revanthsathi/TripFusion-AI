const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {

    fetchDashboard

} = require("../controllers/dashboardController");

// =======================
// Dashboard
// =======================
router.get(

    "/",

    protect,

    authorize("admin"),

    fetchDashboard

);

module.exports = router;