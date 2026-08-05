const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// =======================
// Create Razorpay Order
// =======================
const createOrder = async (

    bookingId,

    userId

) => {

    const booking =
        await Booking.findOne({

            _id: bookingId,

            user: userId

        });

    if (!booking) {

        throw new Error(
            "Booking not found."
        );

    }

    if (
        booking.paymentStatus ===
        "paid"
    ) {

        throw new Error(
            "Booking already paid."
        );

    }

    const options = {

        amount:
            booking.totalPrice * 100,

        currency: "INR",

        receipt:
            `booking_${booking._id}`

    };

    const order =
        await razorpay.orders.create(
            options
        );

    const payment =
        await Payment.create({

            booking:
                booking._id,

            user: userId,

            amount:
                booking.totalPrice,

            currency:
                "INR",

            razorpayOrderId:
                order.id

        });

    return {

        payment,

        order

    };

};

// =======================
// Verify Payment
// =======================
const verifyPayment = async (

    paymentData

) => {

    const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature

    } = paymentData;

    const body =

        razorpay_order_id +
        "|" +
        razorpay_payment_id;

    const expectedSignature =

        crypto

            .createHmac(

                "sha256",

                process.env.RAZORPAY_KEY_SECRET

            )

            .update(body)

            .digest("hex");

    if (

        expectedSignature !==
        razorpay_signature

    ) {

        throw new Error(
            "Invalid payment signature."
        );

    }

    const payment =
        await Payment.findOne({

            razorpayOrderId:
                razorpay_order_id

        });

    if (!payment) {

        throw new Error(
            "Payment not found."
        );

    }

    payment.razorpayPaymentId =
        razorpay_payment_id;

    payment.razorpaySignature =
        razorpay_signature;

    payment.paymentStatus =
        "paid";

    await payment.save();

    const booking =
        await Booking.findById(

            payment.booking

        );

    booking.paymentStatus =
        "paid";

    await booking.save();

    return payment;

};
// =======================
// Get Payment By Booking
// =======================
const getPayment = async (

    bookingId,

    userId

) => {

    const payment =
        await Payment.findOne({

            booking: bookingId,

            user: userId

        })

            .populate(

                "booking"

            );

    if (!payment) {

        throw new Error(
            "Payment not found."
        );

    }

    return payment;

};

// =======================
// Get My Payments
// =======================
const getUserPayments = async (

    userId

) => {

    return await Payment.find({

        user: userId

    })

        .populate(

            "booking"

        )

        .sort({

            createdAt: -1

        });

};

// =======================
// Exports
// =======================
module.exports = {

    createOrder,

    verifyPayment,

    getPayment,

    getUserPayments

};