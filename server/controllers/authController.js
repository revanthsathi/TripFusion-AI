const {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    resetPassword,
    resendOTP,
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

        const result = await registerUser(req.body);

        return sendSuccess(
            res,
            201,
            "OTP sent successfully. Please verify your email.",
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

        const { email, password } = req.body;

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
// Forgot Password
// =======================
const forgotUserPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const result = await forgotPassword(email);

        return sendSuccess(
            res,
            200,
            "Password reset email sent successfully.",
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
// Reset Password
// =======================
const resetUserPassword = async (req, res) => {

    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        const result = await resetPassword(
            email,
            otp,
            newPassword
        );

        return sendSuccess(
            res,
            200,
            "Password reset successful.",
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
// Resend OTP
// =======================
const resendUserOTP = async (req, res) => {

    try {

        const { email } = req.body;

        const result = await resendOTP(email);

        return sendSuccess(
            res,
            200,
            "OTP sent successfully.",
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
// Get Logged In User
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
const updateUserProfile = async (req, res) => {

    try {

        const result = await updateProfile(
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
const uploadPhoto = async (req, res) => {

    try {

        if (!req.file) {

            return sendError(
                res,
                400,
                "Please upload an image."
            );

        }

        const result = await uploadProfileImage(
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
    verifyUserOTP,
    login,
    forgotUserPassword,
    resetUserPassword,
    resendUserOTP,
    getMe,
    updateUserProfile,
    uploadPhoto
};