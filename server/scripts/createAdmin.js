require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const User = require("../models/User");

const ROLES = require("../constants/roles");

const createAdmin = async () => {

    try {

        await connectDB();

        const existingAdmin = await User.findOne({
            email: "admin@tripfusion.com"
        });

        if (existingAdmin) {
            console.log("✅ Admin already exists.");
            process.exit();
        }

        const admin = new User({
            fullName: "TripFusion Admin",
            email: "admin@tripfusion.com",
            phone: "9999999999",
            password: "Admin@123",
            role: ROLES.ADMIN,
            isEmailVerified: true
        });

        await admin.save();

        console.log("🎉 Admin created successfully.");

        console.log("Email: admin@tripfusion.com");
        console.log("Password: Admin@123");

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);

    }

};

createAdmin();