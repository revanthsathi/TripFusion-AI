const {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    searchHotels,
    addReview,
    getReviews
} = require("../services/hotelService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Create Hotel
// =======================
const addHotel = async (req, res) => {

    try {

        const hotel = await createHotel(req.body);

        return sendSuccess(
            res,
            201,
            "Hotel created successfully.",
            hotel
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
// Get Hotels
// =======================
const fetchHotels = async (req, res) => {

    try {

        const hotels = await getHotels(req.query);

        return sendSuccess(
            res,
            200,
            "Hotels fetched successfully.",
            hotels
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
// Get Hotel By ID
// =======================
const fetchHotel = async (req, res) => {

    try {

        const hotel = await getHotelById(req.params.id);

        return sendSuccess(
            res,
            200,
            "Hotel fetched successfully.",
            hotel
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
// Update Hotel
// =======================
const editHotel = async (req, res) => {

    try {

        const hotel = await updateHotel(
            req.params.id,
            req.body
        );

        return sendSuccess(
            res,
            200,
            "Hotel updated successfully.",
            hotel
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
// Delete Hotel
// =======================
const removeHotel = async (req, res) => {

    try {

        await deleteHotel(req.params.id);

        return sendSuccess(
            res,
            200,
            "Hotel deleted successfully."
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
// Search Hotels
// =======================
const search = async (req, res) => {

    try {

        const hotels = await searchHotels(
            req.query.keyword
        );

        return sendSuccess(
            res,
            200,
            "Hotels fetched successfully.",
            hotels
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
// Add Review
// =======================
const createReview = async (req, res) => {

    try {

        const hotel = await addReview(

            req.params.id,

            req.user._id,

            req.body

        );

        return sendSuccess(

            res,

            201,

            "Review added successfully.",

            hotel

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
// Get Reviews
// =======================
const fetchReviews = async (req, res) => {

    try {

        const reviews = await getReviews(

            req.params.id

        );

        return sendSuccess(

            res,

            200,

            "Reviews fetched successfully.",

            reviews

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

    addHotel,

    fetchHotels,

    fetchHotel,

    editHotel,

    removeHotel,

    search,

    createReview,

    fetchReviews

};