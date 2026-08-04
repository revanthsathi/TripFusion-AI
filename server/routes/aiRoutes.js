const express = require("express");

const router = express.Router();

const {
    generateAITrip
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

router.post(
    "/generate-trip",
    protect,
    generateAITrip
);

module.exports = router;