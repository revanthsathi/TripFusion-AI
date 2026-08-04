const {

    getCurrentWeather,

    getForecast

} = require("../services/weatherService");

const {

    sendSuccess,

    sendError

} = require("../utils/apiResponse");

// =======================
// Current Weather
// =======================
const current = async (
    req,
    res
) => {

    try {

        const {

            place

        } = req.query;

        if (!place) {

            return sendError(

                res,

                400,

                "Place is required."

            );

        }

        const result =
            await getCurrentWeather(
                place
            );

        return sendSuccess(

            res,

            200,

            "Current weather fetched successfully.",

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
// Forecast
// =======================
const forecast = async (
    req,
    res
) => {

    try {

        const {

            place

        } = req.query;

        if (!place) {

            return sendError(

                res,

                400,

                "Place is required."

            );

        }

        const result =
            await getForecast(
                place
            );

        return sendSuccess(

            res,

            200,

            "Forecast fetched successfully.",

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

    current,

    forecast

};