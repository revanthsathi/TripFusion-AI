const { body } = require("express-validator");

const validateRecommendation = [

    body("tripId")
        .notEmpty()
        .withMessage("Trip ID is required.")

];

module.exports = {
    validateRecommendation
};