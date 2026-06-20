import React, { useState, useEffect } from "react";
import { getMyNotifications, markNotificationRead } from "../api/notifications";

const typeConfig = {
  ANNOUNCEMENT: { icon: "bi-megaphone-fill", color: "bg-blue-100 text-blue-600", label: "Announcement" },
  BADGE:        { icon: "bi-trophy-fill",    color: "bg-yellow-100 text-yellow-600", label: "Badge" },
  ENROLLMENT:   { icon: "bi-person-check-fill", color: "bg-green-100 text-green-600", label: "Enrollment" },
  COURSE_UPDATE:{ icon: "bi-pencil-square",  color: "bg-purple-100 text-purple-600", label: "Course Update" },
  REMINDER:     { icon: "bi-alarm-fill",     color: "bg-orange-100 text-orange-600", label: "Reminder" },
};

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyNotifications();
        setNotifications(res.data?.data || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* silent */ }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.allSettled(unread.map(n => markNotificationRead(n.id)));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const types = ["ALL", "ANNOUNCEMENT", "BADGE", "ENROLLMENT", "COURSE_UPDATE", "REMINDER"];
  const filtered = filter === "ALL" ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      " at " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#f3f9ff] pt-24 pb-16 px-[2%] lg:px-[12%] sm:px-[8%]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#222e48] sora-font">Notifications</h1>
          <p className="text-[#576070] mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ebecef] rounded-xl text-sm font-medium text-[#076dcd] hover:bg-blue-50 transition-colors cursor-pointer shadow-sm">
            <i className="bi bi-check-all"></i>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {types.map(t => {
          const count = t === "ALL" ? notifications.filter(n => !n.isRead).length : notifications.filter(n => n.type === t && !n.isRead).length;
          return (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === t ? "bg-[#076dcd] text-white" : "bg-white text-[#576070] border border-[#ebecef] hover:bg-gray-50"
              }`}>
              {t === "ALL" ? "All" : (typeConfig[t]?.label || t)}
              {count > 0 && (
                <span className={`text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${filter === t ? "bg-white text-[#076dcd]" : "bg-red-500 text-white"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd] mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-[#576070]">
            <i className="bi bi-bell-slash text-6xl text-gray-200 block mb-4"></i>
            <p className="text-lg font-medium">No notifications here.</p>
            <p className="text-sm mt-1">Check back after your instructor sends an update.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#ebecef]">
            {filtered.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.REMINDER;
              return (
                <div key={n.id}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                  className={`px-6 py-5 flex items-start gap-4 cursor-pointer transition-colors ${!n.isRead ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-[#f7f8fa]"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <i className={`bi ${cfg.icon} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${!n.isRead ? "text-[#222e48]" : "text-[#576070]"}`}>
                        {n.subject}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#576070] mt-1">{n.body}</p>
                    {n.sentAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        <i className="bi bi-clock me-1"></i>{formatDate(n.sentAt)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
