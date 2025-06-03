import React, { useState, useEffect } from 'react';
import AddExpense from './AddExpense';

function Expense() {
  const [leadsModal, setLeadsModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const apiKey = import.meta.env.VITE_APIKEY;
  const authURL = import.meta.env.VITE_BASE_URL;

  const openLeadsModal = () => setLeadsModal(true);
  const closeLeadsModal = () => setLeadsModal(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${authURL}/root/expense/get-expenses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setExpenses(data);
      setTotalExpenses(data.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0));
      setTotalOutstanding(data.reduce((sum, exp) => sum + parseFloat(exp.outstandingAmount || 0), 0));
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const updateExpense = async (id, updatedData) => {
    try {
      const response = await fetch(`${authURL}/root/expense/update-expense`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`${authURL}/root/expense/delete-expense?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`,
        },
      });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className='p-4'>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Expense Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Synaptrix Solution Projects & their respective details.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={openLeadsModal}
            className="btnBg cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
          >
            <i className="fa-regular fa-coins"></i>
            <span>Add new Expense</span>
          </button>
          <button
            onClick={fetchExpenses}
            className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors duration-200"
          >
            <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <i className="fa-solid fa-money-bill-wave mr-2"></i> Total Expenses
          </h2>
          <p className="text-2xl font-bold mt-2">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-400 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <i className="fa-solid fa-exclamation-circle mr-2"></i> Total Outstanding
          </h2>
          <p className="text-2xl font-bold mt-2">${totalOutstanding.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-start"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-600">{expense.investedAt}</h3>
                <p className="text-lg font-bold text-blue-600">PKR {parseFloat(expense.amount).toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Contributed by {expense.contribution || 'Everyone'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Receipts: {expense.receiptsCodes || 'N/A'}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Outstanding Amount: {expense.outstandingAmount ? `PKR ${parseFloat(expense.outstandingAmount).toFixed(2)}` : 'Paid by Everyone'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Note: {expense.notes || 'N/A'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => updateExpense(expense._id, expense)}
                className="text-gray-600 hover:text-gray-800 px-2 py-1"
              >
                <i className="fa-solid fa-pen"></i> Edit
              </button>
              <button
                onClick={() => deleteExpense(expense._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
              >
                <i className="fa-solid fa-trash mr-1"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddExpense
        isVisible={leadsModal}
        onClose={closeLeadsModal}
        onUpdate={updateExpense}
      />
    </div>
  );
}

export default Expense;