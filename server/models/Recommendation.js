const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Destination",
            required: true
        },

        recommendedHotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            default: null
        },

        weatherSummary: {
            type: String,
            default: ""
        },

        budgetSummary: {
            type: String,
            default: ""
        },

        estimatedCost: {
            type: Number,
            default: 0
        },

        recommendation: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

recommendationSchema.index({
    user: 1
});

recommendationSchema.index({
    trip: 1
});

module.exports = mongoose.model(
    "Recommendation",
    recommendationSchema
);