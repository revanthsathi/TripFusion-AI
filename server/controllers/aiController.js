const {
    generateTripItinerary
} = require("../services/geminiService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

const generateAITrip = async (req, res) => {

    try {

        const itinerary =
            await generateTripItinerary(req.body);

        return sendSuccess(
            res,
            200,
            "AI itinerary generated successfully.",
            itinerary
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
    generateAITrip
};