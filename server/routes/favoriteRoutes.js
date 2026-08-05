const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    addHotel,

    addDestination,

    fetchFavorites,

    deleteFavorite

} = require("../controllers/favoriteController");

// =======================
// Add Hotel
// =======================
router.post(

    "/hotels/:id",

    protect,

    addHotel

);

// =======================
// Add Destination
// =======================
router.post(

    "/destinations/:id",

    protect,

    addDestination

);

// =======================
// Get Favorites
// =======================
router.get(

    "/",

    protect,

    fetchFavorites

);

// =======================
// Remove Favorite
// =======================
router.delete(

    "/:id",

    protect,

    deleteFavorite

);

module.exports = router;