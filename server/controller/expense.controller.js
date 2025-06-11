const Expense = require('../models/expense.model');

exports.createExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific expense by ID
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.query.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.query.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an expense by ID (via param or query)
exports.deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id || req.query.id;
        const expense = await Expense.findByIdAndDelete(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateAccessibles = async (req, res) => {
    try {
        const { id } = req.query; // Expense ID
        const { adminId, add } = req.body; // adminId to add/remove, add=true to add, false to remove

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (add) {
            if (!expense.accesibles.includes(adminId)) {
                expense.accesibles.push(adminId);
            }
        } else {
            expense.accesibles = expense.accesibles.filter(id => id !== adminId);
        }

        await expense.save();
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};