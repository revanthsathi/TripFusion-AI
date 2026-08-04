const Trip = require("../models/Trip");
const Destination = require("../models/Destination");

const {
    generateTripItinerary
} = require("./geminiService");

// =======================
// Generate AI Trip
// =======================
const generateAITrip = async (
    userId,
    tripData
) => {

    const {
        destinationId,
        title,
        startDate,
        endDate,
        totalDays,
        travelers,
        tripType,
        budgetLevel,
        estimatedBudget,
        interests
    } = tripData;

    // Check Destination
    const destination =
        await Destination.findById(destinationId);

    if (!destination) {
        throw new Error("Destination not found.");
    }

    // Generate AI Itinerary
    const aiResponse =
        await generateTripItinerary({
            destination: destination.name,
            budget: estimatedBudget,
            numberOfDays: totalDays,
            travelers,
            interests: interests.join(", ")
        });

    // Save Trip
    const trip = await Trip.create({

        user: userId,

        destination: destination._id,

        title,

        startDate,

        endDate,

        totalDays,

        travelers,

        tripType,

        budgetLevel,

        estimatedBudget,

        aiBudget: estimatedBudget,

        interests,

        aiResponse,

        isAITrip: true

    });

    return trip;

};

module.exports = {
    generateAITrip
};