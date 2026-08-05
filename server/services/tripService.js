const Trip = require("../models/Trip");
const Destination = require("../models/Destination");

const {
    generateTripItinerary
} = require("./geminiService");

const {
    getCurrentWeather
} = require("./weatherService");

const {
    getNearbyPlaces
} = require("./mapsService");

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

    let weather = {};

    try {

        weather =
            await getCurrentWeather(
                destination.name
            );

    } catch (error) {

        weather = {
            weather: "Unknown",
            description: "",
            temperature: "",
            humidity: "",
            windSpeed: ""
        };

    }

    let nearbyPlaces = { places: [] };
    let nearbyHotels = { places: [] };
    let nearbyRestaurants = { places: [] };

    try {

        nearbyPlaces =
            await getNearbyPlaces(
                destination.name,
                "tourism"
            );

    } catch (error) {}

    try {

        nearbyHotels =
            await getNearbyPlaces(
                destination.name,
                "accommodation"
            );

    } catch (error) {}

    try {

        nearbyRestaurants =
            await getNearbyPlaces(
                destination.name,
                "catering.restaurant"
            );

    } catch (error) {}

    const attractions = [

        ...new Set(

            nearbyPlaces.places

                .filter(place => place.name)

                .map(place => place.name)

        )

    ].join(", ");

    const hotels = [

        ...new Set(

            nearbyHotels.places

                .filter(place => place.name)

                .map(place => place.name)

        )

    ].join(", ");

    const restaurants = [

        ...new Set(

            nearbyRestaurants.places

                .filter(place => place.name)

                .map(place => place.name)

        )

    ].join(", ");

    const aiResponse =
        await generateTripItinerary({

            destination: destination.name,

            budget: estimatedBudget,

            numberOfDays: totalDays,

            travelers,

            interests: interests.join(", "),

            weather,

            nearbyPlaces: attractions,

            nearbyHotels: hotels,

            nearbyRestaurants: restaurants

        });

    const trip =
        await Trip.create({

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

            spentBudget: 0,

            interests,

            aiResponse,

            isAITrip: true

        });

    return trip;

};

// =======================
// Get User Trips
// =======================
const getUserTrips = async (
    userId
) => {

    return await Trip.find({

        user: userId

    })

        .populate(
            "destination",
            "name country state"
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

    const trip =
        await Trip.findOne({

            _id: tripId,

            user: userId

        })

            .populate("destination");

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
        await Trip.findOne({

            _id: tripId,

            user: userId

        });

    if (!trip) {

        throw new Error(
            "Trip not found."
        );

    }

    Object.assign(
        trip,
        updateData
    );

    await trip.save();

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
        await Trip.findOne({

            _id: tripId,

            user: userId

        });

    if (!trip) {

        throw new Error(
            "Trip not found."
        );

    }

    await Trip.findByIdAndDelete(
        tripId
    );

    return true;

};

// =======================
// Exports
// =======================
module.exports = {

    generateAITrip,

    getUserTrips,

    getTripById,

    updateTrip,

    deleteTrip

};