const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = require("../constants/roles");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false
        },

        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.TRAVELER
        },

        profileImage: {
            type: String,
            default: ""
        },

        country: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        preferredCurrency: {
            type: String,
            default: "INR"
        },

        preferredLanguage: {
            type: String,
            default: "English"
        },

        travelPreferences: {
            type: [String],
            default: []
        },

        emergencyContact: {
            type: String,
            default: ""
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        verificationOTP: {
            type: String,
            default: null
        },

        verificationOTPExpires: {
            type: Date,
            default: null
        },

        resetPasswordOTP: {
            type: String,
            default: null
        },

        resetPasswordOTPExpires: {
            type: Date,
            default: null
        },

        isBlocked: {
            type: Boolean,
            default: false
        },

        loginAttempts: {
            type: Number,
            default: 0
        },

        lockUntil: {
            type: Date,
            default: null
        },

        lastLogin: {
            type: Date,
            default: null
        },

        refreshToken: {
            type: String,
            default: null
        },

        profileCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);