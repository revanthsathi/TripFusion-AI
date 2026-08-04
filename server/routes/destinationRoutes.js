const express = require("express");

const router = express.Router();

const {
    create,
    getAll,
    getById,
    update,
    remove,
    uploadImages
} = require("../controllers/destinationController");

const {
    createDestinationValidator,
    updateDestinationValidator
} = require("../validators/destinationValidators");

const validate = require("../middleware/validationMiddleware");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// =======================
// Create Destination
// =======================
router.post(
    "/",
    protect,
    authorize("admin"),
    createDestinationValidator,
    validate,
    create
);

// =======================
// Upload Destination Images
// =======================
router.post(
    "/:id/upload-images",
    protect,
    authorize("admin"),
    upload.array("images", 5),
    uploadImages
);

// =======================
// Get All Destinations
// =======================
router.get(
    "/",
    getAll
);

// =======================
// Get Destination By ID
// =======================
router.get(
    "/:id",
    getById
);

// =======================
// Update Destination
// =======================
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateDestinationValidator,
    validate,
    update
);

// =======================
// Delete Destination
// =======================
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    remove
);

module.exports = router;