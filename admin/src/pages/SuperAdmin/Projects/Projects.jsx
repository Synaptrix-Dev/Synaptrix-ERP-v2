import React, { useState, useEffect } from 'react';
import AddProjects from './ProjectModal';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';
import Loader from '../../../components/Loader';

function Projects() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const [projects, setProjects] = useState([]);
    const [projectsModal, setProjectModal] = useState(false);
    const [contributorImages, setContributorImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [shareModal, setShareModal] = useState({ isOpen: false, projectId: null });
    const [admins, setAdmins] = useState([]);

    const openProjectModal = () => setProjectModal(true);
    const closeProjectModal = () => setProjectModal(false);
    const openShareModal = (projectId) => setShareModal({ isOpen: true, projectId });
    const closeShareModal = () => setShareModal({ isOpen: false, projectId: null });

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${authURL}/root/projects/get-all-projects`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data || []);
        } catch (error) {
            toast.error('Error fetching projects: ' + error.message);
            console.error(error);
        }
    };

    const fetchContributorImages = async (ids) => {
        try {
            if (!ids || ids.length === 0) return;

            const response = await fetch(`${authURL}/root/auth/get-image?ids=${ids.join(',')}`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch contributor images');
            }

            const data = await response.json();
            setContributorImages(prev => ({
                ...prev,
                ...data.reduce((acc, admin) => ({
                    ...acc,
                    [admin._id]: admin.image
                }), {})
            }));
        } catch (error) {
            console.error('Error fetching contributor images:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
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
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchProjects(), fetchAdmins()]);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const allAccessibleIds = projects.reduce((acc, project) => {
            if (project.accesibles && Array.isArray(project.accesibles)) {
                return [...acc, ...project.accesibles];
            }
            return acc;
        }, []);

        const uniqueIds = [...new Set(allAccessibleIds)];
        if (uniqueIds.length > 0) {
            fetchContributorImages(uniqueIds);
        } else {
            setLoading(false);
        }
    }, [projects]);

    const ShareProjectModal = ({ isVisible, onClose, projectId }) => {
        if (!isVisible || !projectId) return null;

        const project = projects.find(p => p._id === projectId);

        const handleToggleAccess = async (adminId) => {
            try {
                const isCurrentlyAccessible = project.accesibles?.includes(adminId);
                const response = await fetch(
                    `${authURL}/root/projects/update-project-access?id=${projectId}&adminId=${adminId}&action=${isCurrentlyAccessible ? 'remove' : 'add'}`,
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
                setProjects((prev) =>
                    prev.map((p) =>
                        p._id === projectId
                            ? { ...p, accesibles: data.updatedProject.accesibles }
                            : p
                    )
                );

                const action = isCurrentlyAccessible ? 'revoked from' : 'granted to';
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
                            <h1 className="text-xl font-semibold text-gray-900">Add a Contributor</h1>
                            <h1 className="text-xs text-gray-600">
                                Select admins to share this project with...
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
                                                checked={project.accesibles?.includes(admin._id) || false}
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

    // Calculate progress based on milestones
    const calculateProgress = (milestones) => {
        if (!milestones || milestones.length === 0) return 0;
        const completed = milestones.filter(m => m.status === 'Completed').length;
        return Math.round((completed / milestones.length) * 100);
    };

    // Get contributors initials
    const getContributorInitials = (name) => {
        if (!name) return '??';
        const names = name.split(' ');
        return names.length > 1
            ? `${names[0][0]}${names[1][0]}`
            : names[0].slice(0, 2).toUpperCase();
    };

    return (
        <div className='p-4'>
            {loading ? (
                <div className="flex justify-center items-center max-h-[60vh]">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Project Manager</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage Synaptrix Solution Projects & their respective details.
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={openProjectModal}
                                className="btnBg cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
                            >
                                <i className="fa-regular fa-code"></i>
                                <span>Add new Project</span>
                            </button>
                            <button
                                onClick={fetchProjects}
                                className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors duration-200"
                            >
                                <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {projects.length === 0 ? (
                            <div className="text-center flex items-center justify-center col-span-3">No projects found.</div>
                        ) : (
                            projects.map(project => (
                                <div
                                    key={project._id}
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-6 w-full transition-all duration-300"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span
                                            className={`text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide ${project.status === 'On Hold' ? 'bg-yellow-500' :
                                                    project.status === 'Completed' ? 'bg-green-600' :
                                                        project.status === 'In Progress' ? 'btnBg' :
                                                            project.status === 'Cancelled' ? 'bg-red-500' :
                                                                'bg-gray-500' // Default for Active or unknown
                                                }`}
                                        >
                                            {project.status || 'Active'}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openShareModal(project._id)}
                                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                                title="Share Project"
                                            >
                                                <i className="fa-regular fa-share-nodes"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {project.name || 'Unnamed Project'}
                                    </h1>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-500 underline">Client:</h2>
                                            <p className="text-sm font-semibold text-gray-700">
                                                {project.client || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-500 underline">Category:</h2>
                                            <p className="text-sm font-semibold text-gray-700">
                                                {project.category || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-500 underline">Deadline:</h2>
                                            <p className="text-sm font-semibold text-gray-700">
                                                {project.deadline || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-500 underline">Budget:</h2>
                                            <p className="text-sm font-semibold text-gray-700">
                                                {project.budget ? `$${project.budget}` : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* <div className="mb-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full"
                                                style={{ width: `${calculateProgress(project.milestones)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {calculateProgress(project.milestones)}% Complete
                                        </p>
                                    </div> */}

                                    <h2 className="text-sm font-medium text-gray-500 underline mb-2">Contributors:</h2>
                                    <div className="flex items-center -space-x-4 mb-4">
                                        {project.accesibles && project.accesibles.length > 0 ? (
                                            project.accesibles.slice(0, 4).map((id, index) => (
                                                <div
                                                    key={index}
                                                    className={`h-12 w-12 rounded-full flex items-center justify-center font-bold border border-slate-200 object-cover z-[${10 * (index + 1)}] hover:scale-110 transition-transform duration-200`}
                                                >
                                                    {contributorImages[id] ? (
                                                        <img
                                                            src={contributorImages[id]}
                                                            alt="Contributor"
                                                            className="h-full w-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold bg-slate-50 border border-slate-200 object-cover z-[${10 * (index + 1)}] hover:scale-110 transition-transform duration-200`}>
                                                            SS
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-xs">No contributors for now</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-500">
                                            Created On: {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link
                                            to={`/root-erp/projects/${project._id}`}
                                            className="btnBg text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <AddProjects
                        isVisible={projectsModal}
                        onClose={closeProjectModal}
                    />

                    <ShareProjectModal
                        isVisible={shareModal.isOpen}
                        onClose={closeShareModal}
                        projectId={shareModal.projectId}
                    />
                </>
            )}
        </div>
    );
}

export default Projects;