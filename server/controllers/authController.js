const { sendSuccess } = require("../utils/apiResponse");

const register = async (req, res) => {
    return sendSuccess(
        res,
        200,
        "Register API is working!",
        req.body
    );
};

module.exports = {
    register
};