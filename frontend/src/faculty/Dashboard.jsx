import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const [insightsRes, coursesRes] = await Promise.allSettled([
          axiosInstance.get(`/api/v1/analytics/instructors/${user.id}/insights`),
          axiosInstance.get("/api/v1/courses/instructor/my", { params: { page: 0, size: 3 } }),
        ]);

        if (insightsRes.status === "fulfilled") {
          setStats(insightsRes.value.data?.data);
        }
        if (coursesRes.status === "fulfilled") {
          setRecentCourses(coursesRes.value.data?.data?.content || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const stat = (val, fallback = 0) => (loading ? "—" : val ?? fallback);

  return (
    <div className="p-6 max-w-6xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222e48]">
          Welcome back, {user?.fullName?.split(" ")[0]} 👋
        </h1>
        <p className="text-[#576070] mt-1">Here's how your courses are performing.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "My Courses", value: stat(stats?.totalCourses), icon: "bi-collection-play", color: "text-[#076dcd]", bg: "bg-blue-50" },
          { label: "Total Students", value: stat(stats?.totalStudents), icon: "bi-people-fill", color: "text-green-600", bg: "bg-green-50" },
          { label: "Average Rating", value: loading ? "—" : (stats?.averageRating?.toFixed(1) ?? "0.0"), icon: "bi-star-fill", color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Avg Completion", value: loading ? "—" : `${stats?.avgCompletionRate?.toFixed(0) ?? 0}%`, icon: "bi-graph-up", color: "text-purple-600", bg: "bg-purple-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#ebecef] p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <i className={`bi ${s.icon} ${s.color} text-lg`}></i>
            </div>
            <p className="text-2xl font-bold text-[#222e48]">{s.value}</p>
            <p className="text-xs text-[#576070] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ebecef] shadow-sm">
          <div className="px-6 py-4 border-b border-[#ebecef] flex justify-between items-center">
            <h2 className="font-bold text-[#222e48]">Recent Courses</h2>
            <Link to="/faculty/courses" className="text-xs text-[#076dcd] hover:underline">
              View All <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#076dcd] mx-auto"></div>
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="p-12 text-center text-[#576070]">
              <i className="bi bi-collection-play text-5xl text-gray-200 block mb-3"></i>
              <p className="text-sm">No courses yet. Create your first one!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#ebecef]">
              {recentCourses.map(c => (
                <div key={c.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#f7f8fa] transition-colors">
                  {c.thumbnailUrl ? (
                    <img src={c.thumbnailUrl} alt={c.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center flex-shrink-0">
                      <i className="bi bi-play-circle text-white text-xl"></i>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#222e48] truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {c.status}
                      </span>
                      {c.averageRating > 0 && (
                        <span className="text-xs text-[#576070]">
                          <i className="bi bi-star-fill text-yellow-400 me-1"></i>{c.averageRating?.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#ebecef] p-6 shadow-sm">
            <h2 className="font-bold text-[#222e48] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { to: "/faculty/manage-course", icon: "bi-plus-circle-fill", label: "Create New Course", color: "bg-[#076dcd]" },
                { to: "/faculty/assignments", icon: "bi-file-earmark-plus", label: "Add Assignment", color: "bg-[#18a54a]" },
                { to: "/faculty/announcements", icon: "bi-megaphone-fill", label: "Send Announcement", color: "bg-orange-500" },
                { to: "/faculty/courses", icon: "bi-collection-play", label: "Manage Courses", color: "bg-purple-600" },
              ].map(a => (
                <Link key={a.to} to={a.to}
                  className={`flex items-center gap-3 ${a.color} hover:opacity-90 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all`}>
                  <i className={`bi ${a.icon} text-base`}></i>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-[#076dcd] to-[#18a54a] rounded-2xl p-5 text-white shadow-sm">
            <i className="bi bi-lightbulb-fill text-2xl mb-2 block"></i>
            <p className="font-semibold text-sm mb-1">Pro Tip</p>
            <p className="text-xs text-blue-100">Courses with ≥ 5 lessons and a clear description get 3x more enrollments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
