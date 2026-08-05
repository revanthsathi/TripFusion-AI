const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpenseSummary
} = require("../services/expenseService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");

// =======================
// Add Expense
// =======================
const createExpense = async (req, res) => {

    try {

        const expense = await addExpense(
            req.user._id,
            req.body
        );

        return sendSuccess(
            res,
            201,
            "Expense added successfully.",
            expense
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Get Expenses
// =======================
const fetchExpenses = async (req, res) => {

    try {

        const expenses = await getExpenses(
            req.user._id,
            req.params.tripId
        );

        return sendSuccess(
            res,
            200,
            "Expenses fetched successfully.",
            expenses
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Update Expense
// =======================
const editExpense = async (req, res) => {

    try {

        const expense = await updateExpense(
            req.user._id,
            req.params.id,
            req.body
        );

        return sendSuccess(
            res,
            200,
            "Expense updated successfully.",
            expense
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Delete Expense
// =======================
const removeExpense = async (req, res) => {

    try {

        await deleteExpense(
            req.user._id,
            req.params.id
        );

        return sendSuccess(
            res,
            200,
            "Expense deleted successfully."
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

// =======================
// Expense Summary
// =======================
const summary = async (req, res) => {

    try {

        const data = await getExpenseSummary(
            req.user._id,
            req.params.tripId
        );

        return sendSuccess(
            res,
            200,
            "Expense summary fetched successfully.",
            data
        );

    } catch (error) {

        console.error(error);

        return sendError(
            res,
            400,
            error.message
        );

    }

};

module.exports = {

    createExpense,

    fetchExpenses,

    editExpense,

    removeExpense,

    summary

};