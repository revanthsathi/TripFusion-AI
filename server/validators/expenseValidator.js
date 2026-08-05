const Joi = require("joi");

// =======================
// Add Expense Validation
// =======================
const expenseSchema = Joi.object({

    tripId: Joi.string()
        .required(),

    title: Joi.string()
        .min(2)
        .max(100)
        .required(),

    category: Joi.string()
        .valid(
            "transport",
            "hotel",
            "food",
            "shopping",
            "activities",
            "fuel",
            "tickets",
            "medical",
            "other"
        )
        .required(),

    amount: Joi.number()
        .positive()
        .required(),

    currency: Joi.string()
        .default("INR"),

    paymentMethod: Joi.string()
        .valid(
            "cash",
            "card",
            "upi",
            "wallet"
        )
        .default("upi"),

    notes: Joi.string()
        .allow("")
        .default("")

});

// =======================
// Validator Middleware
// =======================
const validateExpense = (
    req,
    res,
    next
) => {

    const { error } =
        expenseSchema.validate(
            req.body
        );

    if (error) {

        return res.status(400).json({

            success: false,

            message:
                error.details[0].message

        });

    }

    next();

};

module.exports = {
    validateExpense
};