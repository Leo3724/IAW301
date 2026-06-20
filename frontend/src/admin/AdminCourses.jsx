import React, { useEffect, useState, useCallback } from "react";
import { getPublishedCourses } from "../api/courses";
import axiosInstance from "../api/axiosInstance";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (search.trim()) params.search = search.trim();
      const res = await getPublishedCourses(params);
      setCourses(res.data.data?.content ?? []);
      setTotalPages(res.data.data?.totalPages ?? 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { setPage(0); }, [search]);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Permanently delete this course?")) return;
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

  const levelColor = {
    BEGINNER: "bg-green-100 text-green-700",
    INTERMEDIATE: "bg-blue-100 text-blue-700",
    ADVANCED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 pb-16 px-6 lg:px-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">Manage Courses</h1>
        <p className="text-[#576070] mt-1">All published courses on the platform. Admins can delete any course.</p>
      </div>

      <div className="bg-white border border-[#ebecef] rounded-2xl p-4 mb-6">
        <div className="relative max-w-sm">
          <i className="bi bi-search absolute top-1/2 -translate-y-1/2 left-3.5 text-gray-400"></i>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#076dcd]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#576070]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd] mx-auto mb-3"></div>
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center text-[#576070]">
            <i className="bi bi-collection-play text-5xl text-gray-200 block mb-3"></i>
            No courses found.
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-[#f7f8fa] border-b border-[#ebecef]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Course</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Instructor</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Level</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Price</th>
                  <th className="px-6 py-3 text-right font-semibold text-[#576070]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebecef]">
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt="" className="w-12 h-9 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-9 rounded bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center flex-shrink-0">
                            <i className="bi bi-play-circle text-white text-sm"></i>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#222e48] line-clamp-1">{course.title}</p>
                          <p className="text-xs text-[#576070]">{course.category || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#576070]">{course.instructorName || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${levelColor[course.level] || "bg-gray-100"}`}>{course.level}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#222e48]">
                      {course.price === 0 ? <span className="text-green-600">Free</span> : `₹${course.price}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deleting === course.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer disabled:opacity-40 transition-colors">
                        {deleting === course.id ? "Deleting..." : <><i className="bi bi-trash me-1"></i>Delete</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[#ebecef] flex justify-between items-center">
                <p className="text-sm text-[#576070]">Page {page + 1} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 cursor-pointer">Previous</button>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                    className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 cursor-pointer">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
