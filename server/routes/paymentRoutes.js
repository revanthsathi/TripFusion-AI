const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    createPaymentOrder,

    verifyPaymentOrder,

    fetchPayment,

    fetchPayments

} = require("../controllers/paymentController");

// =======================
// Create Razorpay Order
// =======================
router.post(

    "/create-order",

    protect,

    createPaymentOrder

);

// =======================
// Verify Payment
// =======================
router.post(

    "/verify",

    protect,

    verifyPaymentOrder

);

// =======================
// Payment History
// =======================
router.get(

    "/",

    protect,

    fetchPayments

);

// =======================
// Payment By Booking
// =======================
router.get(

    "/:bookingId",

    protect,

    fetchPayment

);

module.exports = router;