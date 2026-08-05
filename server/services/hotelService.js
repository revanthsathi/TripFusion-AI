const Hotel = require("../models/Hotel");

// =======================
// Create Hotel
// =======================
const createHotel = async (hotelData) => {

    const hotel = await Hotel.create(hotelData);

    return hotel;

};

// =======================
// Get All Hotels
// =======================
const getHotels = async (filters = {}) => {

    const query = {};

    if (filters.destination) {
        query.destination = filters.destination;
    }

    if (filters.available !== undefined) {
        query.available = filters.available;
    }

    if (filters.minRating) {
        query.averageRating = {
            $gte: Number(filters.minRating)
        };
    }

    if (filters.amenity) {
        query.amenities = filters.amenity;
    }

    let hotels = await Hotel.find(query)
        .populate("destination", "name country")
        .sort({
            averageRating: -1,
            createdAt: -1
        });

    // Filter by room price
    if (filters.maxPrice) {

        hotels = hotels.filter(hotel =>
            hotel.rooms.some(room =>
                room.pricePerNight <= Number(filters.maxPrice)
            )
        );

    }

    return hotels;

};

// =======================
// Get Hotel By ID
// =======================
const getHotelById = async (hotelId) => {

    const hotel = await Hotel.findById(hotelId)
        .populate("destination", "name country");

    if (!hotel) {
        throw new Error("Hotel not found.");
    }

    return hotel;

};

// =======================
// Update Hotel
// =======================
const updateHotel = async (
    hotelId,
    updateData
) => {

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
        throw new Error("Hotel not found.");
    }

    Object.assign(hotel, updateData);

    await hotel.save();

    return hotel;

};

// =======================
// Delete Hotel
// =======================
const deleteHotel = async (
    hotelId
) => {

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
        throw new Error("Hotel not found.");
    }

    await hotel.deleteOne();

};

// =======================
// Search Hotels
// =======================
const searchHotels = async (
    keyword
) => {

    const hotels = await Hotel.find({

        $or: [

            {
                name: {
                    $regex: keyword,
                    $options: "i"
                }
            },

            {
                description: {
                    $regex: keyword,
                    $options: "i"
                }
            },

            {
                address: {
                    $regex: keyword,
                    $options: "i"
                }
            }

        ]

    }).populate(
        "destination",
        "name country"
    );

    return hotels;

};

module.exports = {

    createHotel,

    getHotels,

    getHotelById,

    updateHotel,

    deleteHotel,

    searchHotels

};