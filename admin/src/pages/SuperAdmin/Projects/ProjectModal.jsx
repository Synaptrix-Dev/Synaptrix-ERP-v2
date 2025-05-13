import React, { useState } from 'react';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";

const AddProjects = ({ isVisible, onClose }) => {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user?.user?.id;

    const [formData, setFormData] = useState({
        createdBy: userID,
        name: '',
        status: '',
        deadline: '',
        client: '',
        clientEmail: '',
        clientPhone: '',
        tech: [],
        description: '',
        category: '',
        budget: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tech') {
            setFormData({ ...formData, tech: value.split(',').map(item => item.trim()) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${authURL}/root/projects/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Project created successfully!');
                onClose();
                setFormData({
                    createdBy: userID,
                    name: '',
                    status: '',
                    deadline: '',
                    client: '',
                    clientEmail: '',
                    clientPhone: '',
                    tech: [],
                    description: '',
                    category: '',
                    budget: ''
                });
            } else {
                toast.error(result.error || 'Failed to create project');
            }
        } catch (error) {
            toast.error('Error creating project');
            console.error(error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[99] bg-opacity-75 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6 py-8 w-full max-w-md flex flex-col h-[80vh] overflow-y-auto">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Add new Project</h1>
                        <p className="text-xs text-gray-600">
                            Add newly targeted projects to your Synaptrix Solution account.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Project Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Status</option>
                            <option value="Planning">Planning</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Client Name</label>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Client Email</label>
                        <input
                            type="email"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Client Phone</label>
                        <input
                            type="tel"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                        <input
                            type="text"
                            name="tech"
                            value={formData.tech.join(', ')}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., React, Node.js, MongoDB"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        ></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Budget</label>
                        <input
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., $5000"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Add Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjects;