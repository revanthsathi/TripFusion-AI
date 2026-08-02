const { body } = require("express-validator");

const registerValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

    body("phone")
        .trim()
        .isMobilePhone("any")
        .withMessage("Enter a valid phone number"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
];

module.exports = {
    registerValidator
};