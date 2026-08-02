const { registerUser } = require("../services/authService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

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

module.exports = {
    register
};