const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const fs = require("fs-extra");

const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/generateToken");
const sendEmail = require("./emailService");
const verifyEmailTemplate = require("../templates/emails/verifyEmail");
const resetPasswordTemplate = require("../templates/emails/resetPassword");
const OTP_EXPIRY_MINUTES = 5;

// =======================
// Register User
// =======================
const registerUser = async (userData) => {
    const { fullName, email, phone, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email is already registered.");
    }

    const otp = generateOTP();

    const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

    const otpExpiry = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    const user = await User.create({
        fullName,
        email,
        phone,
        password,
        verificationOTP: hashedOTP,
        verificationOTPExpires: otpExpiry,
        isEmailVerified: false
    });

    await sendEmail({
        to: email,
        subject: "Verify your TripFusion AI Account",
        html: verifyEmailTemplate(fullName, otp)
    });

    return {
        email: user.email,
        isEmailVerified: user.isEmailVerified
    };
};

// =======================
// Verify OTP
// =======================
const verifyOTP = async (email, otp) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.isEmailVerified) {
        throw new Error("Email is already verified.");
    }

    if (!user.verificationOTP || !user.verificationOTPExpires) {
        throw new Error("OTP not found.");
    }

    if (user.verificationOTPExpires < new Date()) {
        throw new Error("OTP has expired.");
    }

    const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

    if (user.verificationOTP !== hashedOTP) {
        throw new Error("Invalid OTP.");
    }

    user.isEmailVerified = true;
    user.verificationOTP = null;
    user.verificationOTPExpires = null;

    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    };
};

// =======================
// Login User
// =======================
const loginUser = async (email, password) => {

    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (!user.isEmailVerified) {
        throw new Error("Please verify your email first.");
    }

    // =======================
    // Check Account Lock
    // =======================
    if (
        user.lockUntil &&
        user.lockUntil > Date.now()
    ) {
        throw new Error(
            "Account is locked. Try again after 30 minutes."
        );
    }

    // =======================
    // Verify Password
    // =======================
    const isPasswordCorrect =
        await user.comparePassword(password);

    if (!isPasswordCorrect) {

        user.loginAttempts += 1;

        if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {

            user.lockUntil = new Date(
                Date.now() + LOCK_TIME
            );

        }

        await user.save();

        throw new Error("Invalid email or password.");

    }

    // =======================
    // Reset Failed Attempts
    // =======================
    user.loginAttempts = 0;
    user.lockUntil = null;

    if (user.isBlocked) {
        throw new Error("Your account has been blocked.");
    }

    user.lastLogin = new Date();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    return {

        accessToken,
        refreshToken,

        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified
        }

    };

};
// =======================
// Refresh Token
// =======================
const refreshAccessToken = async (refreshToken) => {

    if (!refreshToken) {
        throw new Error("Refresh token is required.");
    }

    const jwt = require("jsonwebtoken");

    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (err) {
        throw new Error("Invalid refresh token.");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.refreshToken !== refreshToken) {
        throw new Error("Refresh token mismatch.");
    }

    const newAccessToken = generateAccessToken(user._id);

    return {
        accessToken: newAccessToken
    };

};
// =======================
// Logout
// =======================
const logoutUser = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    user.refreshToken = null;

    await user.save();

    return {
        message: "Logged out successfully."
    };

};

// =======================
// Forgot Password
// =======================
const forgotPassword = async (email) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found.");
    }

    const otp = generateOTP();

    const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpires = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await user.save();

    await sendEmail({
    to: email,
    subject: "TripFusion AI Password Reset OTP",
    html: resetPasswordTemplate(
        user.fullName,
        otp
    )
    });

    return {
        email: user.email
    };

};
// =======================
// Reset Password
// =======================
const resetPassword = async (
    email,
    otp,
    newPassword
) => {

    const user = await User.findOne({
        email
    }).select("+password");

    if (!user) {
        throw new Error("User not found.");
    }

    if (
        !user.resetPasswordOTP ||
        !user.resetPasswordOTPExpires
    ) {
        throw new Error("Reset OTP not found.");
    }

    if (
        user.resetPasswordOTPExpires <
        new Date()
    ) {
        throw new Error("Reset OTP has expired.");
    }

    const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

    if (
        user.resetPasswordOTP !== hashedOTP
    ) {
        throw new Error("Invalid OTP.");
    }

    user.password = newPassword;

    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;

    await user.save();

    return {
        email: user.email
    };

};
// =======================
// Resend OTP
// =======================
const resendOTP = async (email) => {

    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.isEmailVerified) {
        throw new Error("Email is already verified.");
    }

    const otp = generateOTP();

    const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

    user.verificationOTP = hashedOTP;

    user.verificationOTPExpires =
        new Date(
            Date.now() +
            OTP_EXPIRY_MINUTES * 60 * 1000
        );

    await user.save();

    await sendEmail({
        to: email,
        subject: "Verify your TripFusion AI Account",
        html: verifyEmailTemplate(
            user.fullName,
            otp
        )
    });

    return {
        email: user.email
    };

};

// =======================
// Update Profile
// =======================
const updateProfile = async (userId, profileData) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    Object.assign(user, profileData);

    await user.save();

    return user;
};

// =======================
// Upload Profile Image
// =======================
const uploadProfileImage = async (userId, filePath) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    // Delete previous Cloudinary image (optional)
    if (
        user.profileImage &&
        user.profileImage.includes("cloudinary")
    ) {
        try {
            const parts = user.profileImage.split("/");
            const filename = parts[parts.length - 1];
            const publicId =
                "TripFusion/ProfileImages/" +
                filename.substring(0, filename.lastIndexOf("."));

            await cloudinary.uploader.destroy(publicId);
        } catch (err) {
            console.log("Old image not deleted.");
        }
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "TripFusion/ProfileImages"
    });

    // Remove local file
    await fs.remove(filePath);

    // Save URL
    user.profileImage = result.secure_url;

    await user.save();

    return {
        profileImage: result.secure_url
    };
};

module.exports = {
    registerUser,
    verifyOTP,
    loginUser,
    refreshAccessToken,
    logoutUser,
    forgotPassword,
    resetPassword,
    resendOTP,
    updateProfile,
    uploadProfileImage
};