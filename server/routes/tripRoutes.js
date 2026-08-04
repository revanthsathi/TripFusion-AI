const express = require("express");

const router = express.Router();

const {
    generateTrip
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");

// =======================
// Generate AI Trip
// =======================
router.post(
    "/generate",
    protect,
    generateTrip
);

module.exports = router;