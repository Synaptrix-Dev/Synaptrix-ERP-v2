import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import LOGO_LIGHT from "../../assets/logo.png";

function Layout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const stored = JSON.parse(localStorage.getItem("user"));
  const email = stored?.user?.email;
  const fullName = stored?.user?.fullName;

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSidebarOpen(window.innerWidth >= 768);
      }, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = fullName
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-hidden max-w-full">
      <div className="flex gap-2 h-[calc(100vh-2rem)] max-w-full">
        <div
          className={`bg-slate-900 border flex flex-col rounded-xl transition-all duration-300 ${isSidebarOpen ? "min-w-64" : "w-0 overflow-hidden"
            } fixed md:relative z-20 h-full`}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex flex-col items-start justify-start">
              <img src={LOGO_LIGHT} alt="Logo" className="w-12" />
            </div>
            <button
              className="text-white md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              <NavLink
                to="overview"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-regular fa-home"></i>
                <span className="text-sm font-semibold">Dashboard</span>
              </NavLink>
              <NavLink
                to="credentials"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-regular fa-lock"></i>
                <span className="text-sm font-semibold">Credentials</span>
              </NavLink>
              <NavLink
                to="leads"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-light fa-user-headset"></i>
                <span className="text-sm font-semibold">Leads Generated</span>
              </NavLink>
              <NavLink
                to="projects"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-regular fa-code"></i>
                <span className="text-sm font-semibold">Projects</span>
              </NavLink>
              <NavLink
                to="earnings"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-light fa-coins"></i>
                <span className="text-sm font-semibold">Earnings</span>
              </NavLink>
              <NavLink
                to="expense"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-light fa-sack-dollar"></i>
                <span className="text-sm font-semibold">Expenses</span>
              </NavLink>
              <NavLink
                to="invoices"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-light fa-receipt"></i>
                <span className="text-sm font-semibold">Invoices & Quotes</span>
              </NavLink>
              <NavLink
                to="products"
                className={({ isActive }) =>
                  `w-full h-10 flex items-center justify-start px-4 space-x-2 rounded ${isActive
                    ? "bg-slate-100 border border-slate-200 text-slate-900"
                    : "border border-slate-800 text-white"
                  }`
                }
              >
                <i className="fa-light fa-database"></i>
                <span className="text-sm font-semibold">Products</span>
              </NavLink>
            </ul>
          </nav>
        </div>

        {isSidebarOpen && window.innerWidth < 768 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 border-none z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div
          className={`flex-1 flex flex-col gap-2 ${isSidebarOpen && window.innerWidth < 768 ? "ml-64" : ""
            }`}
        >
          <header>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 px-2 py-2 bg-white border border-slate-200 rounded-full">
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-slate-100 text-slate-900"
                >
                  <i className="fa-regular fa-bars"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white">
                  <span>{initials}</span>
                </button>
                <div>
                  <h1 className="text-sm font-medium">{fullName}</h1>
                  <h1 className="text-xs pr-2">{email}</h1>
                </div>
              </div>

              <div className="flex space-x-2 px-2 py-2 bg-white border border-slate-200 rounded-full">
                <NavLink
                  to="overview"
                  className={({ isActive }) =>
                    `w-10 h-10 flex items-center justify-center rounded-full ${isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 border border-slate-200 text-slate-900"
                    }`
                  }
                >
                  <i className="fa-regular fa-house"></i>
                </NavLink>
                <NavLink
                  to="users"
                  className={({ isActive }) =>
                    `w-10 h-10 flex items-center justify-center rounded-full ${isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 border border-slate-200 text-slate-900"
                    }`
                  }
                >
                  <i className="fa-regular fa-users"></i>
                </NavLink>
                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    `w-10 h-10 flex items-center justify-center rounded-full ${isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 border border-slate-200 text-slate-900"
                    }`
                  }
                >
                  <i className="fa-regular fa-gear"></i>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full bg-red-600 text-white"
                >
                  <i className="fa-regular fa-power-off"></i>
                </button>
              </div>
            </div>
          </header>

          <main className="bg-white rounded-xl border border-slate-200 p-6 flex-1 overflow-y-auto min-w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;