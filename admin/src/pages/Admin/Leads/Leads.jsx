import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/data';
import toast from 'react-hot-toast';

function Leads() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem('user'));
    const userID = user?.user?.id;
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        source: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    // Fetch leads with filters, search, and pagination
    const fetchLeads = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                id: userID,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage,
                ...filters,
            }).toString();

            const response = await fetch(`${authURL}/root/leads/get-accessed-leads?${queryParams}`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch leads');
            const data = await response.json();
            setLeads(data.leads);
            setPagination({
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPages,
                totalItems: data.pagination.totalItems,
                itemsPerPage: data.pagination.itemsPerPage,
            });

            if (data.message) {
                toast(data.message, {
                    icon: 'ℹ️',
                    style: {
                        border: '1px solid #3b82f6',
                        color: '#1f2937',
                    },
                });
            } else {
                toast.success('Leads fetched successfully!');
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userID) {
            fetchLeads();
        }
    }, [pagination.currentPage, filters]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };

    // Function to determine status styles
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'successful':
                return { bg: 'bg-green-100', text: 'text-green-800' };
            case 'under discussion':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
            case 'no response':
                return { bg: 'bg-gray-100', text: 'text-gray-800' };
            case 'failed':
                return { bg: 'bg-red-100', text: 'text-red-800' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800' };
        }
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
                <button
                    onClick={fetchLeads}
                    className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-medium px-4 py-1 rounded-md flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors duration-200"
                >
                    <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                    <span>Refresh</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name or email..."
                    className="px-4 py-1 text-sm border w-1/3 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="px-4 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Statuses</option>
                    <option value="successful">Successful</option>
                    <option value="under discussion">Under Discussion</option>
                    <option value="no response">No Response</option>
                    <option value="failed">Failed</option>
                </select>
                <select
                    name="source"
                    value={filters.source}
                    onChange={handleFilterChange}
                    className="px-4 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Sources</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="advertisement">Advertisement</option>
                </select>
                <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="px-4 py-1 border text-sm border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="createdAt">Created At</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                </select>
                <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="px-4 py-1 border text-sm border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
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
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-1 text-center text-gray-500 border border-slate-200"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-1 text-center text-gray-500 border border-slate-200"
                                >
                                    No leads found.
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => {
                                const statusStyles = getStatusStyles(lead.status);
                                return (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900 font-bold border border-slate-200">
                                            {lead.leadID}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900 border border-slate-200">
                                            {lead.name}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500 border border-slate-200">
                                            {lead.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500 border border-slate-200">
                                            {lead.phone || 'N/A'}
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500 border border-slate-200">
                                            <p className="flex flex-col">
                                                {lead.company || 'N/A'}
                                            </p>
                                            <p className="text-xs">
                                                {lead.designation || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-1 whitespace-nowrap text-sm border border-slate-200">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyles.bg} ${statusStyles.text}`}
                                            >
                                                {lead.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Showing {leads.length} of {pagination.totalItems} leads
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-1 border border-slate-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-1 text-sm text-gray-700">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-4 py-1 border border-slate-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Leads;