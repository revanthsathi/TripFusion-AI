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

    // =======================
    // Find Destination
    // =======================

    const destination =
        await Destination.findById(destinationId);

    if (!destination) {
        throw new Error("Destination not found.");
    }

    // =======================
    // Fetch Weather
    // =======================

    let weather = {};

    try {

        weather = await getCurrentWeather(
            destination.name
        );

    } catch (error) {

        console.log("Weather Error:", error.message);

        weather = {
            weather: "Unknown",
            description: "",
            temperature: "",
            humidity: "",
            windSpeed: ""
        };

    }

    // =======================
    // Fetch Nearby Places
    // =======================

    let nearbyPlaces = { places: [] };
    let nearbyHotels = { places: [] };
    let nearbyRestaurants = { places: [] };

    try {

        nearbyPlaces =
            await getNearbyPlaces(
                destination.name,
                "tourism"
            );

    } catch (error) {

        console.log("Nearby Places Error:", error.message);

    }

    try {

        nearbyHotels =
            await getNearbyPlaces(
                destination.name,
                "accommodation"
            );

    } catch (error) {

        console.log("Nearby Hotels Error:", error.message);

    }

    try {

        nearbyRestaurants =
            await getNearbyPlaces(
                destination.name,
                "catering.restaurant"
            );

    } catch (error) {

        console.log("Nearby Restaurants Error:", error.message);

    }

    // =======================
    // Clean Data
    // =======================

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

    // =======================
    // Generate AI Itinerary
    // =======================

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

    // =======================
    // Save Trip
    // =======================

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

module.exports = {

    generateAITrip

};