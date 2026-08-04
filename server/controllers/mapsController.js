const {
    searchLocation,
    getRoute,
    getNearbyPlaces
} = require("../services/mapsService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Search Location
// =======================
const search = async (req, res) => {

    try {

        const { place } = req.query;

        if (!place) {
            return sendError(
                res,
                400,
                "Place query is required."
            );
        }

        const location =
            await searchLocation(place);

        return sendSuccess(
            res,
            200,
            "Location fetched successfully.",
            location
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
// Route
// =======================
const route = async (req, res) => {

    try {

        const { start, end } = req.query;

        if (!start || !end) {
            return sendError(
                res,
                400,
                "Start and End are required."
            );
        }

        const result =
            await getRoute(start, end);

        return sendSuccess(
            res,
            200,
            "Route fetched successfully.",
            result
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
// Nearby Places
// =======================
const nearby = async (req, res) => {

    try {

        const {
            place,
            type
        } = req.query;

        if (!place) {

            return sendError(
                res,
                400,
                "Place is required."
            );

        }

        const result =
            await getNearbyPlaces(
                place,
                type || "tourism"
            );

        return sendSuccess(
            res,
            200,
            "Nearby places fetched successfully.",
            result
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

    search,

    route,

    nearby

};