import React, { useState, useEffect } from 'react';

// Custom icons using SVG
const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconDollar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconTrend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

// Stats Card Component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-50 rounded-full text-${color}-600`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Leads Card Component
const LeadsCard = ({ leadsBreakdown, totalLeads }) => {
  const leadTypes = [
    { key: 'EmailSent', label: 'Email Sent', color: 'blue-600' },
    { key: 'NotApplied', label: 'Not Applied', color: 'green-600' },
    { key: 'NoResponse', label: 'No Response', color: 'yellow-600' },
    { key: 'Failed', label: 'Failed', color: 'red-600' },
    { key: 'Success', label: 'Success', color: 'purple-600' }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-slate-800">Leads by Status</h2>
        <span className="text-sm text-blue-600">View All</span>
      </div>
      <div className="space-y-4">
        {leadTypes.map((lead, index) => {
          const count = leadsBreakdown[lead.key] || 0;
          const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : 0;
          return (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">{lead.label}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${lead.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Total Leads</span>
          <span className="text-sm font-medium">{totalLeads}</span>
        </div>
      </div>
    </div>
  );
};

// Projects Card Component
const ProjectsCard = ({ projectsBreakdown, totalProjects }) => {
  const projectTypes = [
    { key: 'Canceled', label: 'Canceled', color: 'red-600' },
    { key: 'InProgress', label: 'In Progress', color: 'blue-600' },
    { key: 'Completed', label: 'Completed', color: 'green-600' }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-slate-800">Projects by Status</h2>
        <span className="text-sm text-blue-600">View All</span>
      </div>
      <div className="space-y-4">
        {projectTypes.map((project, index) => {
          const count = projectsBreakdown[project.key] || 0;
          const percentage = totalProjects > 0 ? ((count / totalProjects) * 100).toFixed(0) : 0;
          return (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">{project.label}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${project.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Total Projects</span>
          <span className="text-sm font-medium">{totalProjects}</span>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const baseURL = import.meta.env.VITE_BASE_URL; // e.g., http://localhost:5000
  const apiKey = import.meta.env.VITE_APIKEY; // API key for authentication
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${baseURL}/root/stats/get`, {
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          }
        });

        // Debug response
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${text.substring(0, 100)}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Response is not JSON: ${text.substring(0, 100)}`);
        }

        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          setError('Failed to fetch stats: ' + data.error);
        }
      } catch (err) {
        setError('Error fetching stats: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [baseURL, apiKey]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Super Administrator</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening</p>
      </header>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.totalCredentials > 0 && (
          <StatCard
            title="Secured Credentials"
            value={stats.totalCredentials}
            icon={<IconLock />}
            color="blue"
          />
        )}
        {stats.totalExpenses > 0 && (
          <StatCard
            title="Expenses"
            value={`$${stats.totalExpenses.toLocaleString()}`}
            icon={<IconDollar />}
            color="red"
          />
        )}
        {stats.totalEarnings > 0 && (
          <StatCard
            title="Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            icon={<IconTrend />}
            color="green"
          />
        )}
        {stats.totalLeads > 0 && (
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<IconUsers />}
            color="purple"
          />
        )}
        {stats.totalProjects > 0 && (
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<IconBriefcase />}
            color="blue"
          />
        )}
        {stats.totalUsers > 0 && (
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<IconUsers />}
            color="purple"
          />
        )}
        {stats.totalAdmins > 0 && (
          <StatCard
            title="Admins"
            value={stats.totalAdmins}
            icon={<IconUsers />}
            color="green"
          />
        )}
        {stats.totalSuperAdmins > 0 && (
          <StatCard
            title="Super Admins"
            value={stats.totalSuperAdmins}
            icon={<IconUsers />}
            color="red"
          />
        )}
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.totalLeads > 0 && (
          <LeadsCard leadsBreakdown={stats.leadsBreakdown} totalLeads={stats.totalLeads} />
        )}
        {stats.totalProjects > 0 && (
          <ProjectsCard projectsBreakdown={stats.projectsBreakdown} totalProjects={stats.totalProjects} />
        )}
      </div>
    </div>
  );
}