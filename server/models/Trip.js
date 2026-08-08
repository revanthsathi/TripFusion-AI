const mongoose = require("mongoose");

const TRIP_TYPES =
    require("../constants/tripTypes");

const BUDGET_LEVELS =
    require("../constants/budgetLevels");

const tripSchema =
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
            // Destination
            // =======================

            destination: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Destination",

                required: true

            },

            // =======================
            // Basic Information
            // =======================

            title: {

                type: String,

                required: [
                    true,
                    "Trip title is required."
                ],

                trim: true,

                minlength: 2,

                maxlength: 100

            },

            // =======================
            // Dates
            // =======================

            startDate: {

                type: Date,

                required: [
                    true,
                    "Start date is required."
                ]

            },

            endDate: {

                type: Date,

                required: [
                    true,
                    "End date is required."
                ]

            },

            // =======================
            // Duration
            // =======================

            totalDays: {

                type: Number,

                required: true,

                min: [
                    1,
                    "Trip must be at least 1 day."
                ],

                max: [
                    365,
                    "Trip cannot exceed 365 days."
                ]

            },

            // =======================
            // Travelers
            // =======================

            travelers: {

                type: Number,

                default: 1,

                min: [
                    1,
                    "At least one traveler is required."
                ],

                max: [
                    100,
                    "Maximum 100 travelers allowed."
                ]

            },

            // =======================
            // Trip Type
            // =======================

            tripType: {

                type: String,

                enum:
                    Object.values(
                        TRIP_TYPES
                    ),

                default:
                    TRIP_TYPES.SOLO

            },

            // =======================
            // Budget Level
            // =======================

            budgetLevel: {

                type: String,

                enum:
                    Object.values(
                        BUDGET_LEVELS
                    ),

                default:
                    BUDGET_LEVELS.MEDIUM

            },

            // =======================
            // Budget
            // =======================

            estimatedBudget: {

                type: Number,

                default: 0,

                min: [
                    0,
                    "Budget cannot be negative."
                ]

            },

            aiBudget: {

                type: Number,

                default: 0,

                min: 0

            },

            spentBudget: {

                type: Number,

                default: 0,

                min: 0

            },

            // =======================
            // Interests
            // =======================

            interests: [

                {

                    type: String,

                    trim: true,

                    maxlength: 50

                }

            ],

            // =======================
            // AI Response
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

                        evening: String,

                        estimatedCost: String,

                        weather: String,

                        recommendedTransport: String

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

                packingTips: [

                    String

                ],

                weatherAdvice: String

            },

            // =======================
            // Itinerary
            // =======================

            itinerary: [

                {

                    day: Number,

                    title: String,

                    activities: [

                        String

                    ]

                }

            ],

            // =======================
            // Hotels
            // =======================

            hotels: [

                {

                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "Hotel"

                }

            ],

            // =======================
            // Expenses
            // =======================

            expenses: [

                {

                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "Expense"

                }

            ],

            // =======================
            // Notes
            // =======================

            notes: {

                type: String,

                default: "",

                maxlength: 2000

            },

            // =======================
            // Status
            // =======================

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

            // =======================
            // Visibility
            // =======================

            isPublic: {

                type: Boolean,

                default: false

            },

            // =======================
            // AI Trip
            // =======================

            isAITrip: {

                type: Boolean,

                default: false

            }

        },

        {

            timestamps: true

        }

    );

// =====================================================
// DATE VALIDATION
// =====================================================

tripSchema.pre(
    "validate",
    function (next) {

        if (
            this.startDate &&
            this.endDate &&
            this.endDate <
                this.startDate
        ) {

            return next(
                new Error(
                    "End date must be after start date."
                )
            );

        }

        next();

    }
);

// =====================================================
// INDEXES
// =====================================================

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

tripSchema.index({
    user: 1,
    status: 1
});

module.exports =
    mongoose.model(
        "Trip",
        tripSchema
    );