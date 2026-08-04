const mongoose = require("mongoose");

const TRIP_TYPES = require("../constants/tripTypes");
const BUDGET_LEVELS = require("../constants/budgetLevels");

const tripSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Destination",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        totalDays: {
            type: Number,
            required: true,
            min: 1
        },

        travelers: {
            type: Number,
            default: 1
        },

        tripType: {
            type: String,
            enum: Object.values(TRIP_TYPES),
            default: TRIP_TYPES.SOLO
        },

        budgetLevel: {
            type: String,
            enum: Object.values(BUDGET_LEVELS),
            default: BUDGET_LEVELS.MEDIUM
        },

        estimatedBudget: {
            type: Number,
            default: 0
        },

        aiBudget: {
            type: Number,
            default: 0
        },

        spentBudget: {
            type: Number,
            default: 0
        },

        interests: [
            {
                type: String
            }
        ],

        // =======================
        // AI Generated Response
        // =======================
        aiResponse: {
            destination: String,
            budget: Number,
            numberOfDays: Number,
            travelers: Number,

            days: [
                {
                    day: Number,
                    morning: String,
                    afternoon: String,
                    evening: String
                }
            ],

            budgetBreakdown: {
                hotel: String,
                food: String,
                transport: String,
                activities: String,
                shopping: String
            },

            recommendedHotels: [
                {
                    name: String,
                    reason: String
                }
            ],

            recommendedRestaurants: [
                {
                    name: String,
                    speciality: String
                }
            ],

            packingTips: [String],

            weatherAdvice: String
        },

        // =======================
        // Manual Itinerary
        // =======================
        itinerary: [
            {
                day: Number,
                title: String,
                activities: [String]
            }
        ],

        hotels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hotel"
            }
        ],

        expenses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Expense"
            }
        ],

        notes: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "planning",
                "ongoing",
                "completed",
                "cancelled"
            ],
            default: "planning"
        },

        isPublic: {
            type: Boolean,
            default: false
        },

        isAITrip: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// =======================
// Indexes
// =======================
tripSchema.index({
    user: 1
});

tripSchema.index({
    destination: 1
});

tripSchema.index({
    status: 1
});

tripSchema.index({
    startDate: 1
});

module.exports = mongoose.model(
    "Trip",
    tripSchema
);