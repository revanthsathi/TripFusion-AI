const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    search,
    route,
    nearby
} = require("../controllers/mapsController");

router.get(
    "/search",
    protect,
    search
);

router.get(
    "/route",
    protect,
    route
);

router.get(
    "/nearby",
    protect,
    nearby
);

module.exports = router;