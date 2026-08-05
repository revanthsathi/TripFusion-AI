const Favorite = require("../models/Favorite");
const Hotel = require("../models/Hotel");
const Destination = require("../models/Destination");

// =======================
// Add Hotel
// =======================
const addHotelFavorite = async (

    userId,

    hotelId

) => {

    const hotel =
        await Hotel.findById(hotelId);

    if (!hotel) {

        throw new Error(
            "Hotel not found."
        );

    }

    const exists =
        await Favorite.findOne({

            user: userId,

            hotel: hotelId

        });

    if (exists) {

        throw new Error(
            "Hotel already in favorites."
        );

    }

    return await Favorite.create({

        user: userId,

        hotel: hotelId

    });

};

// =======================
// Add Destination
// =======================
const addDestinationFavorite = async (

    userId,

    destinationId

) => {

    const destination =
        await Destination.findById(
            destinationId
        );

    if (!destination) {

        throw new Error(
            "Destination not found."
        );

    }

    const exists =
        await Favorite.findOne({

            user: userId,

            destination: destinationId

        });

    if (exists) {

        throw new Error(
            "Destination already in favorites."
        );

    }

    return await Favorite.create({

        user: userId,

        destination: destinationId

    });

};

// =======================
// Get Favorites
// =======================
const getFavorites = async (

    userId

) => {

    return await Favorite.find({

        user: userId

    })

        .populate("hotel")

        .populate("destination")

        .sort({

            createdAt: -1

        });

};

// =======================
// Remove Favorite
// =======================
const removeFavorite = async (

    favoriteId,

    userId

) => {

    const favorite =
        await Favorite.findOne({

            _id: favoriteId,

            user: userId

        });

    if (!favorite) {

        throw new Error(
            "Favorite not found."
        );

    }

    await Favorite.findByIdAndDelete(
        favoriteId
    );

    return true;

};

module.exports = {

    addHotelFavorite,

    addDestinationFavorite,

    getFavorites,

    removeFavorite

};