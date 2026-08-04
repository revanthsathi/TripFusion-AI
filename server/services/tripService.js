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

    const destination =
        await Destination.findById(destinationId);

    if (!destination) {
        throw new Error("Destination not found.");
    }

    const aiResponse =
        await generateTripItinerary({
            destination: destination.name,
            budget: estimatedBudget,
            numberOfDays: totalDays,
            travelers,
            interests: interests.join(", ")
        });

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

// =======================
// Get Logged-in User Trips
// =======================
const getUserTrips = async (userId) => {

    return await Trip.find({
        user: userId
    })
        .populate(
            "destination",
            "name country city images"
        )
        .sort({
            createdAt: -1
        });

};

// =======================
// Get Trip By ID
// =======================
const getTripById = async (
    tripId,
    userId
) => {

    const trip = await Trip.findOne({
        _id: tripId,
        user: userId
    }).populate("destination");

    if (!trip) {
        throw new Error(
            "Trip not found."
        );
    }

    return trip;

};

// =======================
// Update Trip
// =======================
const updateTrip = async (
    tripId,
    userId,
    updateData
) => {

    const trip =
        await Trip.findOneAndUpdate(
            {
                _id: tripId,
                user: userId
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate("destination");

    if (!trip) {
        throw new Error(
            "Trip not found."
        );
    }

    return trip;

};

// =======================
// Delete Trip
// =======================
const deleteTrip = async (
    tripId,
    userId
) => {

    const trip =
        await Trip.findOneAndDelete({
            _id: tripId,
            user: userId
        });

    if (!trip) {
        throw new Error(
            "Trip not found."
        );
    }

    return;

};

module.exports = {

    generateAITrip,

    getUserTrips,

    getTripById,

    updateTrip,

    deleteTrip

};