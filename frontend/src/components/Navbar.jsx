import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/About", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#ebecef] shadow-sm">
      <div className="px-[2%] lg:px-[12%] sm:px-[8%] h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#222e48] font-bold text-xl sora-font">
          <div className="w-8 h-8 bg-[#076dcd] rounded-lg flex items-center justify-center">
            <i className="bi bi-mortarboard-fill text-white text-sm"></i>
          </div>
          LearnHub
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to}
                className={`transition-colors duration-200 hover:text-[#076dcd] ${isActive(to) ? "text-[#076dcd] font-semibold" : "text-[#404a60]"}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Area */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white text-sm font-bold">
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <p className="text-[#222e48] text-sm font-medium leading-tight">{user?.fullName?.split(" ")[0]}</p>
                  <p className="text-[#576070] text-xs">{user?.role}</p>
                </div>
                <i className={`bi bi-chevron-down text-[#404a60] text-xs transition-transform ${profileOpen ? "rotate-180" : ""}`}></i>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 bg-white border border-[#ebecef] rounded-xl shadow-lg py-2 w-48 z-50">
                  <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#222e48] hover:bg-[#f3f9ff] transition-colors">
                    <i className="bi bi-grid-3x3-gap text-[#076dcd]"></i>
                    My Dashboard
                  </Link>
                  <Link to="/courses" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#222e48] hover:bg-[#f3f9ff] transition-colors">
                    <i className="bi bi-collection-play text-[#076dcd]"></i>
                    Browse Courses
                  </Link>
                  <div className="border-t border-[#ebecef] my-1"></div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin"
                className="text-[#404a60] hover:text-[#076dcd] text-sm font-medium transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/signup"
                className="bg-[#076dcd] hover:bg-black text-white px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[#404a60] text-2xl cursor-pointer p-1">
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#ebecef] shadow-md">
          <ul className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} onClick={() => setMenuOpen(false)}
                  className={`block py-2.5 text-sm font-medium transition-colors ${isActive(to) ? "text-[#076dcd]" : "text-[#404a60]"}`}>
                  {label}
                </Link>
              </li>
            ))}
            <div className="border-t border-[#ebecef] my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white text-sm font-bold">
                      {user?.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[#222e48] text-sm font-medium">{user?.fullName}</p>
                      <p className="text-[#576070] text-xs">{user?.role}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                    className="block py-2.5 text-sm font-medium text-[#076dcd]">
                    <i className="bi bi-grid-3x3-gap me-2"></i>My Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full text-left py-2.5 text-sm font-medium text-red-600 cursor-pointer">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-1">
                  <Link to="/signin" onClick={() => setMenuOpen(false)}
                    className="block py-2.5 text-sm font-medium text-[#404a60]">Sign In</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}
                    className="block bg-[#076dcd] text-white text-center py-2.5 rounded-full text-sm font-medium">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
