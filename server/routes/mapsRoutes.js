const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    search
} = require("../controllers/mapsController");

// =======================
// Search Location
// =======================
router.get(
    "/search",
    protect,
    search
);

module.exports = router;