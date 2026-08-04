const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        country: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            required: true
        },

        images: [
            {
                type: String
            }
        ],

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        averageBudget: {
            type: Number,
            default: 0
        },

        bestSeason: {
            type: String,
            default: ""
        },

        weatherType: {
            type: String,
            default: ""
        },

        famousPlaces: [
            {
                type: String
            }
        ],

        activities: [
            {
                type: String
            }
        ],

        languages: [
            {
                type: String
            }
        ],

        currency: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        tags: [
            {
                type: String
            }
        ],

        isPopular: {
            type: Boolean,
            default: false
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

// Indexes
destinationSchema.index({
    name: 1,
    country: 1
});

destinationSchema.index({
    tags: 1
});

destinationSchema.index({
    latitude: 1,
    longitude: 1
});

module.exports = mongoose.model(
    "Destination",
    destinationSchema
);