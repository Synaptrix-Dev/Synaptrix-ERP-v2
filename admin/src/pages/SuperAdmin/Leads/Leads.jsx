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
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [types, setTypes] = useState([]); // New state for unique types

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

    // Fetch all leads with pagination, search, and filters
    const fetchLeads = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page,
                limit,
                ...(search && { search }),
                ...(statusFilter && { status: statusFilter }),
                ...(sourceFilter && { source: sourceFilter }),
                ...(typeFilter && { type: typeFilter }),
            });
            const response = await fetch(`${authURL}/root/leads/get-leads?${queryParams}`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch leads');
            const data = await response.json();
            setLeads(data.leads);
            setTotalPages(data.pagination.pages);
            toast.success('Leads fetched successfully!');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch unique types
    const fetchTypes = async () => {
        try {
            const response = await fetch(`${authURL}/root/leads/get-types`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch types');
            const data = await response.json();
            setTypes(data);
        } catch (error) {
            toast.error(`Error fetching types: ${error.message}`);
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
    const handleDelete = async () => {
        if (!selectedLeadId) {
            toast.error('Please select a lead to delete');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            const response = await fetch(`${authURL}/root/leads/delete-lead?id=${selectedLeadId}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': apiKey,
                },
            });
            if (!response.ok) throw new Error('Failed to delete lead');
            setLeads(leads.filter((lead) => lead._id !== selectedLeadId));
            setSelectedLeadId(null);
            toast.success('Lead deleted successfully!');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Start editing a lead
    const handleEdit = () => {
        if (!selectedLeadId) {
            toast.error('Please select a lead to edit');
            return;
        }
        const lead = leads.find((lead) => lead._id === selectedLeadId);
        setEditingLeadId(lead._id);
        setEditFormData({
            name: lead.name,
            email: lead.email || '',
            phone: lead.phone || '',
            website: lead.website || '',
            status: lead.status || '',
        });
    };

    // Handle input changes in edit mode
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save updated lead
    const handleSave = async () => {
        if (!selectedLeadId) {
            toast.error('Please select a lead to save');
            return;
        }
        try {
            const response = await fetch(`${authURL}/root/leads/update-lead?id=${selectedLeadId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                body: JSON.stringify(editFormData),
            });
            if (!response.ok) throw new Error('Failed to update lead');
            const updatedLead = await response.json();
            setLeads(leads.map((lead) => (lead._id === selectedLeadId ? updatedLead : lead)));
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
        setSelectedLeadId(null);
    };

    // Share a lead
    const handleShare = () => {
        if (!selectedLeadId) {
            toast.error('Please select a lead to share');
            return;
        }
        const lead = leads.find((lead) => lead._id === selectedLeadId);
        openShareModal(lead);
    };

    // Refresh leads
    const handleRefresh = () => {
        setPage(1);
        setSearch('');
        setStatusFilter('');
        setSourceFilter('');
        setTypeFilter('');
        fetchLeads();
        setSelectedLeadId(null);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Handle search input
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    // Handle filter changes
    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handleSourceFilter = (e) => {
        setSourceFilter(e.target.value);
        setPage(1);
    };

    const handleTypeFilter = (e) => {
        setTypeFilter(e.target.value);
        setPage(1);
    };

    // Fetch leads, admins, and types on mount and when pagination/search/filters change
    useEffect(() => {
        fetchLeads();
        fetchAdmins();
        fetchTypes(); // Fetch types on mount
    }, [page, search, statusFilter, sourceFilter, typeFilter]);

    // Function to determine status styles
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'successful':
            case 'success':
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
            case 'email sent':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-800',
                };
            case 'not applied':
                return {
                    bg: 'bg-purple-100',
                    text: 'text-purple-800',
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                };
        }
    };

    // Format timestamp to DD/MM/YY
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
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
            <div className="flex items-start justify-between mb-4">
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

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="btnBg cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${pageNum === page
                                ? 'btnBg text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-colors duration-200`}
                        >
                            {pageNum}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="btnBg text-white text-sm cursor-pointer font-medium px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200"
                    >
                        Next
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-end justify-end w-full space-x-2 mb-4">
                    <button
                        onClick={handleEdit}
                        className="bg-emerald-600 cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors duration-200"
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-200"
                    >
                        <i className="fa-solid fa-trash"></i>
                        <span>Delete</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="bg-gray-600 cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors duration-200"
                    >
                        <i className="fa-regular fa-share-from-square"></i>
                        <span>Share</span>
                    </button>
                    {editingLeadId && (
                        <>
                            <button
                                onClick={handleSave}
                                className="bg-green-600 cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors duration-200"
                            >
                                <i className="fa-regular fa-floppy-disk"></i>
                                <span>Save</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-red-600 cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-200"
                            >
                                <i className="fa-regular fa-xmark"></i>
                                <span>Cancel</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-4 flex items-center justify-center flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by name or email..."
                        className="w-full bg-white rounded-lg border text-sm border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
                <div className="flex-1 min-w-[150px]">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="w-full bg-white rounded-lg border text-sm border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    >
                        <option value="">All Statuses</option>
                        <option value="Not Applied">Not Applied</option>
                        <option value="Email Sent">Email Sent</option>
                        <option value="No Response">No Response</option>
                        <option value="Failed">Failed</option>
                        <option value="Success">Success</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <select
                        value={typeFilter}
                        onChange={handleTypeFilter}
                        className="w-full bg-white rounded-lg border text-sm border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    >
                        <option value="">All Types</option>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto max-w-full">
                <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm table-fixed">
                    <thead className="bg-gray-50">
                        <tr className="font-semibold text-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 w-12"></th>
                            <th className="px-4 w-18 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 min-w-[80px]">ID</th>
                            <th className="px-4 py-3 w-24 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 min-w-[96px]">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 min-w-[160px]">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 w-[182px]">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 min-w-[192px]">Website</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 w-[130px]">Status</th>
                            <th className="px-4 py-3 w-32 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border border-slate-200 max-w-[100px]">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-2 text-center text-gray-500 border border-slate-200"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-2 text-center text-gray-500 border border-slate-200"
                                >
                                    No leads found.
                                </td>
                            </tr>
                        ) : (
                            leads.reverse().map((lead) => {
                                const statusStyles = getStatusStyles(
                                    editingLeadId === lead._id ? editFormData.status : lead.status
                                );
                                return (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-slate-200">
                                            <input
                                                type="radio"
                                                name="selectedLead"
                                                checked={selectedLeadId === lead._id}
                                                onChange={() => setSelectedLeadId(lead._id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 font-bold border border-slate-200">
                                            {lead.leadID}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 border border-slate-200">
                                            {formatDate(lead.createdAt)}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-900 border border-slate-200">
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
                                        <td className="px-4 py-2 text-xs text-gray-500 border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editFormData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <>
                                                    <p className="text-xs break-words">{lead.email || 'N/A'}</p>
                                                    <p className="text-xs break-words">{lead.phone || 'N/A'}</p>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500 border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <input
                                                    type="text"
                                                    name="website"
                                                    value={editFormData.website}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <>
                                                    <p className="text-xs break-words">{lead.website || 'N/A'}</p>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-xs border border-slate-200">
                                            {editingLeadId === lead._id ? (
                                                <select
                                                    name="status"
                                                    value={editFormData.status}
                                                    onChange={handleInputChange}
                                                    className={`w-full border border-gray-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusStyles.bg} ${statusStyles.text}`}
                                                >
                                                    <option value="Not Applied">Not Applied</option>
                                                    <option value="Email Sent">Email Sent</option>
                                                    <option value="No Response">No Response</option>
                                                    <option value="Failed">Failed</option>
                                                    <option value="Success">Success</option>
                                                </select>
                                            ) : (
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full capitalize text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}
                                                >
                                                    {lead.status || 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 border border-slate-200">
                                            {lead.type || 'N/A'}
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