const { body } = require("express-validator");

const createDestinationValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Destination name is required."),

    body("country")
        .trim()
        .notEmpty()
        .withMessage("Country is required."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),

    body("latitude")
        .isFloat()
        .withMessage("Latitude must be a valid number."),

    body("longitude")
        .isFloat()
        .withMessage("Longitude must be a valid number.")
];

const updateDestinationValidator = [
    body("name")
        .optional()
        .trim(),

    body("country")
        .optional()
        .trim(),

    body("description")
        .optional()
        .trim(),

    body("latitude")
        .optional()
        .isFloat(),

    body("longitude")
        .optional()
        .isFloat()
];

module.exports = {
    createDestinationValidator,
    updateDestinationValidator
};