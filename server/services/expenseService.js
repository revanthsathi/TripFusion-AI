const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// =======================
// Add Expense
// =======================
const addExpense = async (
    userId,
    expenseData
) => {

    const {
        tripId,
        title,
        category,
        amount,
        currency,
        paymentMethod,
        notes
    } = expenseData;

    const trip = await Trip.findOne({
        _id: tripId,
        user: userId
    });

    if (!trip) {
        throw new Error("Trip not found.");
    }

    const expense = await Expense.create({

        trip: tripId,

        user: userId,

        title,

        category,

        amount,

        currency,

        paymentMethod,

        notes

    });

    trip.expenses.push(expense._id);

    trip.spentBudget += amount;

    await trip.save();

    return expense;

};

// =======================
// Get Expenses
// =======================
const getExpenses = async (
    userId,
    tripId
) => {

    const expenses =
        await Expense.find({

            user: userId,

            trip: tripId

        }).sort({
            date: -1
        });

    return expenses;

};

// =======================
// Update Expense
// =======================
const updateExpense = async (
    userId,
    expenseId,
    updateData
) => {

    const expense =
        await Expense.findOne({

            _id: expenseId,

            user: userId

        });

    if (!expense) {
        throw new Error(
            "Expense not found."
        );
    }

    const trip =
        await Trip.findById(
            expense.trip
        );

    // Update spent budget
    trip.spentBudget =
        trip.spentBudget -
        expense.amount +
        updateData.amount;

    await trip.save();

    Object.assign(
        expense,
        updateData
    );

    await expense.save();

    return expense;

};

// =======================
// Delete Expense
// =======================
const deleteExpense = async (
    userId,
    expenseId
) => {

    const expense =
        await Expense.findOne({

            _id: expenseId,

            user: userId

        });

    if (!expense) {
        throw new Error(
            "Expense not found."
        );
    }

    const trip =
        await Trip.findById(
            expense.trip
        );

    trip.spentBudget -=
        expense.amount;

    trip.expenses.pull(
        expense._id
    );

    await trip.save();

    await expense.deleteOne();

};

// =======================
// Expense Summary
// =======================
const getExpenseSummary = async (
    userId,
    tripId
) => {

    const trip =
        await Trip.findOne({

            _id: tripId,

            user: userId

        });

    if (!trip) {
        throw new Error(
            "Trip not found."
        );
    }

    const expenses =
        await Expense.find({

            trip: tripId,

            user: userId

        });

    const categoryTotals = {};

    expenses.forEach(expense => {

        if (
            !categoryTotals[
                expense.category
            ]
        ) {

            categoryTotals[
                expense.category
            ] = 0;

        }

        categoryTotals[
            expense.category
        ] += expense.amount;

    });

    const remainingBudget =
        trip.estimatedBudget -
        trip.spentBudget;

    const percentageSpent =
        trip.estimatedBudget === 0
            ? 0
            : (
                (trip.spentBudget /
                    trip.estimatedBudget) *
                100
            ).toFixed(2);

    return {

        estimatedBudget:
            trip.estimatedBudget,

        spentBudget:
            trip.spentBudget,

        remainingBudget,

        percentageSpent,

        totalExpenses:
            expenses.length,

        categoryTotals

    };

};

module.exports = {

    addExpense,

    getExpenses,

    updateExpense,

    deleteExpense,

    getExpenseSummary

};