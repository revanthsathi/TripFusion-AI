const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomType: {
            type: String,
            required: true
        },

        pricePerNight: {
            type: Number,
            required: true
        },

        maxGuests: {
            type: Number,
            required: true
        },

        totalRooms: {
            type: Number,
            default: 0
        },

        availableRooms: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        rating: {
            type: Number,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            default: ""
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Destination",
            required: true
        },

        address: {
            type: String,
            required: true
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        contactNumber: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            default: ""
        },

        images: [
            {
                type: String
            }
        ],

        amenities: [
            {
                type: String
            }
        ],

        rooms: [roomSchema],

        averageRating: {
            type: Number,
            default: 0
        },

        totalReviews: {
            type: Number,
            default: 0
        },

        reviews: [reviewSchema],

        available: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

// =======================
// Indexes
// =======================

hotelSchema.index({
    destination: 1
});

hotelSchema.index({
    averageRating: -1
});

hotelSchema.index({
    available: 1
});

hotelSchema.index({
    latitude: 1,
    longitude: 1
});

module.exports = mongoose.model(
    "Hotel",
    hotelSchema
);