const express = require("express");

const router = express.Router();

const {
    generateTrip,
    getTrips,
    getTrip,
    updateTripDetails,
    removeTrip
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

// =======================
// Get My Trips
// =======================
router.get(
    "/",
    protect,
    getTrips
);

// =======================
// Get Trip By ID
// =======================
router.get(
    "/:id",
    protect,
    getTrip
);

// =======================
// Update Trip
// =======================
router.put(
    "/:id",
    protect,
    updateTripDetails
);

// =======================
// Delete Trip
// =======================
router.delete(
    "/:id",
    protect,
    removeTrip
);

module.exports = router;