const {

    generateRecommendation,

    getRecommendations,

    getRecommendation

} = require("../services/recommendationService");

const {

    sendSuccess,

    sendError

} = require("../utils/apiResponse");

// =======================
// Generate Recommendation
// =======================
const generate = async (req, res) => {

    try {

        const recommendation =
            await generateRecommendation(

                req.user._id,

                req.params.tripId

            );

        return sendSuccess(

            res,

            201,

            "Recommendation generated successfully.",

            recommendation

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
// History
// =======================
const history = async (req, res) => {

    try {

        const data =
            await getRecommendations(
                req.user._id
            );

        return sendSuccess(

            res,

            200,

            "Recommendations fetched successfully.",

            data

        );

    } catch (error) {

        return sendError(

            res,

            400,

            error.message

        );

    }

};

// =======================
// Get One
// =======================
const getOne = async (req, res) => {

    try {

        const recommendation =
            await getRecommendation(

                req.params.id,

                req.user._id

            );

        return sendSuccess(

            res,

            200,

            "Recommendation fetched successfully.",

            recommendation

        );

    } catch (error) {

        return sendError(

            res,

            404,

            error.message

        );

    }

};

module.exports = {

    generate,

    history,

    getOne

};