import React, { useState, useEffect } from 'react';
import AddProjects from './ProjectModal';
import { useAuth } from "../../../context/data";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom'

function Projects() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user?.user?.id;


    const [projectsModal, setProjectModal] = useState(false);
    const openProjectModal = () => setProjectModal(true);
    const closeProjectModal = () => setProjectModal(false);

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
                        onClick={openProjectModal}
                        className="btnBg cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
                    >
                        <i className="fa-regular fa-code"></i>
                        <span>Add new Project</span>
                    </button>
                    <button
                        className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors duration-200"
                    >
                        <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <div>
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-6 w-full max-w-lg transition-all duration-300">
                    <div class="flex justify-between items-center mb-4">
                        <span class="btnBg text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide">Active</span>
                        <span class="text-xs font-medium text-gray-500">Priority: <span class="text-red-600 font-semibold">High</span></span>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Project Name</h1>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <h2 class="text-sm font-medium text-gray-500 underline">Client:</h2>
                            <p class="text-sm font-semibold text-gray-700">Athar Raza Saeedi</p>
                        </div>
                        <div>
                            <h2 class="text-sm font-medium text-gray-500 underline">Category:</h2>
                            <p class="text-sm font-semibold text-gray-700">Web Development</p>
                        </div>
                        <div>
                            <h2 class="text-sm font-medium text-gray-500 underline">Deadline:</h2>
                            <p class="text-sm font-semibold text-gray-700">12 January, 2025</p>
                        </div>
                        <div>
                            <h2 class="text-sm font-medium text-gray-500 underline">Budget:</h2>
                            <p class="text-sm font-semibold text-gray-700">$12,500</p>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h2 class="text-sm font-medium text-gray-500 underline mb-2">Progress:</h2>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full w-[65%]"></div>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">65% Complete</p>
                    </div>

                    <h2 class="text-sm font-medium text-gray-500 underline mb-2">Contributors:</h2>
                    <div class="flex items-center -space-x-4 mb-4">
                        <div class="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center font-bold border border-slate-200 object-cover z-10 hover:scale-110 transition-transform duration-200">AR</div>
                        <div class="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center font-bold border border-slate-200 object-cover z-20 hover:scale-110 transition-transform duration-200">AK</div>
                        <div class="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center font-bold border border-slate-200 object-cover z-30 hover:scale-110 transition-transform duration-200">NA</div>
                        <div class="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center font-bold border border-slate-200 object-cover z-40 hover:scale-110 transition-transform duration-200">KW</div>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-xs font-medium text-gray-500">Created On: 13 May, 2025</span>
                        <Link to='/root-erp/projects/asds' class="btnBg text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">View Details</Link>
                    </div>
                </div>
            </div>

            <AddProjects
                isVisible={projectsModal}
                onClose={closeProjectModal}
            />
        </div>
    )
}

export default Projects
