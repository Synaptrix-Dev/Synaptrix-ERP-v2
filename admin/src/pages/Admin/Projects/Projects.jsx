import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../context/data";
import Loader from '../../../components/Loader'
import toast from "react-hot-toast";
import { Link } from 'react-router-dom'

function Projects() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const [projects, setProjects] = useState([]);
    const [contributorImages, setContributorImages] = useState({});
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const userID = user?.user?.id;

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${authURL}/root/projects/get-accessible-projects?id=${userID}`, {
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
            setProjects(data.data || []);
        } catch (error) {
            toast.error('Error fetching projects: ' + error.message);
            console.error(error);
        } finally {
            setLoading(false);
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
        }
    };

    useEffect(() => {
        fetchProjects();
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
        }
    }, [projects]);

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
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Project Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage Synaptrix Solution Projects & their respective details.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={fetchProjects}
                        disabled={loading}
                        className={`bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No projects found.</p>
                        </div>
                    ) : (
                        projects.map(project => (
                            <div
                                key={project._id}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-6 w-full transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="btnBg text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide">
                                        {project.status || 'Active'}
                                    </span>
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
                                                    <div className="bg-blue-50 flex items-center justify-center h-full w-full">
                                                        {getContributorInitials(id)}
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
            )}
        </div>
    );
}

export default Projects;