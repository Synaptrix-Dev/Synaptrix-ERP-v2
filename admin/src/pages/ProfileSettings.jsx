import React, { useEffect, useState } from 'react';
import cover from '../assets/cover.png';
import profile from '../assets/pp.png';
import { useAuth } from "../context/data";
import toast from "react-hot-toast";
import Loader from '../components/Loader';

function ProfileSettings() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const data = JSON.parse(localStorage.getItem('user'));
    const id = data.user.id;
    const [adminData, setAdminData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        image: '',
        designation: '',
        workType: '',
        url: '',
        password: '',
        bankDetails: [{ accName: '', branch: '', accNum: '', iban: '' }],
        personalDetails: [{ github: '', email: '', phone: '', dob: '', address: '' }]
    });

    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const response = await fetch(`${authURL}/root/auth/get-admin-info?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log("Admin Info Response:", data);
                setAdminData(data);
                setFormData({
                    fullName: data.fullName || '',
                    image: data.image || '',
                    email: data.email || '',
                    password: '',
                    designation: data.designation || '',
                    workType: data.workType || '',
                    url: data.url || '',
                    bankDetails: data.bankDetails && data.bankDetails.length > 0
                        ? data.bankDetails
                        : [{ accName: '', branch: '', accNum: '', iban: '' }],
                    personalDetails: data.personalDetails && data.personalDetails.length > 0
                        ? data.personalDetails
                        : [{ github: '', email: '', phone: '', dob: '', address: '' }]
                });
            } catch (error) {
                console.error("Error fetching admin info:", error);
            }
        };

        fetchAdminInfo();
    }, [authURL, apiKey, id]);

    const handleInputChange = (e, index, type) => {
        const { name, value } = e.target;
        if (type === 'bankDetails') {
            const field = name.split('.')[1];
            const updatedBankDetails = [...formData.bankDetails];
            updatedBankDetails[index] = {
                ...updatedBankDetails[index],
                [field]: value
            };
            setFormData({ ...formData, bankDetails: updatedBankDetails });
        } else if (type === 'personalDetails') {
            const field = name.split('.')[1];
            const updatedPersonalDetails = [...formData.personalDetails];
            updatedPersonalDetails[index] = {
                ...updatedPersonalDetails[index],
                [field]: value
            };
            setFormData({ ...formData, personalDetails: updatedPersonalDetails });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${authURL}/root/auth/update-admin?_id=${id}`, {
                method: 'PUT',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const updatedData = await response.json();
            if (response.ok) {
                setAdminData(updatedData);
                setIsModalOpen(false);
                toast.success('Profile updated successfully!');
            } else {
                console.error('Update failed:', updatedData);
                toast.error('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating admin info:', error);
            toast.error('Error updating profile.');
        }
    };

    if (!adminData) {
        return <div><Loader /></div>;
    }

    return (
        <div className="min-h-screen overflow-x-hidden">
            <div>
                <div className='rounded-xl bg-red-400'>
                    <img className="w-full rounded-xl object-contain" src={cover} alt="cover-image" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                        <div className="flex items-end space-x-4">
                            <img
                                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 object-cover"
                                src={adminData.image || profile}
                                alt="profile"
                            />
                        </div>
                        <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end px-6 sm:space-x-6 sm:pb-1">
                            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill=" none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-start justify-between rounded-lg border border-slate-200 bg-slate-50 my-6 p-4 mx-14">
                <div className='flex items-start justify-between w-full'>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">{adminData.fullName}</h1>
                        <p className="text-sm text-gray-500 mt-1">{adminData.email}</p>
                        {adminData.url && (
                            <a href={adminData.url} className="text-sm text-blue-600 hover:underline">{adminData.url}</a>
                        )}
                    </div>
                    <div className='flex flex-col items-end justify-end space-y-2'>
                        <div className='flex space-x-2'>
                            {adminData.isSuperAdmin && (
                                <h1 className='bg-green-200 text-xs py-1 px-3 rounded-full font-semibold'>Super Admin</h1>
                            )}
                            {adminData.isAdmin && (
                                <h1 className='bg-blue-200 text-xs py-1 px-3 rounded-full font-semibold'>Admin</h1>
                            )}
                        </div>
                        <div className='flex space-x-2'>
                            <h1 className='bg-blue-200 text-xs py-1 px-3 rounded-full font-semibold'>{adminData.workType}</h1>
                            <h1 className='bg-green-200 text-xs py-1 px-3 rounded-full font-semibold'>{adminData.designation}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-14 rounded-b-lg w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h2>
                    {adminData.bankDetails && adminData.bankDetails.length > 0 ? (
                        adminData.bankDetails.map((bank, index) => (
                            <div
                                key={index}
                                className="w-full h-[320px] bg-slate-50 text-gray-900 border border-slate-200 rounded-lg p-6 mb-4 flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                                        alt="Mastercard"
                                        className="h-16 w-auto"
                                    />
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-gray-500">Account Name</span>
                                        <p className="text-lg font-semibold truncate">{bank.accName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-gray-500">Account Number</span>
                                        <p className="text-lg font-semibold tracking-widest truncate">{bank.accNum || 'N/A'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-gray-500">Branch</span>
                                            <p className="text-sm truncate">{bank.branch || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-gray-500">IBAN</span>
                                            <p className="text-sm truncate">{bank.iban || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-[260px] bg-slate-50 text-gray-900 border border-slate-200 rounded-lg p-6 mb-4 flex items-center justify-center">
                            <p className="text-gray-500 text-center">No bank details available.</p>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
                    {adminData.personalDetails && adminData.personalDetails.length > 0 ? (
                        adminData.personalDetails.map((personal, index) => (
                            <div
                                key={index}
                                className="w-full h-full bg-slate-50 text-gray-900 border border-slate-200 rounded-lg p-6 mb-4 flex flex-col"
                            >
                                <div className="space-y-3 flex-1">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-gray-500">GitHub</span>
                                        <p className="text-lg font-semibold truncate">{personal.github || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-gray-500">Email</span>
                                        <p className="text-lg font-semibold truncate">{personal.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-gray-500">Phone</span>
                                        <p className="text-lg font-semibold truncate">{personal.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-gray-500">Date of Birth</span>
                                        <p className="text-lg font-semibold truncate">{personal.dob || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-gray-500">Address</span>
                                        <p className="text-lg font-semibold truncate">{personal.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-[260px] bg-slate-50 text-gray-900 border border-slate-200 rounded-lg p-6 mb-4 flex items-center justify-center">
                            <p className="text-gray-500 text-center">No personal details available.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[99] bg-opacity-75 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-8 py-10 w-full max-w-4xl flex h-[600px] overflow-auto flex-col">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                                <h1 className="text-sm text-gray-600">
                                    Update or edit your profile personal details
                                </h1>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={handleUpdate} className="text-blue-600 hover:text-gray-800 cursor-pointer">
                                    <i className="fa-solid fa-check fa-lg"></i>
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                                    <i className="fa-solid fa-xmark fa-lg"></i>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 py-2 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                                    <input
                                        type="text"
                                        name="url"
                                        value={formData.url}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Work Type</label>
                                    <input
                                        type="text"
                                        name="workType"
                                        value={formData.workType}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">Bank Details</h2>
                                {formData.bankDetails.map((bank, index) => (
                                    <div key={index} className="space-y-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Account Name</label>
                                            <input
                                                type="text"
                                                name={`bankDetails.accName`}
                                                value={bank.accName}
                                                onChange={(e) => handleInputChange(e, index, 'bankDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Branch</label>
                                            <input
                                                type="text"
                                                name={`bankDetails.branch`}
                                                value={bank.branch}
                                                onChange={(e) => handleInputChange(e, index, 'bankDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                            <input
                                                type="text"
                                                name={`bankDetails.accNum`}
                                                value={bank.accNum}
                                                onChange={(e) => handleInputChange(e, index, 'bankDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">IBAN</label>
                                            <input
                                                type="text"
                                                name={`bankDetails.iban`}
                                                value={bank.iban}
                                                onChange={(e) => handleInputChange(e, index, 'bankDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <h2 className="text-lg font-semibold text-gray-900 mt-6">Personal Details</h2>
                                {formData.personalDetails.map((personal, index) => (
                                    <div key={index} className="space-y-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">GitHub</label>
                                            <input
                                                type="text"
                                                name={`personalDetails.github`}
                                                value={personal.github}
                                                onChange={(e) => handleInputChange(e, index, 'personalDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                name={`personalDetails.email`}
                                                value={personal.email}
                                                onChange={(e) => handleInputChange(e, index, 'personalDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="text"
                                                name={`personalDetails.phone`}
                                                value={personal.phone}
                                                onChange={(e) => handleInputChange(e, index, 'personalDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                            <input
                                                type="text"
                                                name={`personalDetails.dob`}
                                                value={personal.dob}
                                                onChange={(e) => handleInputChange(e, index, 'personalDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                name={`personalDetails.address`}
                                                value={personal.address}
                                                onChange={(e) => handleInputChange(e, index, 'personalDetails')}
                                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileSettings;