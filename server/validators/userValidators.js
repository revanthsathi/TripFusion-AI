const { body } = require("express-validator");

const updateProfileValidator = [
    body("fullName")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Full name must be between 3 and 100 characters."),

    body("phone")
        .optional()
        .isMobilePhone("any")
        .withMessage("Invalid phone number."),

    body("country")
        .optional()
        .trim(),

    body("city")
        .optional()
        .trim(),

    body("preferredCurrency")
        .optional()
        .trim(),

    body("preferredLanguage")
        .optional()
        .trim(),

    body("travelPreferences")
        .optional()
        .isArray()
        .withMessage("Travel preferences must be an array."),

    body("emergencyContact")
        .optional()
        .trim()
];

module.exports = {
    updateProfileValidator
};