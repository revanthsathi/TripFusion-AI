const express = require("express");

const router = express.Router();

const {
    create,
    getAll,
    getById,
    update,
    remove
} = require("../controllers/destinationController");

const {
    createDestinationValidator,
    updateDestinationValidator
} = require("../validators/destinationValidators");

const validate = require("../middleware/validationMiddleware");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

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