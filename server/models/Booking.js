const mongoose = require("mongoose");

const bookingSchema =
    new mongoose.Schema(

        {

            // =======================
            // User
            // =======================

            user: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true

            },

            // =======================
            // Hotel
            // =======================

            hotel: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Hotel",

                required: true

            },

            // =======================
            // Trip
            // =======================

            trip: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Trip",

                default: null

            },

            // =======================
            // Room
            // =======================

            roomType: {

                type: String,

                required: [
                    true,
                    "Room type is required."
                ],

                trim: true,

                maxlength: 100

            },

            // =======================
            // Rooms
            // =======================

            roomsBooked: {

                type: Number,

                required: true,

                min: [
                    1,
                    "At least one room must be booked."
                ],

                max: [
                    20,
                    "Maximum 20 rooms can be booked."
                ]

            },

            // =======================
            // Guests
            // =======================

            numberOfGuests: {

                type: Number,

                required: true,

                min: [
                    1,
                    "At least one guest is required."
                ],

                max: [
                    100,
                    "Maximum 100 guests allowed."
                ]

            },

            // =======================
            // Dates
            // =======================

            checkIn: {

                type: Date,

                required: [
                    true,
                    "Check-in date is required."
                ]

            },

            checkOut: {

                type: Date,

                required: [
                    true,
                    "Check-out date is required."
                ]

            },

            // =======================
            // Pricing
            // =======================

            pricePerNight: {

                type: Number,

                required: true,

                min: [
                    0,
                    "Price cannot be negative."
                ]

            },

            totalPrice: {

                type: Number,

                required: true,

                min: [
                    0,
                    "Total price cannot be negative."
                ]

            },

            // =======================
            // Booking Status
            // =======================

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

            // =======================
            // Payment Status
            // =======================

            paymentStatus: {

                type: String,

                enum: [

                    "pending",

                    "paid",

                    "refunded"

                ],

                default: "pending"

            },

            // =======================
            // Payment Method
            // =======================

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

            // =======================
            // Special Request
            // =======================

            specialRequest: {

                type: String,

                default: "",

                trim: true,

                maxlength: 500

            }

        },

        {

            timestamps: true

        }

    );

// =====================================================
// DATE VALIDATION
// =====================================================

bookingSchema.pre(
    "validate",
    function (next) {

        if (
            this.checkIn &&
            this.checkOut
        ) {

            if (
                this.checkOut <=
                this.checkIn
            ) {

                return next(
                    new Error(
                        "Check-out date must be after check-in date."
                    )
                );

            }

        }

        next();

    }
);

// =====================================================
// PRICE VALIDATION
// =====================================================

bookingSchema.pre(
    "validate",
    function (next) {

        if (
            this.pricePerNight < 0 ||
            this.totalPrice < 0
        ) {

            return next(
                new Error(
                    "Booking prices cannot be negative."
                )
            );

        }

        next();

    }
);

// =====================================================
// INDEXES
// =====================================================

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
    paymentStatus: 1
});

bookingSchema.index({
    checkIn: 1,
    checkOut: 1
});

bookingSchema.index({
    user: 1,
    createdAt: -1
});

module.exports =
    mongoose.model(
        "Booking",
        bookingSchema
    );