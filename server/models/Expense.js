const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
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
        }
    },
    {
        timestamps: true
    }
);

expenseSchema.index({
    trip: 1
});

expenseSchema.index({
    category: 1
});

module.exports = mongoose.model(
    "Expense",
    expenseSchema
);