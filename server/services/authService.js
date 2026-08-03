const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const generateToken = require("../utils/generateToken");
const sendEmail = require("./emailService");
const verifyEmailTemplate = require("../templates/emails/verifyEmail");

const OTP_EXPIRY_MINUTES = 5;

// =======================
// Register User
// =======================
const registerUser = async (userData) => {
    const { fullName, email, phone, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email is already registered.");
    }

    const otp = generateOTP();

    const otpExpiry = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    const user = await User.create({
        fullName,
        email,
        phone,
        password,
        verificationOTP: otp,
        verificationOTPExpires: otpExpiry,
        isEmailVerified: false
    });

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

// =======================
// Verify OTP
// =======================
const verifyOTP = async (email, otp) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.isEmailVerified) {
        throw new Error("Email is already verified.");
    }

    if (!user.verificationOTP || !user.verificationOTPExpires) {
        throw new Error("OTP not found.");
    }

    if (user.verificationOTPExpires < new Date()) {
        throw new Error("OTP has expired.");
    }

    if (user.verificationOTP !== otp) {
        throw new Error("Invalid OTP.");
    }

    user.isEmailVerified = true;
    user.verificationOTP = null;
    user.verificationOTPExpires = null;

    await user.save();

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    };
};

// =======================
// Login User
// =======================
const loginUser = async (email, password) => {

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (!user.isEmailVerified) {
        throw new Error("Please verify your email first.");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password.");
    }

    if (user.isBlocked) {
        throw new Error("Your account has been blocked.");
    }

    user.lastLogin = new Date();

    await user.save();

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified
        }
    };
};

module.exports = {
    registerUser,
    verifyOTP,
    loginUser
};