import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../api/users";
import { getPublishedCourses } from "../api/courses";

const StatCard = ({ icon, label, value, color, loading }) => (
  <div className="bg-white rounded-2xl border border-[#ebecef] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
      <i className={`bi ${icon} text-white text-2xl`}></i>
    </div>
    <div>
      <p className="text-[#576070] text-sm font-medium">{label}</p>
      <p className="text-[#222e48] text-3xl font-bold mt-0.5">
        {loading ? <span className="inline-block w-12 h-7 bg-gray-200 animate-pulse rounded"></span> : value}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, instructors: 0, courses: 0, totalUsers: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, instructorsRes, coursesRes] = await Promise.all([
          getAllUsers({ role: "STUDENT", size: 1 }),
          getAllUsers({ role: "INSTRUCTOR", size: 1 }),
          getPublishedCourses({ size: 1 }),
        ]);

        const totalStudents = studentsRes.data.data?.totalElements ?? 0;
        const totalInstructors = instructorsRes.data.data?.totalElements ?? 0;
        const totalCourses = coursesRes.data.data?.totalElements ?? 0;

        setStats({
          students: totalStudents,
          instructors: totalInstructors,
          courses: totalCourses,
          totalUsers: totalStudents + totalInstructors,
        });

        // Fetch recent users for activity feed
        const recentRes = await getAllUsers({ size: 5, page: 0 });
        setRecentUsers(recentRes.data.data?.content ?? []);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const roleColor = {
    STUDENT: "bg-blue-100 text-blue-700",
    INSTRUCTOR: "bg-green-100 text-green-700",
    ADMIN: "bg-red-100 text-red-700",
  };
  const statusColor = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    SUSPENDED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 pb-16 px-6 lg:px-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">Admin Dashboard</h1>
        <p className="text-[#576070] mt-1">Live platform overview — data sourced directly from the database.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatCard icon="bi-people-fill" label="Total Students" value={stats.students.toLocaleString()} color="bg-[#076dcd]" loading={loading} />
        <StatCard icon="bi-easel-fill" label="Total Instructors" value={stats.instructors.toLocaleString()} color="bg-[#18a54a]" loading={loading} />
        <StatCard icon="bi-collection-play-fill" label="Published Courses" value={stats.courses.toLocaleString()} color="bg-[#f37739]" loading={loading} />
        <StatCard icon="bi-person-lines-fill" label="Total Users" value={stats.totalUsers.toLocaleString()} color="bg-purple-600" loading={loading} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <Link to="/admin/users"
          className="bg-white border border-[#ebecef] rounded-2xl p-6 flex items-center gap-4 hover:shadow-md hover:border-[#076dcd] transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-[#076dcd] flex items-center justify-center transition-colors">
            <i className="bi bi-people text-[#076dcd] group-hover:text-white text-xl transition-colors"></i>
          </div>
          <div>
            <p className="font-bold text-[#222e48]">Manage Users</p>
            <p className="text-[#576070] text-sm">View, suspend, or delete accounts</p>
          </div>
        </Link>
        <Link to="/admin/courses"
          className="bg-white border border-[#ebecef] rounded-2xl p-6 flex items-center gap-4 hover:shadow-md hover:border-[#18a54a] transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-green-50 group-hover:bg-[#18a54a] flex items-center justify-center transition-colors">
            <i className="bi bi-collection-play text-[#18a54a] group-hover:text-white text-xl transition-colors"></i>
          </div>
          <div>
            <p className="font-bold text-[#222e48]">Manage Courses</p>
            <p className="text-[#576070] text-sm">Review and delete published courses</p>
          </div>
        </Link>
        <div className="bg-white border border-[#ebecef] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <i className="bi bi-shield-check text-[#f37739] text-xl"></i>
          </div>
          <div>
            <p className="font-bold text-[#222e48]">Platform Status</p>
            <p className="text-green-600 text-sm font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> All systems operational
            </p>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#ebecef] flex justify-between items-center">
          <h2 className="text-[#222e48] font-bold text-lg">Recent Users</h2>
          <Link to="/admin/users" className="text-[#076dcd] text-sm font-medium hover:underline">
            View All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-[#576070]"><i className="bi bi-arrow-repeat animate-spin me-2"></i>Loading...</div>
        ) : recentUsers.length === 0 ? (
          <div className="p-8 text-center text-[#576070]">No users registered yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f7f8fa] border-b border-[#ebecef]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebecef]">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#f7f8fa] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#222e48] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.fullName?.[0]?.toUpperCase()}
                    </div>
                    {u.fullName}
                  </td>
                  <td className="px-6 py-4 text-[#576070]">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor[u.role] || "bg-gray-100"}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[u.status] || "bg-gray-100"}`}>{u.status || "ACTIVE"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
