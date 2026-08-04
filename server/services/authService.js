const cloudinary = require("../config/cloudinary");
const fs = require("fs-extra");

const User = require("../models/User");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/generateToken");

// =======================
// Register User
// =======================
const registerUser = async (userData) => {

    const {
        fullName,
        email,
        phone,
        password
    } = userData;

    const existingUser = await User.findOne({
        email
    });

    if (existingUser) {
        throw new Error("Email is already registered.");
    }

    const user = await User.create({
        fullName,
        email,
        phone,
        password
    });

    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };

};

// =======================
// Login User
// =======================
const loginUser = async (
    email,
    password
) => {

    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 30 * 60 * 1000;

    const user = await User.findOne({
        email
    }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (
        user.lockUntil &&
        user.lockUntil > Date.now()
    ) {
        throw new Error(
            "Account is locked. Try again after 30 minutes."
        );
    }

    const isPasswordCorrect =
        await user.comparePassword(password);

    if (!isPasswordCorrect) {

        user.loginAttempts += 1;

        if (
            user.loginAttempts >=
            MAX_LOGIN_ATTEMPTS
        ) {

            user.lockUntil =
                new Date(
                    Date.now() + LOCK_TIME
                );

        }

        await user.save();

        throw new Error(
            "Invalid email or password."
        );

    }

    user.loginAttempts = 0;
    user.lockUntil = null;

    if (user.isBlocked) {
        throw new Error(
            "Your account has been blocked."
        );
    }

    user.lastLogin = new Date();

    const accessToken =
        generateAccessToken(user._id);

    const refreshToken =
        generateRefreshToken(user._id);

    user.refreshToken =
        refreshToken;

    await user.save();

    return {

        accessToken,

        refreshToken,

        user: {

            id: user._id,

            fullName: user.fullName,

            email: user.email,

            role: user.role

        }

    };

};

// =======================
// Refresh Token
// =======================
const refreshAccessToken = async (
    refreshToken
) => {

    if (!refreshToken) {
        throw new Error(
            "Refresh token is required."
        );
    }

    const jwt =
        require("jsonwebtoken");

    let decoded;

    try {

        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

    } catch {

        throw new Error(
            "Invalid refresh token."
        );

    }

    const user =
        await User.findById(
            decoded.id
        );

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    if (
        user.refreshToken !==
        refreshToken
    ) {
        throw new Error(
            "Refresh token mismatch."
        );
    }

    const accessToken =
        generateAccessToken(user._id);

    return {
        accessToken
    };

};

// =======================
// Logout
// =======================
const logoutUser = async (
    userId
) => {

    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    user.refreshToken = null;

    await user.save();

    return {
        message:
            "Logged out successfully."
    };

};

// =======================
// Update Profile
// =======================
const updateProfile = async (
    userId,
    profileData
) => {

    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    Object.assign(
        user,
        profileData
    );

    await user.save();

    return user;

};

// =======================
// Upload Profile Image
// =======================
const uploadProfileImage = async (
    userId,
    filePath
) => {

    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    if (
        user.profileImage &&
        user.profileImage.includes(
            "cloudinary"
        )
    ) {

        try {

            const parts =
                user.profileImage.split("/");

            const filename =
                parts[
                    parts.length - 1
                ];

            const publicId =
                "TripFusion/ProfileImages/" +
                filename.substring(
                    0,
                    filename.lastIndexOf(".")
                );

            await cloudinary
                .uploader
                .destroy(publicId);

        } catch {

            console.log(
                "Old image not deleted."
            );

        }

    }

    const result =
        await cloudinary
            .uploader
            .upload(filePath, {
                folder:
                    "TripFusion/ProfileImages"
            });

    await fs.remove(filePath);

    user.profileImage =
        result.secure_url;

    await user.save();

    return {
        profileImage:
            result.secure_url
    };

};

module.exports = {

    registerUser,

    loginUser,

    refreshAccessToken,

    logoutUser,

    updateProfile,

    uploadProfileImage

};