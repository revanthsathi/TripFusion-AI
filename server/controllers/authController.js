const {
    registerUser,
    verifyOTP,
    loginUser
} = require("../services/authService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Register User
// =======================
const register = async (req, res) => {
    try {
        const result = await registerUser(req.body);

        return sendSuccess(
            res,
            201,
            "OTP sent successfully. Please verify your email.",
            result
        );
    } catch (error) {
        return sendError(
            res,
            400,
            error.message
        );
    }
};

// =======================
// Verify OTP
// =======================
const verifyUserOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const result = await verifyOTP(email, otp);

        return sendSuccess(
            res,
            200,
            "Email verified successfully.",
            result
        );
    } catch (error) {
        return sendError(
            res,
            400,
            error.message
        );
    }
};

// =======================
// Login User
// =======================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        return sendSuccess(
            res,
            200,
            "Login successful.",
            result
        );
    } catch (error) {
        return sendError(
            res,
            400,
            error.message
        );
    }
};

// =======================
// Get Logged In User
// =======================
const getMe = async (req, res) => {
    try {
        return sendSuccess(
            res,
            200,
            "User profile fetched successfully.",
            req.user
        );
    } catch (error) {
        return sendError(
            res,
            400,
            error.message
        );
    }
};

module.exports = {
    register,
    verifyUserOTP,
    login,
    getMe
};