import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyNotifications, markNotificationRead } from "../../api/notifications";

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getMyNotifications();
      const all = res.data?.data || [];
      setNotifications(all.slice(0, 5)); // show latest 5 in dropdown
      setUnread(all.filter(n => !n.isRead).length);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const navLinks = [
    { to: "/student/dashboard", label: "Dashboard", icon: "bi-grid" },
    { to: "/courses", label: "Browse", icon: "bi-collection-play" },
    { to: "/student/grades", label: "Grades", icon: "bi-bar-chart" },
    { to: "/student/badges", label: "Badges", icon: "bi-trophy" },
    { to: "/student/assignments", label: "Assignments", icon: "bi-file-earmark-text" },
  ];

  const isActive = (path) => location.pathname === path;

  const typeIcon = (type) => {
    const map = { ANNOUNCEMENT: "bi-megaphone-fill text-blue-500", BADGE: "bi-trophy-fill text-yellow-500", ENROLLMENT: "bi-person-check-fill text-green-500" };
    return map[type] || "bi-bell-fill text-gray-400";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-[#ebecef] shadow-sm">
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/student/dashboard" className="flex items-center gap-2 text-[#222e48] font-bold text-lg sora-font flex-shrink-0">
          <div className="w-8 h-8 bg-[#076dcd] rounded-lg flex items-center justify-center">
            <i className="bi bi-mortarboard-fill text-white text-sm"></i>
          </div>
          LearnHub
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <Link to={to}
                className={`flex items-center gap-1.5 transition-colors duration-200 hover:text-[#076dcd] ${isActive(to) ? "text-[#076dcd] font-bold" : "text-[#404a60]"}`}>
                <i className={`bi ${icon} text-base`}></i> {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side — notifications + profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-full border border-[#ebecef] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <i className="bi bi-bell-fill text-[#404a60] text-sm"></i>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-[#ebecef] rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebecef] flex justify-between items-center">
                  <h3 className="font-semibold text-[#222e48] text-sm">Notifications</h3>
                  <Link to="/student/notifications" onClick={() => setNotifOpen(false)}
                    className="text-xs text-[#076dcd] hover:underline">View all</Link>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[#576070] text-sm">
                    <i className="bi bi-bell-slash text-3xl text-gray-200 block mb-2"></i>
                    No notifications yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#ebecef] max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id}
                        className={`px-4 py-3 hover:bg-[#f7f8fa] transition-colors cursor-pointer ${!n.isRead ? "bg-blue-50" : ""}`}
                        onClick={() => handleMarkRead(n.id)}>
                        <div className="flex items-start gap-3">
                          <i className={`bi ${typeIcon(n.type)} text-sm mt-0.5 flex-shrink-0`}></i>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate ${!n.isRead ? "text-[#222e48]" : "text-[#576070]"}`}>{n.subject}</p>
                            <p className="text-xs text-[#576070] mt-0.5 line-clamp-2">{n.body}</p>
                          </div>
                          {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile button */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 cursor-pointer focus:outline-none">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white text-sm font-bold">
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[#222e48] text-sm font-semibold leading-tight">{user?.fullName?.split(" ")[0]}</p>
                <p className="text-[#076dcd] text-xs">Student</p>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 bg-white border border-[#ebecef] rounded-xl shadow-lg py-1 w-48 z-50">
                <Link to="/student/profile" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#222e48] hover:bg-[#f3f9ff] transition-colors">
                  <i className="bi bi-person-circle text-[#076dcd]"></i> My Profile
                </Link>
                <Link to="/student/notifications" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#222e48] hover:bg-[#f3f9ff] transition-colors">
                  <i className="bi bi-bell text-[#076dcd]"></i> Notifications
                  {unread > 0 && <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                </Link>
                <div className="border-t border-[#ebecef] my-1"></div>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-[#404a60] text-2xl p-1 cursor-pointer">
            <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#ebecef] shadow-md">
          <ul className="px-5 py-3 space-y-1">
            {navLinks.map(({ to, label, icon }) => (
              <li key={to}>
                <Link to={to} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 text-sm font-medium ${isActive(to) ? "text-[#076dcd]" : "text-[#404a60]"}`}>
                  <i className={`bi ${icon}`}></i> {label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-[#ebecef]">
              <Link to="/student/notifications" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 text-sm font-medium text-[#404a60]">
                <i className="bi bi-bell"></i> Notifications
                {unread > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>}
              </Link>
            </li>
            <li>
              <Link to="/student/profile" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 text-sm font-medium text-[#404a60]">
                <i className="bi bi-person-circle"></i> My Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-sm font-medium text-red-600 cursor-pointer">
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default StudentNavbar;
