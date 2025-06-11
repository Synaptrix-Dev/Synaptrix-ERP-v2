import React, { useState } from 'react';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";

const AddExpense = ({ isVisible, onClose }) => {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user?.user?.id;

    const [form, setForm] = useState({
        date: '',
        investedAt: '',
        amount: '',
        receiptsCodes: '',
        notes: '',
        outstandingAmount: '',
        contribution: '',
        accesibles: [],
    });

    const [isLoading, setIsLoading] = useState(false);

    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAccesiblesChange = (e) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            accesibles: value ? value.split(',').map((item) => item.trim()) : [],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.date || !form.amount) {
            toast.error("Date and Amount are required.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${authURL}/root/expense/create-expense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                },
                body: JSON.stringify({
                    ...form,
                    userID,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Expense added successfully!");
                setForm({
                    date: '',
                    investedAt: '',
                    amount: '',
                    receiptsCodes: '',
                    notes: '',
                    outstandingAmount: '',
                    contribution: '',
                    accesibles: [],
                });
                onClose();
            } else {
                toast.error(data.message || "Failed to add expense.");
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[99] bg-opacity-75 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6 py-8 w-full max-w-md flex flex-col  overflow-y-auto">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Add Expense</h1>
                        <p className="text-xs text-gray-600">
                            Fill in the expense details below.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    {/* Date Input */}
                    <div>
                        <label htmlFor="date" className="text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    {/* Invested At Input */}
                    <div>
                        <label htmlFor="investedAt" className="text-sm font-medium text-gray-700">
                            Invested At
                        </label>
                        <input
                            type="text"
                            name="investedAt"
                            id="investedAt"
                            placeholder="Enter investment location"
                            value={form.investedAt}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            placeholder="Enter amount"
                            value={form.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    {/* Receipts Codes Input */}
                    <div>
                        <label htmlFor="receiptsCodes" className="text-sm font-medium text-gray-700">
                            Receipts Codes
                        </label>
                        <input
                            type="text"
                            name="receiptsCodes"
                            id="receiptsCodes"
                            placeholder="Enter receipt codes"
                            value={form.receiptsCodes}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    {/* Notes Input */}
                    <div>
                        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <input
                            type='text'
                            name="notes"
                            id="notes"
                            placeholder="Enter notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    {/* Outstanding Amount Input */}
                    <div>
                        <label htmlFor="outstandingAmount" className="text-sm font-medium text-gray-700">
                            Outstanding Amount
                        </label>
                        <input
                            type="number"
                            name="outstandingAmount"
                            id="outstandingAmount"
                            placeholder="Enter outstanding amount"
                            value={form.outstandingAmount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    {/* Contribution Input */}
                    <div>
                        <label htmlFor="contribution" className="text-sm font-medium text-gray-700">
                            Contributed by
                        </label>
                        <input
                            type="text"
                            name="contribution"
                            id="contribution"
                            placeholder="Enter contribution"
                            value={form.contribution}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3  leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`btnBg text-white py-2 rounded text-sm flex items-center justify-center w-full outline-none focus:outline-none transition-colors duration-200 ease-in-out ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Adding...
                            </span>
                        ) : (
                            'Add Expense'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;