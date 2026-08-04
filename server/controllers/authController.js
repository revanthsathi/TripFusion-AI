const {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    updateProfile,
    uploadProfileImage
} = require("../services/authService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Register
// =======================
const register = async (req, res) => {

    try {

        const result = await registerUser(
            req.body
        );

        return sendSuccess(
            res,
            201,
            "Registration successful.",
            result
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Login
// =======================
const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const result = await loginUser(
            email,
            password
        );

        return sendSuccess(
            res,
            200,
            "Login successful.",
            result
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Refresh Token
// =======================
const refreshToken = async (req, res) => {

    try {

        const {
            refreshToken
        } = req.body;

        const result =
            await refreshAccessToken(
                refreshToken
            );

        return sendSuccess(
            res,
            200,
            "Access token refreshed successfully.",
            result
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            401,
            error.message
        );

    }

};

// =======================
// Logout
// =======================
const logout = async (req, res) => {

    try {

        const result =
            await logoutUser(
                req.user._id
            );

        return sendSuccess(
            res,
            200,
            result.message
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Logged In User
// =======================
const getMe = async (req, res) => {

    return sendSuccess(
        res,
        200,
        "User profile fetched successfully.",
        req.user
    );

};

// =======================
// Update Profile
// =======================
const updateUserProfile = async (
    req,
    res
) => {

    try {

        const result =
            await updateProfile(
                req.user._id,
                req.body
            );

        return sendSuccess(
            res,
            200,
            "Profile updated successfully.",
            result
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Upload Profile Image
// =======================
const uploadPhoto = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return sendError(
                res,
                400,
                "Please upload an image."
            );

        }

        const result =
            await uploadProfileImage(
                req.user._id,
                req.file.path
            );

        return sendSuccess(
            res,
            200,
            "Profile image uploaded successfully.",
            result
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

module.exports = {

    register,

    login,

    refreshToken,

    logout,

    getMe,

    updateUserProfile,

    uploadPhoto

};