const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    downloadTripPDF,
    downloadBookingPDF
} = require("../controllers/pdfController");

// =======================
// Trip PDF
// =======================
router.get(
    "/trip/:id",
    protect,
    downloadTripPDF
);

// =======================
// Booking Invoice PDF
// =======================
router.get(
    "/booking/:id",
    protect,
    downloadBookingPDF
);

module.exports = router;