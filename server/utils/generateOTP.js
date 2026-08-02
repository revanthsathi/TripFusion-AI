const OTP_CONFIG = require("../constants/otp");

const generateOTP = () => {
    let otp = "";

    for (let i = 0; i < OTP_CONFIG.LENGTH; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
};

module.exports = generateOTP;