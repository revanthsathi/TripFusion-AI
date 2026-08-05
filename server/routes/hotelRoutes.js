const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    validateHotel
} = require("../validators/hotelValidator");

const {
    addHotel,
    fetchHotels,
    fetchHotel,
    editHotel,
    removeHotel,
    search,
    createReview,
    fetchReviews,
    uploadImages
} = require("../controllers/hotelController");

// =======================
// Public Routes
// =======================

// Get All Hotels
router.get(
    "/",
    fetchHotels
);

// Search Hotels
router.get(
    "/search",
    search
);

// Get Hotel Reviews
router.get(
    "/:id/reviews",
    fetchReviews
);

// Get Hotel By ID
router.get(
    "/:id",
    fetchHotel
);

// =======================
// Protected User Routes
// =======================

// Add Review
router.post(
    "/:id/reviews",
    protect,
    createReview
);

// =======================
// Admin Routes
// =======================

// Create Hotel
router.post(
    "/",
    protect,
    authorize("admin"),
    validateHotel,
    addHotel
);

// Upload Hotel Images
router.post(
    "/:id/images",
    protect,
    authorize("admin"),
    upload.array("images", 10),
    uploadImages
);

// Update Hotel
router.put(
    "/:id",
    protect,
    authorize("admin"),
    validateHotel,
    editHotel
);

// Delete Hotel
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    removeHotel
);

module.exports = router;