const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            default: null
        },

        roomType: {
            type: String,
            required: true,
            trim: true
        },

        roomsBooked: {
            type: Number,
            required: true,
            min: 1
        },

        numberOfGuests: {
            type: Number,
            required: true,
            min: 1
        },

        checkIn: {
            type: Date,
            required: true
        },

        checkOut: {
            type: Date,
            required: true
        },

        pricePerNight: {
            type: Number,
            required: true
        },

        totalPrice: {
            type: Number,
            required: true
        },

        bookingStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "checked-in",
                "checked-out",
                "cancelled"
            ],
            default: "pending"
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "refunded"
            ],
            default: "pending"
        },

        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "card",
                "upi",
                "wallet"
            ],
            default: "upi"
        },

        specialRequest: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// =======================
// Indexes
// =======================
bookingSchema.index({
    user: 1
});

bookingSchema.index({
    hotel: 1
});

bookingSchema.index({
    bookingStatus: 1
});

bookingSchema.index({
    checkIn: 1,
    checkOut: 1
});

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);