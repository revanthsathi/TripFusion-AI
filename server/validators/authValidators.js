const { body } = require("express-validator");

// =======================
// Register Validator
// =======================
const registerValidator = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required.")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required.")
        .normalizeEmail(),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required."),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")

];

// =======================
// Login Validator
// =======================
const loginValidator = [

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")

];

module.exports = {
    registerValidator,
    loginValidator
};