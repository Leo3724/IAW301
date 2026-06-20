import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyEnrollments } from "../api/enrollment";
import { getInstructorCourses } from "../api/courses";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { navigate("/signin"); return; }
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === "STUDENT") {
          const res = await getMyEnrollments();
          setData(res.data.data || []);
        } else if (user?.role === "INSTRUCTOR") {
          const res = await getInstructorCourses();
          setData(res.data.data?.content || []);
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  const handleLogout = () => { logout(); navigate("/"); };

  const roleColors = { STUDENT: "bg-blue-100 text-blue-700", INSTRUCTOR: "bg-purple-100 text-purple-700", ADMIN: "bg-red-100 text-red-700" };

  return (
    <div className="min-h-screen bg-[#f3f9ff] pt-24 pb-16 px-[2%] lg:px-[12%] sm:px-[8%]">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#ebecef] p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white text-2xl font-bold">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-[#222e48] text-2xl font-bold sora-font">Welcome, {user?.fullName}!</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[user?.role] || "bg-gray-100"}`}>{user?.role}</span>
              <span className="text-[#576070] text-sm">{user?.email}</span>
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm border border-red-200 cursor-pointer transition-colors duration-200">
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#ebecef] p-5 text-center shadow-sm">
          <i className="bi bi-collection-play text-[#076dcd] text-3xl"></i>
          <p className="text-[#222e48] font-bold text-2xl mt-2">{data.length}</p>
          <p className="text-[#576070] text-xs">{user?.role === "INSTRUCTOR" ? "My Courses" : "Enrolled Courses"}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#ebecef] p-5 text-center shadow-sm">
          <i className="bi bi-person-check text-green-500 text-3xl"></i>
          <p className="text-[#222e48] font-bold text-2xl mt-2">{data.length > 0 ? "Active" : "None"}</p>
          <p className="text-[#576070] text-xs">Status</p>
        </div>
        <div className="bg-white rounded-xl border border-[#ebecef] p-5 text-center shadow-sm">
          <i className="bi bi-envelope text-[#f37739] text-3xl"></i>
          <p className="text-[#222e48] font-bold text-2xl mt-2 truncate text-sm">{user?.email?.split("@")[0]}</p>
          <p className="text-[#576070] text-xs">Account</p>
        </div>
        <div className="bg-white rounded-xl border border-[#ebecef] p-5 text-center shadow-sm">
          <i className="bi bi-star text-yellow-400 text-3xl"></i>
          <p className="text-[#222e48] font-bold text-2xl mt-2">{user?.role === "STUDENT" ? "Learner" : "Creator"}</p>
          <p className="text-[#576070] text-xs">Role</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#ebecef] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#222e48] text-xl font-bold sora-font">
            {user?.role === "STUDENT" ? "My Enrolled Courses" : "My Created Courses"}
          </h2>
          {user?.role === "STUDENT" && (
            <Link to="/courses" className="text-[#076dcd] text-sm hover:underline">
              Browse More Courses <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm mb-4">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd]"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <i className="bi bi-inbox text-gray-300 text-6xl"></i>
            <p className="text-[#576070] mt-4 text-lg">
              {user?.role === "STUDENT" ? "You haven't enrolled in any courses yet." : "You haven't created any courses yet."}
            </p>
            <Link to="/courses" className="mt-4 inline-block bg-[#076dcd] hover:bg-black text-white px-6 py-2.5 rounded-full text-sm transition-colors duration-300">
              {user?.role === "STUDENT" ? "Browse Courses" : "Explore Platform"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item, idx) => {
              // Enrollment DTO returns flat fields: courseId, courseTitle, courseThumbnailUrl
              // Instructor courses return full course objects directly
              const courseId = user?.role === "STUDENT" ? item.courseId : item.id;
              const courseTitle = user?.role === "STUDENT" ? item.courseTitle : item.title;
              const thumbnailUrl = user?.role === "STUDENT" ? item.courseThumbnailUrl : item.thumbnailUrl;
              const level = user?.role === "STUDENT" ? item.level : item.level;
              return (
                <div key={item.id || idx} className="border border-[#ebecef] rounded-xl overflow-hidden group hover:shadow-md transition-shadow duration-300">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={courseTitle} className="w-full h-[150px] object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-[150px] bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center">
                      <i className="bi bi-play-circle text-white text-4xl opacity-60"></i>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-[#222e48] font-semibold text-sm mb-1 line-clamp-2">{courseTitle || "—"}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-[#576070]">{item.level || ""}</span>
                      {user?.role === "STUDENT" && item.completionPercentage !== undefined && (
                        <span className="text-xs text-[#076dcd] font-medium">{Math.round(item.completionPercentage || 0)}% done</span>
                      )}
                    </div>
                    {user?.role === "STUDENT" && item.completionPercentage !== undefined && (
                      <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all ${item.completionPercentage >= 100 ? "bg-green-500" : "bg-[#076dcd]"}`}
                          style={{ width: `${Math.min(item.completionPercentage || 0, 100)}%` }}></div>
                      </div>
                    )}
                    {user?.role === "STUDENT" ? (() => {
                      const pct = Math.round(item.completionPercentage || 0);
                      const isCompleted = pct >= 100;
                      return (
                        <Link to={`/learn/${courseId}`}
                          className={`mt-3 block text-center text-xs py-1.5 rounded-full transition-colors duration-200 border ${
                            isCompleted
                              ? "border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                              : "border-[#076dcd] text-[#076dcd] hover:bg-[#076dcd] hover:text-white"
                          }`}>
                          {isCompleted ? "✓ Review Course" : "Continue Learning"}
                        </Link>
                      );
                    })() : (
                      <Link to={`/courses/${courseId}`}
                        className="mt-3 block text-center text-xs text-[#076dcd] hover:text-white hover:bg-[#076dcd] border border-[#076dcd] py-1.5 rounded-full transition-colors duration-200">
                        View Course
                      </Link>
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

export default Dashboard;
