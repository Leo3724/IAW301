import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const FacultyNavbar = () => {
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
    { to: "/faculty/dashboard", label: "Dashboard", icon: "bi-bar-chart" },
    { to: "/faculty/courses", label: "My Courses", icon: "bi-collection-play" },
    { to: "/faculty/assignments", label: "Assignments", icon: "bi-file-earmark-text" },
    { to: "/faculty/announcements", label: "Announcements", icon: "bi-megaphone" },
    { to: "/faculty/profile", label: "Profile", icon: "bi-person-circle" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-[#ebecef] shadow-sm">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/faculty/dashboard" className="flex items-center gap-2 text-[#222e48] font-bold text-xl sora-font">
          <div className="w-8 h-8 bg-[#18a54a] rounded-lg flex items-center justify-center">
            <i className="bi bi-easel-fill text-white text-sm"></i>
          </div>
          Faculty Portal
        </Link>

        {/* Desktop Nav Links */}
        <ul className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <Link to={to}
                className={`flex items-center gap-2 transition-colors duration-200 hover:text-[#18a54a] ${isActive(to) ? "text-[#18a54a] font-bold" : "text-[#404a60]"}`}>
                <i className={`bi ${icon}`}></i> {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Faculty Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 cursor-pointer focus:outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-[#222e48] text-sm font-bold leading-tight">{user?.fullName || "Instructor"}</p>
                <p className="text-[#18a54a] text-xs font-medium">Faculty Member</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-[#18a54a] text-sm font-bold">
                {user?.fullName?.[0]?.toUpperCase() || "F"}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 bg-white border border-[#ebecef] rounded-lg shadow-lg py-1 w-48">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#222e48] hover:bg-green-50 hover:text-[#18a54a] transition-colors cursor-pointer">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FacultyNavbar;
