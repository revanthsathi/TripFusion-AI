const express = require("express");

const router = express.Router();

const {
    register,
    verifyUserOTP,
    login,
    getMe
} = require("../controllers/authController");

const {
    registerValidator,
    verifyOTPValidator,
    loginValidator
} = require("../validators/authValidators");

const validate = require("../middleware/validationMiddleware");
const protect = require("../middleware/authMiddleware");

// =======================
// Register
// =======================
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

// =======================
// Verify OTP
// =======================
router.post(
    "/verify-otp",
    verifyOTPValidator,
    validate,
    verifyUserOTP
);

// =======================
// Login
// =======================
router.post(
    "/login",
    loginValidator,
    validate,
    login
);

// =======================
// Get Logged In User
// =======================
router.get(
    "/me",
    protect,
    getMe
);

module.exports = router;