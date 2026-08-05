const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "transport",
                "hotel",
                "food",
                "shopping",
                "activities",
                "fuel",
                "tickets",
                "medical",
                "other"
            ],
            default: "other"
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            default: "INR"
        },

        date: {
            type: Date,
            default: Date.now
        },

        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "card",
                "upi",
                "wallet"
            ],
            default: "upi"
        },

        notes: {
            type: String,
            default: ""
        },

        receiptImage: {
            type: String,
            default: ""
        },

        isAIExpense: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// =======================
// Indexes
// =======================

expenseSchema.index({
    trip: 1
});

expenseSchema.index({
    user: 1
});

expenseSchema.index({
    category: 1
});

expenseSchema.index({
    date: 1
});

module.exports = mongoose.model(
    "Expense",
    expenseSchema
);