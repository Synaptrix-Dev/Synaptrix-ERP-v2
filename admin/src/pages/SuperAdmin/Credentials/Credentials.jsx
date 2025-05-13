import React, { useState, useEffect } from 'react';
import CredentialsModal from './CredentialsModal';
import PasswordGenerator from './PasswordGenerator';
import { useAuth } from "../../../context/data";
import CryptoJS from 'crypto-js';
import Loader from '../../../components/Loader'

function Credentials() {
    const { authURL } = useAuth();
    const apiKey = import.meta.env.VITE_APIKEY;
    const [credentials, setCredentials] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [credentialsModal, setCredentialsModal] = useState(false);
    const [genPassModal, setGenPass] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [selectedCredential, setSelectedCredential] = useState(null);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const id = user.user.id;

    const openCredentialModal = () => setCredentialsModal(true);
    const closeCredentialModal = () => setCredentialsModal(false);
    const openGenPass = () => setGenPass(true);
    const closeGenPass = () => setGenPass(false);
    
    const openShareModal = (credential) => {
        setSelectedCredential(credential);
        setShareModal(true);
    };
    const closeShareModal = () => {
        setShareModal(false);
        setSelectedCredential(null);
    };

    const fetchCredentials = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${authURL}/root/credentials/get-creds`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": apiKey,
                }
            });

            if (!response.ok) throw new Error('Failed to fetch credentials');
            const data = await response.json();
            setCredentials(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching credentials:", error);
        }
    };

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${authURL}/root/auth/get-admins`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": apiKey,
                }
            });

            if (!response.ok) throw new Error('Failed to fetch admins');
            const data = await response.json();
            setAdmins(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    useEffect(() => {
        fetchCredentials();
        fetchAdmins();
    }, []);

    const togglePasswordVisibility = (id, encryptedPassword) => {
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

            setVisiblePasswords(prev => ({ ...prev, [id]: decrypted }));
        } catch (err) {
            alert("Invalid encryption key. Cannot show password.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this credential?")) return;

        try {
            const response = await fetch(`${authURL}/root/credentials/delete-creds?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
            });

            if (!response.ok) throw new Error("Failed to delete credential");

            setCredentials(prev => prev.filter(cred => cred._id !== id));
        } catch (error) {
            console.error("Error deleting credential:", error);
            alert("Failed to delete credential. Please try again.");
        }
    };

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

    const ShareModal = ({ isVisible, onClose, credential }) => {
        if (!isVisible || !credential) return null;

        const shareText = `
            Credential Details:
            Account Name: ${credential.accName}
            Type: ${credential.type}
            Username: ${credential.username || 'N/A'}
            Email: ${credential.emailAddress || 'N/A'}
            Phone: ${credential.phone || 'N/A'}
            Status: ${credential.status || 'N/A'}
            Authentication: ${credential.authentication || 'N/A'}
            Notes: ${credential.note || 'N/A'}
        `.trim();

        const handleToggleAccess = async (adminId) => {
            try {
                const response = await fetch(
                    `${authURL}/root/credentials/update-creds?id=${credential._id}&ids=${adminId}`,
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
                setCredentials(prev =>
                    prev.map(cred =>
                        cred._id === credential._id
                            ? { ...cred, accesibles: data.updatedCredential.accesibles }
                            : cred
                    )
                );

                const action = data.results[0].message.includes('granted') ? 'granted to' : 'revoked from';
                alert(`Access ${action} admin`);
                closeShareModal()
            } catch (error) {
                console.error("Error updating access:", error);
                alert("Failed to update access. Please try again.");
            }
        };

        return (
            <div className="fixed inset-0 z-[99] bg-opacity-75 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-6 py-8 w-full max-w-md flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Share Credential</h1>
                            <h1 className="text-xs text-gray-600">
                                Select admins to share this credential with...
                            </h1>
                        </div>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                            <i className="fa-solid fa-xmark fa-lg"></i>
                        </button>
                    </div>

                    <div className='flex items-center justify-between mb-4'>
                        <input type="text" className="w-full bg-white rounded-lg border text-sm border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Search Administrator' />
                    </div>

                    <div className="space-y-4">
                        {admins.length > 0 ? (
                            admins.map(admin => (
                                <div key={admin.email} className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={credential.accesibles?.includes(admin._id) || false}
                                                onChange={() => handleToggleAccess(admin._id)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                                        </label>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{admin.fullName}</p>
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

    if (loading) return <Loader />;

    return (
        <div className="p-4">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Credentials Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage Synaptrix Solution accounts & their respective details.</p>
                </div>
                <div className='flex space-x-2'>
                    <button
                        onClick={openCredentialModal}
                        className="btnBg cursor-pointer text-white text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                        <i className="fa-sharp-duotone fa-light fa-lock"></i>
                        <span>Secure a Account</span>
                    </button>
                    <button
                        onClick={openGenPass}
                        className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                        <i className="fa-sharp-duotone fa-regular fa-key"></i>
                        <span>Password Generator</span>
                    </button>
                    <button
                        onClick={fetchCredentials}
                        className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                        <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {credentials.map(credential => (
                    <div
                        key={credential._id}
                        className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col h-full"
                    >
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <i className="fa-duotone fa-regular fa-lock-keyhole"></i>
                                    <h2 className="text-md font-medium truncate capitalize">{credential.accName}</h2>
                                </div>
                                <span className="bg-green-200 bg-opacity-90 capitalize text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {credential.type}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1">
                            <div className="space-y-4">
                                {credential.username && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-xs border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Username:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.username}</span>
                                    </div>
                                )}
                                {credential.phone && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-xs border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Phone:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.phone}</span>
                                    </div>
                                )}
                                {credential.emailAddress && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-xs border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Email:</span>
                                        <span className="text-gray-800 font-semibold text-right truncate">{credential.emailAddress}</span>
                                    </div>
                                )}
                                {credential.status && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-xs border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Status:</span>
                                        <span
                                            className={`font-semibold truncate text-right ${credential.status === 'active'
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
                                    <div className="grid grid-cols-[100px_1fr] items-center text-xs border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Auth Type:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.authentication}</span>
                                    </div>
                                )}
                                {credential.note && (
                                    <div className="grid grid-cols-[100px_1fr] items-center text-xs border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Notes:</span>
                                        <span className="text-gray-800 font-semibold text-right">{credential.note}</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-[100px_1fr] items-center text-xs pb-2">
                                    <span className="text-gray-500 font-medium">Password:</span>
                                    <div className="flex items-center">
                                        <span className="text-gray-800 font-medium font-mono bg-gray-50 py-1 px-2 rounded mr-2">
                                            {visiblePasswords[credential._id] ? visiblePasswords[credential._id] : '••••••••••••'}
                                        </span>
                                        <button
                                            onClick={() => togglePasswordVisibility(credential._id, credential.password)}
                                            className="text-xs bg-blue-50 cursor-pointer hover:bg-blue-100 text-blue-600 px-2 py-1 rounded transition-colors duration-200 flex items-center"
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

                        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end space-x-2 mb-auto">
                            <button
                                onClick={() => handleDelete(credential._id)}
                                className="flex justify-center cursor-pointer items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                            <button
                                onClick={() => copyPassword(credential._id)}
                                className="flex justify-center items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <i className="fa-light fa-copy"></i>
                            </button>
                            <button
                                onClick={() => openShareModal(credential)}
                                className="bg-white cursor-pointer text-slate-800 border border-slate-200 text-xs font-lg not-only:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200">
                                <i className="fa-light fa-share-from-square"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {credentials.length === 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No Secured Accounts found</h3>
                    <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            )}

            <CredentialsModal isVisible={credentialsModal} onClose={closeCredentialModal} />
            <PasswordGenerator isVisible={genPassModal} onClose={closeGenPass} />
            <ShareModal isVisible={shareModal} onClose={closeShareModal} credential={selectedCredential} />
        </div>
    );
}

export default Credentials