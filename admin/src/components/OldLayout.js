import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Adjust path as needed

function Layout() {
    const stored = JSON.parse(localStorage.getItem("user"));
    const username = stored?.user?.email;
    const fullName = stored?.user?.fullName;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const initials = fullName
        ?.split(" ")
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();


    return (
        <div className="mx-4 flex items-start justify-between h-screen space-x-4 mt-4">
            <div className='flex flex-col items-start justify-between space-x-4 mt-4'>
                <div className="flex flex-col items-center justify-center space-y-2">
                    {/* Logo */}
                    <div className="bg-slate-800 rounded-full h-12 w-12 flex items-center justify-center">
                        <img src={logo} alt="Logo" className="w-8" />
                    </div>

                    {/* Text Navigation Tab */}
                    <div className="flex flex-col space-y-2 px-2 py-2 bg-slate-900 rounded-full">
                        {/* Home Tab */}
                        <NavLink
                            to="/root-erp"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-house"></i>
                        </NavLink>
                        <NavLink
                            to="credentials"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-900 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-lock-open"></i>
                        </NavLink>
                        <NavLink
                            to="/headphones"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-headphones-simple"></i>
                        </NavLink>
                        <NavLink
                            to="/code"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-code"></i>
                        </NavLink>
                        <NavLink
                            to="/coins"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-coins"></i>
                        </NavLink>
                        <NavLink
                            to="/sack-dollar"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-sack-dollar"></i>
                        </NavLink>
                        <NavLink
                            to="/receipt"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-receipt"></i>
                        </NavLink>
                        <NavLink
                            to="/globe"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-globe"></i>
                        </NavLink>
                        <NavLink
                            to="/users"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-users"></i>
                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-full ${isActive ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'}`
                            }
                        >
                            <i className="fa-regular fa-gear"></i>
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className='w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-300'>
                            <i className="fa-regular fa-power-off"></i>
                        </button>

                    </div>
                </div>
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 w-full'>

                <div className='h-12 w-full mt-4 bg-slate-800 rounded-full flex items-center space-x-2'>
                    <div className="w-24 h-10 flex items-center justify-center rounded-full bg-white">
                        <span className="text-black text-sm font-medium">Home</span>
                    </div>
                    <div className="w-24 h-10 flex items-center justify-center rounded-full bg-white">
                        <span className="text-black text-sm font-medium">Users</span>
                    </div>
                    <div className="w-24 h-10 flex items-center justify-center rounded-full bg-white">
                        <span className="text-black text-sm font-medium">Profile</span>
                    </div>
                </div>

                <div className='w-full mt-2 bg-white rounded-xl p-4'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
}

export default Layout;