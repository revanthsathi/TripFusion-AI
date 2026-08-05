const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    generate,

    history,

    getOne

} = require("../controllers/recommendationController");

// =======================
// Generate Recommendation
// =======================
router.post(

    "/trip/:tripId",

    protect,

    generate

);

// =======================
// Recommendation History
// =======================
router.get(

    "/history",

    protect,

    history

);

// =======================
// Get Recommendation
// =======================
router.get(

    "/:id",

    protect,

    getOne

);

module.exports = router;