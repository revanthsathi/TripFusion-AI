const { body } = require("express-validator");

// =======================
// Register Validator
// =======================
const registerValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Full name must be between 3 and 100 characters."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail(),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .isMobilePhone("any")
        .withMessage("Enter a valid phone number."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
];

// =======================
// Verify OTP Validator
// =======================
const verifyOTPValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be exactly 6 digits.")
        .isNumeric()
        .withMessage("OTP must contain only numbers.")
];

// =======================
// Login Validator
// =======================
const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
];

// =======================
// Forgot Password Validator
// =======================
const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail()
];

// =======================
// Reset Password Validator
// =======================
const resetPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be exactly 6 digits."),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
];

// =======================
// Resend OTP Validator
// =======================
const resendOTPValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail()
];

module.exports = {
    registerValidator,
    verifyOTPValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    resendOTPValidator
};