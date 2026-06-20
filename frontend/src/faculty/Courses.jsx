import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/v1/courses/instructor/my", {
        params: { page, size: 12 }
      });
      setCourses(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 1);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError("Access denied. You must be logged in as an Instructor. Please log in with faculty@learnhub.com.");
      } else {
        setError("Failed to load courses. Please refresh.");
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleDelete = async (courseId, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this course permanently?")) return;
    setDeleting(courseId);
    try {
      await axiosInstance.delete(`/api/v1/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch {
      alert("Failed to delete course.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#18a54a]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 pb-16 px-6 lg:px-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#222e48] sora-font">My Courses</h1>
          <p className="text-[#576070] mt-1">Courses you are authoring on this platform.</p>
        </div>
        <Link to="/faculty/manage-course"
          className="bg-[#18a54a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors flex items-center gap-1.5">
          <i className="bi bi-plus-lg"></i> Create Course
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3">
          <i className="bi bi-exclamation-circle-fill text-lg flex-shrink-0 mt-0.5"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.length > 0 ? courses.map(course => (
          <div key={course.id} className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Thumbnail */}
            <div className="h-40 bg-gray-100 overflow-hidden relative">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#18a54a] to-[#076dcd] flex items-center justify-center">
                  <i className="bi bi-play-circle text-white text-4xl opacity-60"></i>
                </div>
              )}
              {/* Status badge */}
              <span className={`absolute top-2 right-2 px-2.5 py-0.5 text-xs rounded-full font-bold shadow-sm ${
                course.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {course.status || "DRAFT"}
              </span>
            </div>

            {/* Body */}
            <div className="p-5">
              <h3 className="font-bold text-[#222e48] text-base line-clamp-1 mb-1">{course.title}</h3>
              <p className="text-[#576070] text-sm line-clamp-2 mb-4">{course.description || "No description provided."}</p>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {course.level && (
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{course.level}</span>
                )}
                {course.category && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{course.category}</span>
                )}
                <span className="text-xs text-[#576070] ml-auto">{course.totalLessons || 0} lessons</span>
              </div>

              <div className="flex gap-2 border-t border-[#ebecef] pt-4">
                <Link to={`/faculty/manage-course?id=${course.id}`}
                  className="flex-1 text-center text-sm bg-[#076dcd] hover:bg-black text-white py-2 rounded-full transition-colors font-medium">
                  <i className="bi bi-pencil me-1.5"></i>Manage
                </Link>
                <button
                  onClick={(e) => handleDelete(course.id, e)}
                  disabled={deleting === course.id}
                  className="px-3 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-sm transition-colors cursor-pointer disabled:opacity-40">
                  {deleting === course.id
                    ? <i className="bi bi-arrow-repeat animate-spin"></i>
                    : <i className="bi bi-trash"></i>
                  }
                </button>
              </div>
            </div>
          </div>
        )) : !error && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <i className="bi bi-collection-play text-5xl text-gray-200 block mb-4"></i>
            <p className="text-[#576070] mb-4">You haven't created any courses yet.</p>
            <Link to="/faculty/manage-course"
              className="bg-[#18a54a] text-white px-6 py-2.5 rounded-full text-sm hover:bg-black transition-colors">
              Create Your First Course
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-5 py-2 border border-gray-200 rounded-full text-sm disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
            ← Previous
          </button>
          <span className="px-4 py-2 text-sm text-[#576070]">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-5 py-2 border border-gray-200 rounded-full text-sm disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
