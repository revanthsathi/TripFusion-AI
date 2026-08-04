const Destination = require("../models/Destination");

const {
    uploadMultipleImages
} = require("../utils/cloudinaryUpload");

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
const getAllDestinations = async (query) => {

    const {
        search,
        country,
        minRating,
        minBudget,
        maxBudget,
        popular,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc"
    } = query;

    const filter = {};

    // Search by destination name
    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        };
    }

    // Filter by country
    if (country) {
        filter.country = country;
    }

    // Filter by minimum rating
    if (minRating) {
        filter.rating = {
            $gte: Number(minRating)
        };
    }

    // Filter by budget
    if (minBudget || maxBudget) {

        filter.averageBudget = {};

        if (minBudget) {
            filter.averageBudget.$gte = Number(minBudget);
        }

        if (maxBudget) {
            filter.averageBudget.$lte = Number(maxBudget);
        }

    }

    // Popular destinations
    if (popular === "true") {
        filter.isPopular = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortOption = {
        [sortBy]: order === "asc" ? 1 : -1
    };

    const destinations = await Destination.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

    const total = await Destination.countDocuments(filter);

    return {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        destinations
    };

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
const updateDestination = async (id, data) => {

    const destination = await Destination.findByIdAndUpdate(
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

    const destination = await Destination.findByIdAndDelete(id);

    if (!destination) {
        throw new Error("Destination not found.");
    }

    return;

};
// =======================
// Upload Destination Images
// =======================
const uploadDestinationImages = async (
    destinationId,
    files
) => {

    const destination =
        await Destination.findById(destinationId);

    if (!destination) {
        throw new Error("Destination not found.");
    }

    const imageUrls =
        await uploadMultipleImages(
            files,
            "TripFusion/Destinations"
        );

    destination.images.push(...imageUrls);

    await destination.save();

    return destination;

};

module.exports = {
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination,
    uploadDestinationImages
};