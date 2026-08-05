const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    booking: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Booking",

        required: true

    },

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    amount: {

        type: Number,

        required: true

    },

    currency: {

        type: String,

        default: "INR"

    },

    razorpayOrderId: {

        type: String,

        required: true

    },

    razorpayPaymentId: {

        type: String,

        default: ""

    },

    razorpaySignature: {

        type: String,

        default: ""

    },

    paymentStatus: {

        type: String,

        enum: [

            "created",

            "paid",

            "failed"

        ],

        default: "created"

    }

}, {

    timestamps: true

});

module.exports = mongoose.model(

    "Payment",

    paymentSchema

);