import React, { useState, useEffect } from 'react';
import CredentialsModal from './CredentialsModal';
import PasswordGenerator from './PasswordGenerator';
import { useAuth } from "../../../context/data";
import CryptoJS from 'crypto-js';

function Credentials() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const [credentials, setCredentials] = useState([]);
    const [credentialsModal, setCredentialsModal] = useState(false);
    const [genPassModal, setGenPass] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user.user.id;


    const openCredentialModal = () => setCredentialsModal(true);
    const closeCredentialModal = () => setCredentialsModal(false);
    const openGenPass = () => setGenPass(true);
    const closeGenPass = () => setGenPass(false);

    const fetchCredentials = async () => {
        try {
            const response = await fetch(`${authURL}/root/credentials/get-accessed-creds?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": apiKey,
                }
            });

            if (!response.ok) throw new Error('Failed to fetch credentials');
            const data = await response.json();
            setCredentials(data.credentials);
        } catch (error) {
            console.error("Error fetching credentials:", error);
        }
    };

    useEffect(() => {
        fetchCredentials();
    }, [fetchCredentials]);

    const togglePasswordVisibility = (id, encryptedPassword) => {
        // If already visible, hide it
        if (visiblePasswords[id]) {
            setVisiblePasswords(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            return;
        }

        const userKey = prompt("Enter your encryption key:");
        if (!userKey) return;

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedPassword, userKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) throw new Error("Invalid key");

            // Set only this credential's password visible
            setVisiblePasswords(prev => ({ ...prev, [id]: decrypted }));
        } catch (err) {
            alert("Invalid encryption key. Cannot show password.");
        }
    };

    // const handleDelete = async (id) => {
    //     if (!window.confirm("Are you sure you want to delete this credential?")) return;

    //     try {
    //         const response = await fetch(`${authURL}/functionalities/delete-password?id=${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'x-api-key': apiKey,
    //             },
    //         });

    //         if (!response.ok) throw new Error("Failed to delete credential");

    //         setCredentials(prev => prev.filter(cred => cred._id !== id));
    //     } catch (error) {
    //         console.error("Error deleting credential:", error);
    //         alert("Failed to delete credential. Please try again.");
    //     }
    // };

    const copyPassword = (id) => {
        const password = visiblePasswords[id];
        if (!password) {
            alert("Please reveal the password first.");
            return;
        }

        navigator.clipboard.writeText(password)
            .then(() => alert("Password copied to clipboard"))
            .catch(() => alert("Failed to copy password"));
    };


    return (
        <div className="p-4 min-h-screen">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Credentials Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage Synaptrix Solution accounts & their respective details.</p>
                </div>
                <div className='flex space-x-2'>
                    {/* <button
                        onClick={openCredentialModal}
                        className="btnBg cursor-pointer text-white text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                        <i class="fa-sharp-duotone fa-regular fa-lock-keyhole"></i>
                        <span>Secure a Account</span>
                    </button> */}
                    <button
                        onClick={openGenPass}
                        className="btnBg cursor-pointer text-slate-100 border border-slate-200 text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                        <i class="fa-sharp-duotone fa-regular fa-key"></i>
                        <span>Password Generator</span>
                    </button>
                    <button
                        onClick={fetchCredentials}
                        className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                        <i class="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Credentials grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {credentials.map(credential => (
                    <div
                        key={credential._id}
                        className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col h-full"
                    >
                        {/* Card Header with Gradient Background */}
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <i class="fa-duotone fa-regular fa-lock-keyhole"></i>
                                    <h2 className="text-md font-medium truncate max-w-[80%] capitalize">{credential.accName}</h2>
                                </div>
                                <span className="bg-white bg-opacity-90 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {credential.type}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1">
                            <div className="space-y-4">
                                {credential.username && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Username:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.username}</span>
                                    </div>
                                )}
                                {credential.phone && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Phone:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.phone}</span>
                                    </div>
                                )}

                                {credential.emailAddress && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Email:</span>
                                        <span className="text-gray-800 font-semibold text-right truncate">{credential.emailAddress}</span>
                                    </div>
                                )}

                                {credential.status && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Status:</span>
                                        <span
                                            className={`font-semibold truncate  text-right ${credential.status === 'active'
                                                ? 'text-green-600'
                                                : credential.status === 'inactive'
                                                    ? 'text-yellow-500'
                                                    : credential.status === 'deleted'
                                                        ? 'text-red-500'
                                                        : 'text-gray-800'
                                                }`}
                                        >
                                            {credential.status}
                                        </span>
                                    </div>
                                )}

                                {credential.authentication && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Auth Type:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.authentication}</span>
                                    </div>
                                )}

                                {credential.note && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-sm border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Notes:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.note}</span>
                                    </div>
                                )}

                                {/* Password with special styling */}
                                <div className="grid grid-cols-[100px_1fr] items-center text-sm pb-2">
                                    <span className="text-gray-500 font-medium">Password:</span>
                                    <div className="flex items-center">
                                        <span className="text-gray-800 font-medium font-mono bg-gray-50 py-1 px-2 rounded mr-2">
                                            {visiblePasswords[credential._id] ? visiblePasswords[credential._id] : '••••••••••••'}
                                        </span>
                                        <button
                                            onClick={() => togglePasswordVisibility(credential._id, credential.password)}
                                            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded transition-colors duration-200 flex items-center"
                                        >
                                            {visiblePasswords[credential._id] ? (
                                                <>
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                                    </svg>
                                                    Hide
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                    Show
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end space-x-2 mb-auto">
                            {/* <button
                                onClick={() => handleDelete(credential._id)}
                                className="flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button> */}
                            <button
                                onClick={() => copyPassword(credential._id)}
                                className="flex justify-center items-center space-x-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <i class="fa-light fa-copy"></i>
                                <span className='text-sm'>Copy Password</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {credentials.length === 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No Secured Accounts found</h3>
                    <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            )}

            <CredentialsModal isVisible={credentialsModal} onClose={closeCredentialModal} />
            <PasswordGenerator isVisible={genPassModal} onClose={closeGenPass} />
        </div>
    );
}

export default Credentials;
