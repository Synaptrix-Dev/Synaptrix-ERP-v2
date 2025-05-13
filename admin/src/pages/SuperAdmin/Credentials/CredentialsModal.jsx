import React, { useState } from 'react';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";

const CashIn = ({ isVisible, onClose }) => {
    const encryptionKey = import.meta.env.VITE_APIKEY_EKEY;
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user.user.id; // Optional chaining to avoid errors if user is null

    const [formData, setFormData] = useState({
        accName: '',
        username: '',
        type: '',
        phone: '',
        emailAddress: '',
        status: '',
        authentication: '',
        password: '',
        note: '',
        createdBy: userID,
        accesibles: [userID]
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Encrypt the password
        const encryptedPassword = CryptoJS.AES.encrypt(formData.password, encryptionKey).toString();

        const payload = {
            ...formData,
            password: encryptedPassword,
            adminAccess: true,
        };

        try {
            const response = await fetch(`${authURL}/root/credentials/post-creds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("Credentials Secured", {
                    duration: 3000,
                    position: "bottom-right",
                });
                setFormData({
                    accName: '',
                    username: '',
                    type: '',
                    phone: '',
                    status: '',
                    emailAddress: '',
                    authentication: '',
                    password: '',
                    note: '',
                });
                onClose();
            } else {
                toast.error("Failed to secure", {
                    duration: 3000,
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Internal Server Error", {
                duration: 3000,
                position: "bottom-right",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[99] bg-opacity-75 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6 py-8 w-full max-w-md flex flex-col">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Secure an account</h1>
                        <h1 className="text-xs text-gray-600">
                            Add your Passwords and Accounts here securely...
                        </h1>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">

                    <input
                        type="text"
                        name="accName"
                        placeholder="Account Name"
                        value={formData.accName}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="emailAddress"
                        placeholder="Email Address"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="authentication"
                        placeholder="Authentication"
                        value={formData.authentication}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    >
                        <option value="" disabled>Select option</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="deleted">Deleted</option>
                    </select>
                    <textarea
                        name="note"
                        placeholder="Note"
                        value={formData.note}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    ></textarea>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btnBg text-white py-2 rounded text-sm flex items-center justify-center ${
                            loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                                Securing...
                            </>
                        ) : (
                            'Secure Account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CashIn;