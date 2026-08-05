const {
    createBooking,
    getBookings,
    getBooking,
    cancelBooking,
    confirmBooking,
    checkInBooking,
    checkOutBooking,
    getAllBookings,
    getBookingStatistics
} = require("../services/bookingService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Create Booking
// =======================
const bookHotel = async (req, res) => {
    try {

        const booking = await createBooking(
            req.user._id,
            req.body
        );

        return sendSuccess(
            res,
            201,
            "Hotel booked successfully.",
            booking
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }
};

// =======================
// User Bookings
// =======================
const fetchBookings = async (req, res) => {

    try {

        const bookings =
            await getBookings(
                req.user._id
            );

        return sendSuccess(
            res,
            200,
            "Bookings fetched successfully.",
            bookings
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Booking By ID
// =======================
const fetchBooking = async (req, res) => {

    try {

        const booking =
            await getBooking(
                req.params.id,
                req.user._id
            );

        return sendSuccess(
            res,
            200,
            "Booking fetched successfully.",
            booking
        );

    } catch (error) {

        return sendError(
            res,
            404,
            error.message
        );

    }

};

// =======================
// Cancel Booking
// =======================
const cancelHotelBooking = async (req, res) => {

    try {

        const booking =
            await cancelBooking(
                req.params.id,
                req.user._id
            );

        return sendSuccess(
            res,
            200,
            "Booking cancelled successfully.",
            booking
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Admin Confirm Booking
// =======================
const confirmHotelBooking = async (req, res) => {

    try {

        const booking =
            await confirmBooking(
                req.params.id
            );

        return sendSuccess(
            res,
            200,
            "Booking confirmed successfully.",
            booking
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Check In
// =======================
const checkIn = async (req, res) => {

    try {

        const booking =
            await checkInBooking(
                req.params.id
            );

        return sendSuccess(
            res,
            200,
            "Guest checked in successfully.",
            booking
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Check Out
// =======================
const checkOut = async (req, res) => {

    try {

        const booking =
            await checkOutBooking(
                req.params.id
            );

        return sendSuccess(
            res,
            200,
            "Guest checked out successfully.",
            booking
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Admin All Bookings
// =======================
const fetchAllBookings = async (req, res) => {

    try {

        const bookings =
            await getAllBookings();

        return sendSuccess(
            res,
            200,
            "All bookings fetched successfully.",
            bookings
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Booking Statistics
// =======================
const fetchBookingStats = async (req, res) => {

    try {

        const stats =
            await getBookingStatistics();

        return sendSuccess(
            res,
            200,
            "Booking statistics fetched successfully.",
            stats
        );

    } catch (error) {

        return sendError(
            res,
            400,
            error.message
        );

    }

};

module.exports = {

    bookHotel,

    fetchBookings,

    fetchBooking,

    cancelHotelBooking,

    confirmHotelBooking,

    checkIn,

    checkOut,

    fetchAllBookings,

    fetchBookingStats

};