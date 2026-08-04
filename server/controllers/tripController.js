const {
    generateAITrip
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

module.exports = {
    generateTrip
};