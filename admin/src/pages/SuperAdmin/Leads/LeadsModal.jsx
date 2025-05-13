import React, { useState } from 'react';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";

const AddLeads = ({ isVisible, onClose }) => {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user?.user?.id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        company: '',
        designation: '',
        status: '',
    });

    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const leadData = {
            createdBy: userID,
            leadID: formData.leadID,
            location: formData.location || undefined,
            name: formData.name,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            company: formData.company || undefined,
            designation: formData.designation || undefined,
            status: formData.status || undefined,
        };

        try {
            const response = await fetch(`${authURL}/root/leads/add-lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify(leadData)
            });

            if (!response.ok) throw new Error("Failed to create lead");

            toast.success("Lead created successfully!");
            setFormData({
                location: '',
                name: '',
                email: '',
                phone: '',
                designation: '',
                company: '',
                status: '',
            });
            onClose();
        } catch (error) {
            toast.error("Error creating lead");
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-[99] bg-opacity-75 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6 py-8 w-full max-w-md flex flex-col">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Leads Generator</h1>
                        <p className="text-xs text-gray-600">
                            Add newly targeted leads to your Synaptrix Solution account.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input
                        type="text"
                        name="leadID"
                        placeholder="Lead ID"
                        value={formData.leadID}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
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
                        name="company"
                        placeholder="Company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="designation"
                        placeholder="Designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <input
                        type="text"
                        name="status"
                        placeholder="Status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <button
                        type="submit"
                        className="btnBg text-white py-2 rounded text-sm flex items-center justify-center w-full outline-none focus:outline-none transition-colors duration-200 ease-in-out"
                    >
                        Add Lead
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLeads;
