const {
    searchLocation
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

module.exports = {
    search
};