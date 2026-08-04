const express = require("express");

const router = express.Router();

const {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    updateUserProfile,
    uploadPhoto
} = require("../controllers/authController");

const {
    registerValidator,
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