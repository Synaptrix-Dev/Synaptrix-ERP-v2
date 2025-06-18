
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/data";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Quill from "quill";
import LoaderDesign from "../../../components/Loader";
import "quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

// Loader Component (simplified for demo)
const Loader = () => (
    <LoaderDesign />
);

// Status color utility
const getStatusColor = (status) => {
    switch (status) {
        case "Completed":
            return "bg-green-500";
        case "In Progress":
            return "bg-blue-500";
        case "On Hold":
            return "bg-yellow-500";
        case "Canceled":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};


// Project Detail View Component
const ProjectDetailView = ({ project, contributorImages, getStatusColor, sanitizedDescription, setIsEditing }) => {
    return (
        <div className="p-4">
            <header className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">Project Details</h1>
                    <div className="flex items-center space-x-4">
                        <span className={`${getStatusColor(project.status)} w-3 h-3 rounded-full`}></span>
                        <span className="font-medium text-gray-700">{project.status}</span>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Project Overview
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">PROJECT NAME</p>
                                    <p className="text-gray-800 font-semibold">{project.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">CATEGORY</p>
                                    <p className="text-gray-800 font-semibold">{project.category}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">DEADLINE</p>
                                    <p className="text-gray-800 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">CREATED ON</p>
                                    <p className="text-gray-800 font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">BUDGET</p>
                                    <p className="text-gray-800 font-semibold">Not Authorized</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Client Information
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xl mr-4">
                                {project.client.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">{project.client}</h3>
                                <p className="text-sm text-gray-500">Primary Contact</p>
                            </div>
                        </div>
                        <div className="space-y-3 mt-4">
                            <div className="flex items-center px-4 py-2 bg-amber-50 rounded-lg">
                                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-gray-800 text-sm">Not Authorized</span>
                            </div>
                            <div className="flex items-center px-4 py-2 bg-amber-50 rounded-lg">
                                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <span className="text-gray-800 text-sm">Not Authorized</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300">
                    <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                            </svg>
                            Technologies Used
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, index) => (
                                <span
                                    key={index}
                                    className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center"
                                >
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            Team Contributors
                        </h2>
                    </div>
                    <div className="p-6">
                        {project.accesibles.length > 0 ? (
                            <div className="flex items-center">
                                {project.accesibles.map((contributorId, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                        style={{
                                            marginLeft: index > 0 ? "-12px" : "0",
                                            zIndex: project.accesibles.length - index,
                                        }}
                                    >
                                        {contributorImages[contributorId] ? (
                                            <img
                                                src={contributorImages[contributorId]}
                                                alt={`Contributor ${contributorId}`}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-medium text-sm border-2 border-white shadow-sm">
                                                SS
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-24 text-gray-500">
                                <svg className="w-6 h-6 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                <p>No contributors assigned</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Project Description
                    </h2>
                </div>
                <div className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div
                            className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main ProjectDetails Component
const ProjectDetails = () => {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [contributorImages, setContributorImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        deadline: "",
        budget: "",
        client: "",
        clientEmail: "",
        clientPhone: "",
        tech: "",
        status: "",
    });

    const fetchContributorImages = async (ids) => {
        try {
            if (!ids || ids.length === 0) return;
            const response = await fetch(
                `${authURL}/root/auth/get-image?ids=${ids.join(",")}`,
                {
                    method: "GET",
                    headers: {
                        "x-api-key": apiKey,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch contributor images");
            const data = await response.json();
            setContributorImages((prev) => ({
                ...prev,
                ...data.reduce(
                    (acc, admin) => ({ ...acc, [admin._id]: admin.image }),
                    {}
                ),
            }));
        } catch (error) {
            console.error("Error fetching contributor images:", error);
            toast.error("Failed to load contributor images");
        }
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${authURL}/root/projects/get-accessible-project-by-id?id=${id}`,
                    {
                        headers: { "x-api-key": apiKey },
                    }
                );
                const result = await response.json();
                if (result.success) {
                    setProject(result.data);
                    setFormData({
                        name: result.data.name,
                        description: result.data.description,
                        category: result.data.category,
                        deadline: new Date(result.data.deadline).toISOString().split("T")[0],
                        budget: result.data.budget,
                        client: result.data.client,
                        clientEmail: result.data.clientEmail,
                        clientPhone: result.data.clientPhone,
                        tech: result.data.tech.join(", "),
                        status: result.data.status,
                    });
                    fetchContributorImages(result.data.accesibles);
                } else {
                    throw new Error("Failed to fetch project data");
                }
            } catch (err) {
                setError(err.message);
                toast.error("Error fetching project details");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, authURL, apiKey]);

    const handleSubmit = async (e, projectId) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...formData,
                tech: formData.tech
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter((tech) => tech),
                budget: parseFloat(formData.budget),
                deadline: new Date(formData.deadline).toISOString(),
            };
            const response = await fetch(
                `${authURL}/root/projects/update-project?id=${projectId}`,
                {
                    method: "PATCH",
                    headers: {
                        "x-api-key": apiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                }
            );
            const result = await response.json();
            if (result.success) {
                setProject(result.data);
                setIsEditing(false);
                toast.success("Project updated successfully");
            } else {
                throw new Error(result.error || "Failed to update project");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const decodeHtml = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    const sanitizedDescription = DOMPurify.sanitize(decodeHtml(project?.description || ""), {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "strong", "em", "a", "blockquote", "code", "pre", "br", "div", "span"],
        ALLOWED_ATTR: ["href", "class", "style", "target", "rel"],
    });

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
    if (!project) return <div className="text-gray-500 text-center mt-8">No project data found</div>;

    return (
        <>
            <Toaster />
            <ProjectDetailView
                project={project}
                contributorImages={contributorImages}
                getStatusColor={getStatusColor}
                sanitizedDescription={sanitizedDescription}
                setIsEditing={setIsEditing}
            />
        </>
    );
};

export default ProjectDetails;