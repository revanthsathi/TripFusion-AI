const {
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
} = require("../services/destinationService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Create Destination
// =======================
const create = async (req, res) => {

    try {

        const destination =
            await createDestination(req.body);

        return sendSuccess(
            res,
            201,
            "Destination created successfully.",
            destination
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
// Get All Destinations
// =======================
const getAll = async (req, res) => {

    try {

        const destinations =
            await getAllDestinations();

        return sendSuccess(
            res,
            200,
            "Destinations fetched successfully.",
            destinations
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
// Get Destination By ID
// =======================
const getById = async (req, res) => {

    try {

        const destination =
            await getDestinationById(
                req.params.id
            );

        return sendSuccess(
            res,
            200,
            "Destination fetched successfully.",
            destination
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
// Update Destination
// =======================
const update = async (req, res) => {

    try {

        const destination =
            await updateDestination(
                req.params.id,
                req.body
            );

        return sendSuccess(
            res,
            200,
            "Destination updated successfully.",
            destination
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
// Delete Destination
// =======================
const remove = async (req, res) => {

    try {

        await deleteDestination(
            req.params.id
        );

        return sendSuccess(
            res,
            200,
            "Destination deleted successfully."
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
    create,
    getAll,
    getById,
    update,
    remove
};