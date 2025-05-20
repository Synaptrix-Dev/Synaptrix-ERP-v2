import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Quill styles

const AddProjects = ({ isVisible, onClose }) => {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user?.user?.id;

    // Log userID to verify it's being retrieved
    console.log("userID:", userID);

    const [formData, setFormData] = useState({
        createdBy: userID,
        name: '',
        status: '',
        deadline: '',
        client: '',
        clientEmail: '',
        clientPhone: '',
        tech: [],
        accesibles: [userID],
        description: '',
        category: '',
        budget: ''
    });

    const [quill, setQuill] = useState(null);

    // Initialize Quill editor
    useEffect(() => {
        if (isVisible) {
            const editor = new Quill('#editor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['clean']
                    ]
                }
            });

            // Update formData when Quill content changes
            editor.on('text-change', () => {
                const content = editor.root.innerHTML;
                setFormData(prev => ({ ...prev, description: content }));
            });

            setQuill(editor);

            // Cleanup on unmount
            return () => {
                editor.off('text-change');
            };
        }
    }, [isVisible]);

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

        // Log formData to verify accesibles contains userID
        console.log("formData:", formData);

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
                    accesibles: [userID],
                    description: '',
                    category: '',
                    budget: ''
                });
                if (quill) {
                    quill.setContents([]); // Clear Quill editor
                }
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
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-8 py-10 w-full max-w-4xl flex flex-col h-[75vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Add New Project</h1>
                        <p className="text-sm text-gray-600">
                            Add newly targeted projects to your Synaptrix Solution account.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
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
                    <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <div id="editor" className="mt-1 border border-gray-300 rounded-md" style={{ minHeight: '150px' }}></div>
                    </div>
                    <div className="col-span-2 flex justify-end gap-3 mt-14">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white btnBg rounded-md hover:bg-blue-700"
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