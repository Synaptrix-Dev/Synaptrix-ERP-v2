import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";
import Loader from '../../../components/Loader';

const AddEarning = ({ isVisible, onClose, onUpdate }) => {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user?.user?.id;

    const [form, setForm] = useState({
        projectName: '',
        clientName: '',
        phone: '',
        email: '',
        platform: '',
        referenceName: '',
        notes: '',
        amount: '',
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

        if (!form.amount) {
            toast.error("Amount is required.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${authURL}/root/earning/create-earning`, {
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
                toast.success("Earning added successfully!");
                setForm({
                    projectName: '',
                    clientName: '',
                    phone: '',
                    email: '',
                    platform: '',
                    referenceName: '',
                    notes: '',
                    amount: '',
                    accesibles: [],
                });
                onUpdate();
                onClose();
            } else {
                toast.error(data.message || "Failed to add earning.");
            }
        } catch (error) {
            console.error("Error adding earning:", error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[99] bg-opacity-75 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6 py-8 w-full max-w-md flex flex-col h-[550px] overflow-y-auto">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Add Earning</h1>
                        <p className="text-xs text-gray-600">
                            Fill in the earning details below.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    <div>
                        <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            id="projectName"
                            placeholder="Enter project name"
                            value={form.projectName}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div>
                        <label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                            Client Name
                        </label>
                        <input
                            type="text"
                            name="clientName"
                            id="clientName"
                            placeholder="Enter client name"
                            value={form.clientName}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="Enter phone number"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div>
                        <label htmlFor="platform" className="text-sm font-medium text-gray-700">
                            Platform
                        </label>
                        <input
                            type="text"
                            name="platform"
                            id="platform"
                            placeholder="Enter platform (e.g., Upwork, Fiverr)"
                            value={form.platform}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div>
                        <label htmlFor="referenceName" className="text-sm font-medium text-gray-700">
                            Reference Name
                        </label>
                        <input
                            type="text"
                            name="referenceName"
                            id="referenceName"
                            placeholder="Enter reference name"
                            value={form.referenceName}
                            onChange={handleChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

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
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            rows="4"
                        />
                    </div>

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
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`btnBg text-white py-2 rounded text-sm flex items-center justify-center w-full outline-none focus:outline-none transition-colors duration-200 ease-in-out ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                Adding...
                            </span>
                        ) : (
                            'Add Earning'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

function Earning() {
    const [leadsModal, setLeadsModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [earnings, setEarnings] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [selectedEarning, setSelectedEarning] = useState(null);
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const apiKey = import.meta.env.VITE_APIKEY;
    const { authURL } = useAuth();

    const openLeadsModal = () => setLeadsModal(true);
    const closeLeadsModal = () => setLeadsModal(false);
    const openEditModal = (earning) => {
        setSelectedEarning(earning);
        setEditModal(true);
    };
    const closeEditModal = () => {
        setSelectedEarning(null);
        setEditModal(false);
    };
    const openShareModal = (earning) => {
        setSelectedEarning(earning);
        setShareModal(true);
    };
    const closeShareModal = () => {
        setSelectedEarning(null);
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
        fetchEarnings();
        fetchAdmins();
    }, []);

    const fetchEarnings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${authURL}/root/earning/get-earnings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${apiKey}`,
                },
            });
            const data = await response.json();
            setEarnings(data);
            setTotalEarnings(data.reduce((sum, earn) => sum + parseFloat(earn.amount || 0), 0));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching earnings:', error);
            setLoading(false);
        }
    };

    const updateEarning = async (earningData) => {
        try {
            const response = await fetch(`${authURL}/root/earning/update-earning?id=${earningData._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${apiKey}`,
                },
                body: JSON.stringify(earningData),
            });
            if (response.ok) {
                await fetchEarnings();
                closeEditModal();
            } else {
                throw new Error('Failed to update earning');
            }
        } catch (error) {
            console.error('Error updating earning:', error);
        }
    };

    const deleteEarning = async (id) => {
        try {
            const response = await fetch(`${authURL}/root/earning/delete-earning?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${apiKey}`,
                },
            });
            if (response.ok) {
                fetchEarnings();
            }
        } catch (error) {
            console.error('Error deleting earning:', error);
        }
    };

    const updateAccessibles = async (adminId, add) => {
        if (!selectedEarning) return;
        setEarnings(earnings.map(earn =>
            earn._id === selectedEarning._id
                ? {
                    ...earn,
                    accesibles: add
                        ? [...(earn.accesibles || []), adminId]
                        : (earn.accesibles || []).filter(id => id !== adminId)
                }
                : earn
        ));
        try {
            const response = await fetch(`${authURL}/root/earning/share-earning?id=${selectedEarning._id}`, {
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
            const updatedEarning = await response.json();
            setEarnings(earnings.map(earn => earn._id === updatedEarning._id ? updatedEarning : earn));
            setShareModal(false);
            toast.success('Mission Accomplished!');
        } catch (error) {
            console.error('Error updating accessibles:', error);
            setEarnings(earnings.map(earn =>
                earn._id === selectedEarning._id
                    ? {
                        ...earn,
                        accesibles: (earn.accesibles || []).filter(id => id !== adminId)
                    }
                    : earn
            ));
        }
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = {
            _id: selectedEarning._id,
            projectName: formData.get('projectName'),
            clientName: formData.get('clientName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            platform: formData.get('platform'),
            referenceName: formData.get('referenceName'),
            notes: formData.get('notes'),
            amount: formData.get('amount'),
        };
        updateEarning(updatedData);
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
                        <h1 className="text-3xl font-bold text-gray-900">Earning Manager</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Track and manage Synaptrix Solution project earnings efficiently
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={openLeadsModal}
                            className="btnBg cursor-pointer text-white text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                            <i className="fa-regular fa-coins"></i>
                            <span>Add Earning</span>
                        </button>
                        <button
                            onClick={fetchEarnings}
                            className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                            <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-10">
                    <div className="flex items-center justify-start space-x-4 bg-green-50 border border-green-200 p-6 rounded-xl text-white transform hover:scale-[1.02] transition-all duration-300">
                        <i className="fa-solid fa-coins text-4xl mr-4 text-amber-400"></i>
                        <div className='flex flex-col items-start justify-center text-slate-800'>
                            <h2 className="font-semibold flex items-center text-sm">
                                Total Earnings
                            </h2>
                            <p className="text-3xl font-bold">$ {totalEarnings.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-10">
                        <Loader />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        {earnings.map((earning) => (
                            <div key={earning._id} className="bg-slate-50 border rounded-lg border-slate-200 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{earning.projectName || 'N/A'}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">
                                                {parseFloat(earning.amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </p>
                                            <p className="text-xs text-gray-500 font-semibold">{earning.platform || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 font-medium">
                                            Client Name: <span className="text-blue-600"> {earning.clientName || 'N/A'}</span>
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Phone: <span className="text-blue-600">{earning.phone || 'N/A'}</span>
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Email: <span className="text-blue-600">{earning.email || 'N/A'}</span>
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Reference: <span className="text-blue-600">{earning.referenceName || 'N/A'}</span>
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Note: {earning.notes || 'No Note Available'}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex justify-end space-x-2">
                                        <button
                                            onClick={() => openEditModal(earning)}
                                            className="inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => openShareModal(earning)}
                                            className="inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm leading-4 font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                            </svg>
                                            Share
                                        </button>
                                        <button
                                            onClick={() => deleteEarning(earning._id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <AddEarning
                    isVisible={leadsModal}
                    onClose={closeLeadsModal}
                    onUpdate={fetchEarnings}
                />

                {editModal && selectedEarning && (
                    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md h-[550px] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Edit Earning</h2>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        defaultValue={selectedEarning.projectName}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Client Name</label>
                                    <input
                                        type="text"
                                        name="clientName"
                                        defaultValue={selectedEarning.clientName}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        defaultValue={selectedEarning.phone}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={selectedEarning.email}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Platform</label>
                                    <input
                                        type="text"
                                        name="platform"
                                        defaultValue={selectedEarning.platform}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Reference Name</label>
                                    <input
                                        type="text"
                                        name="referenceName"
                                        defaultValue={selectedEarning.referenceName}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea
                                        name="notes"
                                        defaultValue={selectedEarning.notes}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 py-2 leading-8 transition-colors duration-200 ease-in-out"
                                        rows="4"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        defaultValue={selectedEarning.amount}
                                        step="0.01"
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-lg px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btnBg cursor-pointer text-white text-sm font-lg px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
                                    >
                                        Update Earning
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {shareModal && selectedEarning && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Share Earning</h2>
                                <button
                                    onClick={closeShareModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Select admins to share this earning with...</p>
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
                                            checked={selectedEarning.accesibles?.includes(admin._id) || false}
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

export default Earning;