import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { to: "/admin/users", label: "Users", icon: "bi-people" },
    { to: "/admin/students", label: "Students", icon: "bi-person-badge" },
    { to: "/admin/courses", label: "Courses", icon: "bi-collection-play" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-[#ebecef] shadow-sm">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2 text-[#222e48] font-bold text-xl sora-font">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <i className="bi bi-shield-lock-fill text-white text-sm"></i>
          </div>
          Admin Portal
        </Link>

        {/* Desktop Nav Links */}
        <ul className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <Link to={to}
                className={`flex items-center gap-2 transition-colors duration-200 hover:text-red-600 ${isActive(to) ? "text-red-600 font-bold" : "text-[#404a60]"}`}>
                <i className={`bi ${icon}`}></i> {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 cursor-pointer focus:outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-[#222e48] text-sm font-bold leading-tight">{user?.fullName || "System Admin"}</p>
                <p className="text-red-600 text-xs font-medium">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 text-sm font-bold">
                {user?.fullName?.[0]?.toUpperCase() || "A"}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 bg-white border border-[#ebecef] rounded-lg shadow-lg py-1 w-48">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#222e48] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
                  <i className="bi bi-box-arrow-right"></i> Secure Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
