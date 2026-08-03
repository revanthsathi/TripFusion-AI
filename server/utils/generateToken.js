const jwt = require("jsonwebtoken");

// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign(
        {
            id: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            id: userId
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "30d"
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};