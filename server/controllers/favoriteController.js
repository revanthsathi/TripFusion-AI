const {

    addHotelFavorite,

    addDestinationFavorite,

    getFavorites,

    removeFavorite

} = require("../services/favoriteService");

const {

    sendSuccess,

    sendError

} = require("../utils/apiResponse");

// =======================
// Add Hotel Favorite
// =======================
const addHotel = async (req, res) => {

    try {

        const favorite =
            await addHotelFavorite(

                req.user._id,

                req.params.id

            );

        return sendSuccess(

            res,

            201,

            "Hotel added to favorites.",

            favorite

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
// Add Destination Favorite
// =======================
const addDestination = async (req, res) => {

    try {

        const favorite =
            await addDestinationFavorite(

                req.user._id,

                req.params.id

            );

        return sendSuccess(

            res,

            201,

            "Destination added to favorites.",

            favorite

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
// Get Favorites
// =======================
const fetchFavorites = async (req, res) => {

    try {

        const favorites =
            await getFavorites(

                req.user._id

            );

        return sendSuccess(

            res,

            200,

            "Favorites fetched successfully.",

            favorites

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
// Remove Favorite
// =======================
const deleteFavorite = async (req, res) => {

    try {

        await removeFavorite(

            req.params.id,

            req.user._id

        );

        return sendSuccess(

            res,

            200,

            "Favorite removed successfully."

        );

    } catch (error) {

        return sendError(

            res,

            400,

            error.message

        );

    }

};

module.exports = {

    addHotel,

    addDestination,

    fetchFavorites,

    deleteFavorite

};