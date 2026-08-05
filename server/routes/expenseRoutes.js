const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    validateExpense
} = require("../validators/expenseValidator");

const {

    createExpense,

    fetchExpenses,

    editExpense,

    removeExpense,

    summary

} = require("../controllers/expenseController");

// =======================
// Add Expense
// =======================
router.post(
    "/",
    protect,
    validateExpense,
    createExpense
);

// =======================
// Get Expenses
// =======================
router.get(
    "/trip/:tripId",
    protect,
    fetchExpenses
);

// =======================
// Expense Summary
// =======================
router.get(
    "/summary/:tripId",
    protect,
    summary
);

// =======================
// Update Expense
// =======================
router.put(
    "/:id",
    protect,
    validateExpense,
    editExpense
);

// =======================
// Delete Expense
// =======================
router.delete(
    "/:id",
    protect,
    removeExpense
);

module.exports = router;