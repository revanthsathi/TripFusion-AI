const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    fetchUserDashboard
} = require(
    "../controllers/userDashboardController"
);


// =======================
// User Dashboard
// =======================

router.get(
    "/",
    protect,
    fetchUserDashboard
);


module.exports = router;