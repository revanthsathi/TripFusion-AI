const Recommendation = require("../models/Recommendation");
const Trip = require("../models/Trip");
const Hotel = require("../models/Hotel");
const Expense = require("../models/Expense");

const {
    generateTripItinerary
} = require("./geminiService");

// =======================
// Generate Recommendation
// =======================
const generateRecommendation = async (

    userId,

    tripId

) => {

    const trip =
        await Trip.findOne({

            _id: tripId,

            user: userId

        }).populate("destination");

    if (!trip) {

        throw new Error(
            "Trip not found."
        );

    }

    // =======================
    // Hotels
    // =======================
    const hotels =
        await Hotel.find({

            destination: trip.destination._id,

            available: true

        }).sort({

            averageRating: -1

        });

    const bestHotel =
        hotels.length > 0
            ? hotels[0]
            : null;

    // =======================
    // Expenses
    // =======================
    const expenses =
        await Expense.find({

            trip: trip._id

        });

    const totalExpense =
        expenses.reduce(

            (sum, item) =>
                sum + item.amount,

            0

        );

    const remainingBudget =
        trip.estimatedBudget -
        totalExpense;

    const weatherSummary =
        trip.aiResponse?.weather ||
        "Weather data unavailable.";

    const budgetSummary =
`Budget: ₹${trip.estimatedBudget}
Spent: ₹${totalExpense}
Remaining: ₹${remainingBudget}`;

    // =======================
    // AI Recommendation
    // =======================
    const recommendationText =
        await generateTripItinerary({

            destination:
                trip.destination.name,

            budget:
                remainingBudget,

            numberOfDays:
                trip.totalDays,

            travelers:
                trip.travelers,

            interests:
                trip.interests.join(", "),

            weather:
                weatherSummary,

            nearbyHotels:
                bestHotel
                    ? bestHotel.name
                    : "No hotels found",

            nearbyPlaces:
                "",

            nearbyRestaurants:
                ""

        });

    // =======================
    // Save Recommendation
    // =======================
    const recommendation =
        await Recommendation.create({

            user: userId,

            trip: trip._id,

            destination:
                trip.destination._id,

            recommendedHotel:
                bestHotel
                    ? bestHotel._id
                    : null,

            weatherSummary,

            budgetSummary,

            estimatedCost:
                totalExpense,

            recommendation:
                recommendationText

        });

    return recommendation;

};

// =======================
// Get Recommendation History
// =======================
const getRecommendations = async (
    userId
) => {

    return await Recommendation.find({

        user: userId

    })

        .populate(
            "trip",
            "title"
        )

        .populate(
            "destination",
            "name"
        )

        .populate(
            "recommendedHotel",
            "name averageRating"
        )

        .sort({

            createdAt: -1

        });

};

// =======================
// Get Recommendation By ID
// =======================
const getRecommendation = async (

    recommendationId,

    userId

) => {

    const recommendation =
        await Recommendation.findOne({

            _id: recommendationId,

            user: userId

        })

            .populate("trip")

            .populate("destination")

            .populate("recommendedHotel");

    if (!recommendation) {

        throw new Error(
            "Recommendation not found."
        );

    }

    return recommendation;

};

// =======================
// Exports
// =======================
module.exports = {

    generateRecommendation,

    getRecommendations,

    getRecommendation

};