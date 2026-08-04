const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {

    current,

    forecast

} = require("../controllers/weatherController");

// =======================
// Current Weather
// =======================
router.get(
    "/current",
    protect,
    current
);

// =======================
// Forecast
// =======================
router.get(
    "/forecast",
    protect,
    forecast
);

module.exports = router;