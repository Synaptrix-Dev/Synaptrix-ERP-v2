import React, { useState, useEffect } from 'react';
import AddLeads from './LeadsModal';
import { useAuth } from '../../../context/data';
import toast from 'react-hot-toast';

function Leads() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem('user'));
    const userID = user?.user?.id;
    const [leadsModal, setLeadsModal] = useState(false);
    const [leads, setLeads] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingLeadId, setEditingLeadId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [shareModal, setShareModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    const openLeadsModal = () => setLeadsModal(true);
    const closeLeadsModal = () => setLeadsModal(false);
    const openShareModal = (lead) => {
        setSelectedLead(lead);
        setShareModal(true);
    };
    const closeShareModal = () => {
        setShareModal(false);
        setSelectedLead(null);
    };

    // Fetch all leads
    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${authURL}/root/leads/get-leads`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch leads');
            const data = await response.json();
            setLeads(data);
            toast.success('Leads fetched successfully!');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all admins
    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${authURL}/root/auth/get-admins`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch admins');
            const data = await response.json();
            setAdmins(data);
        } catch (error) {
            toast.error(`Error fetching admins: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Delete a lead
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            const response = await fetch(`${authURL}/root/leads/delete-lead?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': apiKey,
                },
            });
            if (!response.ok) throw new Error('Failed to delete lead');
            setLeads(leads.filter((lead) => lead._id !== id));
            toast.success('Lead deleted successfully!');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Start editing a lead
    const handleEdit = (lead) => {
        setEditingLeadId(lead._id);
        setEditFormData({
            name: lead.name,
            email: lead.email || '',
            phone: lead.phone || '',
            company: lead.company || '',
            status: lead.status || '',
        });
    };

    // Handle input changes in edit mode
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save updated lead
    const handleSave = async (id) => {
        try {
            const response = await fetch(`${authURL}/root/leads/update-lead?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                body: JSON.stringify(editFormData),
            });
            if (!response.ok) throw new Error('Failed to update lead');
            const updatedLead = await response.json();
            setLeads(leads.map((lead) => (lead._id === id ? updatedLead : lead)));
            setEditingLeadId(null);
            toast.success('Lead updated successfully!');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setEditingLeadId(null);
        setEditFormData({});
    };

    // Refresh leads
    const handleRefresh = () => {
        fetchLeads();
    };

    // Fetch leads and admins on component mount
    useEffect(() => {
        fetchLeads();
        fetchAdmins();
    }, []);

    // Function to determine status styles
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'successful':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                };
            case 'under discussion':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                };
            case 'no response':
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                };
            case 'failed':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                };
        }
    };

    // ShareLeadModal Component
    const ShareLeadModal = ({ isVisible, onClose, lead }) => {
        if (!isVisible || !lead) return null;

        const handleToggleAccess = async (adminId) => {
            try {
                const response = await fetch(
                    `${authURL}/root/leads/update-leads-access?id=${lead._id}&ids=${adminId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': apiKey,
                        },
                    }
                );

                if (!response.ok) throw new Error('Failed to update access');

                const data = await response.json();
                setLeads((prev) =>
                    prev.map((l) =>
                        l._id === lead._id
                            ? { ...l, accesibles: data.updatedleads.accesibles }
                            : l
                    )
                );

                const action = data.results[0].message.includes('granted')
                    ? 'granted to'
                    : 'revoked from';
                toast.success(`Access ${action} admin`);
                onClose();
            } catch (error) {
                toast.error('Failed to update access. Please try again.');
            }
        };

        return (
            <div className="fixed inset-0 z-[99] bg-opacity-75 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6 py-8 w-full max-w-md flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Share Lead</h1>
                            <h1 className="text-xs text-gray-600">
                                Select admins to share this lead with...
                            </h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            <i className="fa-solid fa-xmark fa-lg"></i>
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="text"
                            className="w-full bg-white rounded-lg border text-sm border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="Search Administrator"
                        />
                    </div>

                    <div className="space-y-4">
                        {admins.length > 0 ? (
                            admins.map((admin) => (
                                <div
                                    key={admin.email}
                                    className="flex items-center justify-between p-3 border border-slate-200 rounded-md"
                                >
                                    <div className="flex items-center space-x-3">
                                        <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={lead.accesibles?.includes(admin._id) || false}
                                                onChange={() => handleToggleAccess(admin._id)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                                        </label>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {admin.fullName}
                                            </p>
                                            <p className="text-xs text-gray-500">{admin.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No admins found.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Leads Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage Synaptrix Solution leads & their respective details.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={openLeadsModal}
                        className="btnBg cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
                    >
                        <i className="fa-light fa-user-headset"></i>
                        <span>Generate new Lead</span>
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors duration-200"
                    >
                        <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                        <tr className="font-semibold text-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200">
                                Lead ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200">
                                Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 w-20">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-1 text-center text-gray-500 border border-slate-200"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-1 text-center text-gray-500 border border-slate-200"
                                >
                                    No leads found.
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => {
                                const statusStyles = getStatusStyles(
                                    editingLeadId === lead._id ? editFormData.status : lead.status
                                );
                                return (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900 font-bold border border-slate-200">
                                            {lead.leadID}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900 border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editFormData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            ) : (
                                                lead.name
                                            )}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500 border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editFormData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                lead.email || 'N/A'
                                            )}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500 border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={editFormData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                lead.phone || 'N/A'
                                            )}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500 border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={editFormData.company}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <>
                                                    <p className="flex flex-col">
                                                        {lead.company || 'N/A'}
                                                    </p>
                                                    <p className="text-xs">
                                                        {lead.designation || 'N/A'}
                                                    </p>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <input
                                                    type="text"
                                                    name="status"
                                                    value={editFormData.status}
                                                    onChange={handleInputChange}
                                                    className={`w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusStyles.bg} ${statusStyles.text}`}
                                                />
                                            ) : (
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full capitalize text-sm font-medium ${statusStyles.bg} ${statusStyles.text}`}
                                                >
                                                    {lead.status || 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-1 text-sm font-medium border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(lead._id)}
                                                        className="text-green-600 hover:text-green-800 mr-4 cursor-pointer"
                                                    >
                                                        <i className="fa-regular fa-floppy-disk"></i>
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="text-red-600 hover:text-red-800 cursor-pointer"
                                                    >
                                                        <i className="fa-regular fa-xmark"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleEdit(lead)}
                                                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(lead._id)}
                                                        className="text-red-600 hover:text-red-800 cursor-pointer"
                                                    >
                                                          <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 mx-2"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => openShareModal(lead)}
                                                        className="text-slate-600 hover:text-slate-800 cursor-pointer"
                                                    >
                                                        <i className="fa-regular fa-share-from-square"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <AddLeads
                isVisible={leadsModal}
                onClose={closeLeadsModal}
                refreshLeads={fetchLeads}
            />
            <ShareLeadModal
                isVisible={shareModal}
                onClose={closeShareModal}
                lead={selectedLead}
            />
        </div>
    );
}

export default Leads;