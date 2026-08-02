const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("./emailService");
const verifyEmailTemplate = require("../templates/emails/verifyEmail");

const OTP_EXPIRY_MINUTES = 5;

const registerUser = async (userData) => {
    const { fullName, email, phone, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email is already registered.");
    }

    // Generate OTP
    const otp = generateOTP();

    const otpExpiry = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    // Create new user
    const user = await User.create({
        fullName,
        email,
        phone,
        password,
        verificationOTP: otp,
        verificationOTPExpires: otpExpiry,
        isEmailVerified: false
    });

    // Send verification email
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

module.exports = {
    registerUser
};