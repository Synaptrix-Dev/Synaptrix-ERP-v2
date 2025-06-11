import React, { useState, useEffect } from 'react';
import AddExpense from './AddExpense';
import toast from "react-hot-toast";
import Loader from '../../../components/Loader';

function Expense() {
  const [leadsModal, setLeadsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const apiKey = import.meta.env.VITE_APIKEY;
  const authURL = import.meta.env.VITE_BASE_URL;

  const openLeadsModal = () => setLeadsModal(true);
  const closeLeadsModal = () => setLeadsModal(false);
  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setEditModal(true);
  };
  const closeEditModal = () => {
    setSelectedExpense(null);
    setEditModal(false);
  };
  const openShareModal = (expense) => {
    setSelectedExpense(expense);
    setShareModal(true);
  };
  const closeShareModal = () => {
    setSelectedExpense(null);
    setShareModal(false);
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${authURL}/root/auth/get-admins`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchAdmins();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${authURL}/root/expense/get-expenses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`,
        },
      });
      const data = await response.json();
      setExpenses(data);
      setTotalExpenses(data.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0));
      setTotalOutstanding(data.reduce((sum, exp) => sum + parseFloat(exp.outstandingAmount || 0), 0));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const updateExpense = async (expenseData) => {
    try {
      const response = await fetch(`${authURL}/root/expense/update-expense?id=${expenseData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`,
        },
        body: JSON.stringify(expenseData),
      });
      if (response.ok) {
        await fetchExpenses();
        closeEditModal();
      } else {
        throw new Error('Failed to update expense');
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

  const updateAccessibles = async (adminId, add) => {
    if (!selectedExpense) return;
    setExpenses(expenses.map(exp =>
      exp._id === selectedExpense._id
        ? {
          ...exp,
          accesibles: add
            ? [...(exp.accesibles || []), adminId]
            : (exp.accesibles || []).filter(id => id !== adminId)
        }
        : exp
    ));
    try {
      const response = await fetch(`${authURL}/root/expense/share-expense?id=${selectedExpense._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apiKey}`,
        },
        body: JSON.stringify({ adminId, add }),
      });
      if (!response.ok) {
        throw new Error('Failed to update accessibles');
      }
      const updatedExpense = await response.json();
      setExpenses(expenses.map(exp => exp._id === updatedExpense._id ? updatedExpense : exp));
      setShareModal(false);
      toast.success('Mission Accomplished!');
    } catch (error) {
      console.error('Error updating accessibles:', error);
      setExpenses(expenses.map(exp =>
        exp._id === selectedExpense._id
          ? {
            ...exp,
            accesibles: (exp.accesibles || []).filter(id => id !== adminId)
          }
          : exp
      ));
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      _id: selectedExpense._id,
      date: formData.get('date'),
      investedAt: formData.get('investedAt'),
      amount: formData.get('amount'),
      receiptsCodes: formData.get('receiptsCodes'),
      notes: formData.get('notes'),
      outstandingAmount: formData.get('outstandingAmount'),
      contribution: formData.get('contribution'),
    };
    updateExpense(updatedData);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Manager</h1>
            <p className="text-sm text-gray-600 mt-2">
              Track and manage Synaptrix Solution project expenses efficiently
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={openLeadsModal}
              className="btnBg cursor-pointer text-white text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
              <i className="fa-regular fa-coins"></i>
              <span>Add Expense</span>
            </button>
            <button
              onClick={fetchExpenses}
              className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
              <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center justify-start space-x-4 bg-blue-50 border border-blue-200 p-6 rounded-xl text-white transform hover:scale-[1.02] transition-all duration-300">
            <i className="fa-solid fa-coins text-4xl mr-4 text-amber-400"></i>
            <div className='flex flex-col items-start justify-center text-slate-800'>
              <h2 className="font-semibold flex items-center text-sm">
                Total Expenses
              </h2>
              <p className="text-3xl font-bold">PKR {totalExpenses.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center justify-start space-x-4 bg-red-50 border border-red-200 p-6 rounded-xl text-white transform hover:scale-[1.02] transition-all duration-300">
            <i className="fa-solid fa-coins text-4xl mr-4 text-amber-400"></i>
            <div className='flex flex-col items-start justify-center text-slate-800'>
              <h2 className="font-semibold flex items-center text-sm">
                Total Outstanding Amount
              </h2>
              <p className="text-3xl font-bold ">PKR {totalOutstanding.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-10">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {expenses.map((expense) => {
              const hasOutstanding = !!expense.outstandingAmount;
              const cardClass = hasOutstanding
                ? "bg-red-100 border rounded-lg border-red-200 overflow-hidden"
                : "bg-slate-50 border rounded-lg border-slate-200 overflow-hidden";
              const buttonClass = hasOutstanding
                ? "inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm leading-4 font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                : "inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

              return (
                <div key={expense._id} className={cardClass}>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{expense.investedAt || 'N/A'}</h3>
                        <p className="text-sm text-gray-500">Contributed by {expense.contribution || 'Everyone'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {parseFloat(expense.amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'PKR' })}
                        </p>
                        <p className="text-xs text-gray-500">{expense.date || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 font-medium">
                        Receipts: <span className="text-blue-600">{expense.receiptsCodes || 'No Receipt Available'}</span>
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        Outstanding Amount: <span className="font-medium text-red-600">
                          {expense.outstandingAmount ? `PKR ${parseFloat(expense.outstandingAmount).toFixed(2)}` : 'Paid by Everyone'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        Note: {expense.notes || 'No Note Available'}
                      </p>
                    </div>

                    <div className="mt-5 flex justify-end space-x-2">
                      <button onClick={() => openEditModal(expense)} className={buttonClass}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => openShareModal(expense)}
                        className="inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm leading-4 font-medium rounded-md text-slate-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Share
                      </button>
                      <button
                        onClick={() => deleteExpense(expense._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AddExpense
          isVisible={leadsModal}
          onClose={closeLeadsModal}
          onUpdate={fetchExpenses}
        />

        {editModal && selectedExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Expense</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={selectedExpense.date}
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invested At</label>
                  <input
                    type="text"
                    name="investedAt"
                    defaultValue={selectedExpense.investedAt}
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (PKR)</label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={selectedExpense.amount}
                    step="0.01"
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Receipt Codes</label>
                  <input
                    type="text"
                    name="receiptsCodes"
                    defaultValue={selectedExpense.receiptsCodes}
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <input
                    type='text'
                    name="notes"
                    defaultValue={selectedExpense.notes}
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Outstanding Amount (PKR)</label>
                  <input
                    type="number"
                    name="outstandingAmount"
                    defaultValue={selectedExpense.outstandingAmount}
                    step="0.01"
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contribution</label>
                  <input
                    type="text"
                    name="contribution"
                    defaultValue={selectedExpense.contribution}
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btnBg cursor-pointer text-white text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                    Update Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {shareModal && selectedExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Share Credential</h2>
                <button
                  onClick={closeShareModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Select admins to share this credential with...</p>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search Administrator"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {filteredAdmins.map((admin) => (
                <div key={admin._id} className="flex items-center justify-between p-2 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{admin.fullName}</p>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedExpense.accesibles?.includes(admin._id) || false}
                      onChange={(e) => updateAccessibles(admin._id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expense;