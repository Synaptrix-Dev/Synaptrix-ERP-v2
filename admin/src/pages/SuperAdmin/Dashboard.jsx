import React from 'react';

// Sample data for stats and projects
const projectData = [
  {
    id: 1,
    name: 'Website Redesign',
    progress: 75,
    status: 'In Progress',
    deadline: '15 May 2025'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    progress: 45,
    status: 'In Progress',
    deadline: '28 May 2025'
  },
  {
    id: 3,
    name: 'Database Migration',
    progress: 90,
    status: 'Almost Done',
    deadline: '10 May 2025'
  },
  {
    id: 4,
    name: 'Security Audit',
    progress: 30,
    status: 'In Progress',
    deadline: '5 June 2025'
  },
];

const leadsStats = [
  { type: 'Social Media', count: 156, percentage: 40 },
  { type: 'Direct', count: 98, percentage: 25 },
  { type: 'Referral', count: 84, percentage: 21 },
  { type: 'Organic', count: 54, percentage: 14 },
];

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

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Stats Card Component
const StatCard = ({ title, value, icon, trend, trendValue, color }) => {
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
      {trend && (
        <div className="flex items-center">
          {trend === 'up' ? (
            <IconChevronUp />
          ) : (
            <IconChevronDown />
          )}
          <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'} ml-1`}>
            {trendValue}
          </span>
          <span className="text-sm text-slate-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-slate-800">{project.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Completed'
            ? 'bg-green-100 text-green-700'
            : project.status === 'Almost Done'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
          {project.status}
        </span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-medium text-slate-700">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center text-xs text-slate-500">
        <span className="mr-1"><IconCalendar /></span>
        <span>Deadline: {project.deadline}</span>
      </div>
    </div>
  );
};

// Leads Card Component
const LeadsCard = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-slate-800">Leads by Type</h2>
        <span className="text-sm text-blue-600">View All</span>
      </div>
      <div className="space-y-4">
        {leadsStats.map((lead, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-600">{lead.type}</span>
              <span className="text-sm font-medium">{lead.count}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${index === 0 ? 'bg-blue-600' :
                    index === 1 ? 'bg-green-600' :
                      index === 2 ? 'bg-yellow-600' :
                        'bg-purple-600'
                  }`}
                style={{ width: `${lead.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Total Leads</span>
          <span className="text-sm font-medium">392</span>
        </div>
      </div>
    </div>
  );
};

// Mini Stats Component
const MiniStat = ({ label, value, change, isPositive }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-lg font-medium">{value}</p>
      </div>
      <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
        {isPositive ? <IconChevronUp /> : <IconChevronDown />}
        <span className="ml-1">{change}%</span>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  return (
    <div className="min-h-screen p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Super Administrator</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening</p>
      </header>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Secured Passwords"
          value="256"
          icon={<IconLock />}
          trend="up"
          trendValue="12%"
          color="blue"
        />
        <StatCard
          title="Expenses"
          value="$12,500"
          icon={<IconDollar />}
          trend="down"
          trendValue="5%"
          color="red"
        />
        <StatCard
          title="Earnings"
          value="$45,200"
          icon={<IconTrend />}
          trend="up"
          trendValue="18%"
          color="green"
        />
        <StatCard
          title="Leads"
          value="392"
          icon={<IconUsers />}
          trend="up"
          trendValue="7%"
          color="purple"
        />
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MiniStat label="New Users" value="45" change="12" isPositive={true} />
        <MiniStat label="Bounce Rate" value="42%" change="3" isPositive={false} />
        <MiniStat label="Avg. Visit" value="3m 45s" change="8" isPositive={true} />
        <MiniStat label="Conversion" value="8.2%" change="1.2" isPositive={true} />
      </div>

      {/* Projects and Leads Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-slate-800">Active Projects</h2>
              <span className="text-sm text-blue-600">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((project) => (
                    <tr key={project.id} className="border-b border-slate-200">
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{project.name}</td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm">
                        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'Almost Done'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-slate-500">{project.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Stats */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600 mr-4">
                  <IconBriefcase />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-800">Projects Overview</p>
                  <p className="text-sm text-slate-500">Current month</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-medium">24</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="text-xl font-medium">16</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-500">In Progress</p>
                  <p className="text-xl font-medium">8</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-500">On Hold</p>
                  <p className="text-xl font-medium">0</p>
                </div>
              </div>
            </div>

            {/* Financial Stats */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-50 rounded-full text-green-600 mr-4">
                  <IconDollar />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-800">Financial Summary</p>
                  <p className="text-sm text-slate-500">This quarter</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-lg font-medium text-slate-800">$146,350</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">Expenses</p>
                  <p className="text-lg font-medium text-slate-800">$38,500</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-600">Net Profit</p>
                  <p className="text-lg font-bold text-green-600">$107,850</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Section */}
        <div className="space-y-6">
          <LeadsCard />

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4">Project Cards</h2>
            <div className="space-y-4">
              {projectData.slice(0, 2).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}