const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return sendError(res, 401, "Not authorized. Token missing.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return sendError(res, 401, "User not found.");
        }

        req.user = user;

        next();
    } catch (error) {
        return sendError(res, 401, "Invalid or expired token.");
    }
};

module.exports = protect;