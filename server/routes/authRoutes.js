const express = require("express");

const router = express.Router();

const {
    register,
    verifyUserOTP,
    login,
    refreshToken,
    logout,
    forgotUserPassword,
    resetUserPassword,
    resendUserOTP,
    getMe,
    updateUserProfile,
    uploadPhoto
} = require("../controllers/authController");

const {
    registerValidator,
    verifyOTPValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    resendOTPValidator
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
// Refresh Token
// =======================
router.post(
    "/refresh-token",
    refreshToken
);

// =======================
// Logout
// =======================
router.post(
    "/logout",
    protect,
    logout
);

// =======================
// Forgot Password
// =======================
router.post(
    "/forgot-password",
    forgotPasswordValidator,
    validate,
    forgotUserPassword
);

// =======================
// Reset Password
// =======================
router.post(
    "/reset-password",
    resetPasswordValidator,
    validate,
    resetUserPassword
);

// =======================
// Resend OTP
// =======================
router.post(
    "/resend-otp",
    resendOTPValidator,
    validate,
    resendUserOTP
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