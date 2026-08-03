const express = require("express");

const router = express.Router();

const {
    register,
    verifyUserOTP,
    login,
    getMe,
    updateUserProfile,
    uploadPhoto
} = require("../controllers/authController");

const {
    registerValidator,
    verifyOTPValidator,
    loginValidator
} = require("../validators/authValidators");

const {
    updateProfileValidator
} = require("../validators/userValidators");

const validate = require("../middleware/validationMiddleware");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

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
// Logged In User
// =======================
router.get(
    "/me",
    protect,
    getMe
);

// =======================
// Update Profile
// =======================
router.put(
    "/profile",
    protect,
    updateProfileValidator,
    validate,
    updateUserProfile
);

// =======================
// Upload Profile Image
// =======================
router.post(
    "/upload-photo",
    protect,
    upload.single("profileImage"),
    uploadPhoto
);

module.exports = router;