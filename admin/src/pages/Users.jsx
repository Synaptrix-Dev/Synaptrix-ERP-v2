import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/data";
import toast from "react-hot-toast";
import Loader from '../components/Loader';

function Users() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', isAdmin: false });
    const [loading, setLoading] = useState(true);

    // Fetch all admins
    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${authURL}/root/auth/get-admins`, {
                headers: {
                    'x-api-key': apiKey
                }
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                // Strictly normalize isAdmin to boolean
                const normalized = data.map(user => ({
                    ...user,
                    isAdmin: user.isAdmin === true || user.isAdmin === 'true' || user.isAdmin === 1
                }));
                setUsers(normalized);
            } else {
                toast.error('Failed to fetch admins');
            }
        } catch (error) {
            toast.error('Error fetching admins');
        } finally {
            setLoading(false);
        }
    };


    // Initial fetch
    useEffect(() => {
        fetchAdmins();
    }, []);

    // Handle admin status change via dropdown
    const handleAdminStatusChange = async (user, newStatus) => {
        const newAdminStatus = newStatus === 'Allowed';

        // Optimistically update UI
        setUsers(prevUsers =>
            prevUsers.map(u =>
                u._id === user._id ? { ...u, isAdmin: newAdminStatus } : u
            )
        );

        try {
            const response = await fetch(`${authURL}/root/auth/update-admin?_id=${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({ isAdmin: newAdminStatus })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Admin status updated');
            } else {
                // Revert UI on failure
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u._id === user._id ? { ...u, isAdmin: !newAdminStatus } : u
                    )
                );
                toast.error(data.error || 'Failed to update admin status');
            }
        } catch (error) {
            // Revert UI on error
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u._id === user._id ? { ...u, isAdmin: !newAdminStatus } : u
                )
            );
            toast.error('Error updating admin status: ' + error.message);
        }
    };

    // Handle edit
    const handleEdit = (user) => {
        setEditingUser(user._id);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            isAdmin: user.isAdmin
        });
    };

    // Handle edit form submission
    const handleEditSubmit = async (e, userId) => {
        e.preventDefault();
        try {
            const response = await fetch(`${authURL}/auth/update-admin?_id=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Admin updated successfully');
                setEditingUser(null);
                fetchAdmins();
            } else {
                toast.error(data.error || 'Failed to update admin');
            }
        } catch (error) {
            toast.error('Error updating admin: ' + error.message);
        }
    };

    // Handle delete
    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                const response = await fetch(`${authURL}/auth/delete-admins?_id=${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': apiKey
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success('Admin deleted successfully');
                    fetchAdmins();
                } else {
                    toast.error(data.error || 'Failed to delete admin');
                }
            } catch (error) {
                toast.error('Error deleting admin: ' + error.message);
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className='p-4'>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Users Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage Synaptrix Solution admins and their details here.</p>
                </div>
                <button
                    onClick={fetchAdmins}
                    className="bg-slate-900 cursor-pointer text-white text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                    <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                    <span>Refresh Data</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
                {users.map((user) => (
                    <div key={user._id} className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50">
                        <div className="p-6">
                            {editingUser === user._id ? (
                                <form onSubmit={(e) => handleEditSubmit(e, user._id)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingUser(null)}
                                            className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-medium text-gray-900">{user.fullName}</h3>
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                            {user.isAdmin ? 'Active' : 'In-Active'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-blue-600 mb-4">{user.email}</p>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Access Status:</span>
                                            <select
                                                value={user.isAdmin ? 'Allowed' : 'Restricted'}
                                                onChange={(e) => handleAdminStatusChange(user, e.target.value)}
                                                className="mt-1 block w-32 rounded bg-white border px-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            >
                                                <option value="Allowed">Allowed</option>
                                                <option value="Restricted">Restricted</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(user._id)}
                                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;