const {
    generateAITrip,
    getUserTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../services/tripService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Generate AI Trip
// =======================
const generateTrip = async (req, res) => {

    try {

        const trip = await generateAITrip(
            req.user._id,
            req.body
        );

        return sendSuccess(
            res,
            201,
            "AI trip generated successfully.",
            trip
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Get My Trips
// =======================
const getTrips = async (req, res) => {

    try {

        const trips = await getUserTrips(
            req.user._id
        );

        return sendSuccess(
            res,
            200,
            "Trips fetched successfully.",
            trips
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Get Trip By ID
// =======================
const getTrip = async (req, res) => {

    try {

        const trip = await getTripById(
            req.params.id,
            req.user._id
        );

        return sendSuccess(
            res,
            200,
            "Trip fetched successfully.",
            trip
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            404,
            error.message
        );

    }

};

// =======================
// Update Trip
// =======================
const updateTripDetails = async (req, res) => {

    try {

        const trip = await updateTrip(
            req.params.id,
            req.user._id,
            req.body
        );

        return sendSuccess(
            res,
            200,
            "Trip updated successfully.",
            trip
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Delete Trip
// =======================
const removeTrip = async (req, res) => {

    try {

        await deleteTrip(
            req.params.id,
            req.user._id
        );

        return sendSuccess(
            res,
            200,
            "Trip deleted successfully."
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

module.exports = {

    generateTrip,

    getTrips,

    getTrip,

    updateTripDetails,

    removeTrip

};