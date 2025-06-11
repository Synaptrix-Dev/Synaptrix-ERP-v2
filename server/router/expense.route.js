const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const protectAPIsMiddleware = require('../middleware/protectAPI');

router.use(bodyParser.json());
router.use(protectAPIsMiddleware);
router.use(bodyParser.urlencoded({ extended: false }));

// * IMPORTING CONTROLLERS - SIMULATION 😎
const expenseController = require('../controller/expense.controller');

// * CREATING ROUTES - 😎 ============================================
router.route('/create-expense').post(expenseController.createExpense);
router.route('/get-expenses').get(expenseController.getAllExpenses);
router.route('/get-expense-by-id').get(expenseController.getExpenseById);
router.route('/update-expense').patch(expenseController.updateExpense);
router.route('/share-expense').patch(expenseController.updateAccessibles);
router.route('/delete-expense').delete(expenseController.deleteExpense);


module.exports = router;

