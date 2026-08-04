const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Destination",
            required: true
        },

        address: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        images: [
            String
        ],

        pricePerNight: {
            type: Number,
            default: 0
        },

        currency: {
            type: String,
            default: "INR"
        },

        rating: {
            type: Number,
            default: 0
        },

        amenities: [
            String
        ],

        latitude: Number,

        longitude: Number,

        contactNumber: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

hotelSchema.index({
    destination: 1
});

module.exports = mongoose.model(
    "Hotel",
    hotelSchema
);