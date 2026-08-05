const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    validateBooking
} = require("../validators/bookingValidator");

const {

    bookHotel,

    fetchBookings,

    fetchBooking,

    cancelHotelBooking,

    confirmHotelBooking,

    checkIn,

    checkOut,

    fetchAllBookings,

    fetchBookingStats

} = require("../controllers/bookingController");

// =======================
// User Routes
// =======================

// Create Booking
router.post(
    "/",
    protect,
    validateBooking,
    bookHotel
);

// My Bookings
router.get(
    "/",
    protect,
    fetchBookings
);

// =======================
// Admin Routes
// =======================

// Get All Bookings
router.get(
    "/admin/all",
    protect,
    authorize("admin"),
    fetchAllBookings
);

// Booking Statistics
router.get(
    "/admin/statistics",
    protect,
    authorize("admin"),
    fetchBookingStats
);

// Confirm Booking
router.put(
    "/:id/confirm",
    protect,
    authorize("admin"),
    confirmHotelBooking
);

// Check In
router.put(
    "/:id/checkin",
    protect,
    authorize("admin"),
    checkIn
);

// Check Out
router.put(
    "/:id/checkout",
    protect,
    authorize("admin"),
    checkOut
);

// =======================
// User Routes (Keep LAST)
// =======================

// Booking Details
router.get(
    "/:id",
    protect,
    fetchBooking
);

// Cancel Booking
router.put(
    "/:id/cancel",
    protect,
    cancelHotelBooking
);

module.exports = router;