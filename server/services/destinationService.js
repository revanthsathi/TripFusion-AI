const Destination = require("../models/Destination");

// =======================
// Create Destination
// =======================
const createDestination = async (data) => {

    const destination = await Destination.create(data);

    return destination;

};

// =======================
// Get All Destinations
// =======================
const getAllDestinations = async () => {

    return await Destination.find()
        .sort({
            createdAt: -1
        });

};

// =======================
// Get Destination By ID
// =======================
const getDestinationById = async (id) => {

    const destination = await Destination.findById(id);

    if (!destination) {
        throw new Error("Destination not found.");
    }

    return destination;

};

// =======================
// Update Destination
// =======================
const updateDestination = async (
    id,
    data
) => {

    const destination =
        await Destination.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        );

    if (!destination) {
        throw new Error("Destination not found.");
    }

    return destination;

};

// =======================
// Delete Destination
// =======================
const deleteDestination = async (id) => {

    const destination =
        await Destination.findByIdAndDelete(id);

    if (!destination) {
        throw new Error("Destination not found.");
    }

    return;

};

module.exports = {
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
};