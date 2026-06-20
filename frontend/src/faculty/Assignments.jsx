import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const FacultyAssignments = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", courseId: "", dueDate: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ALL instructor courses across all pages
        let allCourses = [];
        let p = 0;
        let totalPages = 1;
        do {
          const res = await axiosInstance.get("/api/v1/courses/instructor/my", {
            params: { page: p, size: 50 }
          });
          const data = res.data.data;
          allCourses = [...allCourses, ...(data?.content || [])];
          totalPages = data?.totalPages || 1;
          p++;
        } while (p < totalPages);

        setCourses(allCourses);

        // Fetch assignments for each course
        const allAssignments = [];
        for (const c of allCourses) {
          try {
            const aRes = await axiosInstance.get(`/api/v1/assignments/course/${c.id}`);
            const items = (aRes.data.data || []).map(a => ({ ...a, courseName: c.title }));
            allAssignments.push(...items);
          } catch { /* no assignments yet */ }
        }
        setAssignments(allAssignments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axiosInstance.post("/api/v1/assignments", {
        title: form.title,
        description: form.description,
        courseId: Number(form.courseId),
        dueDate: form.dueDate || null,
      });
      const newA = res.data.data;
      const course = courses.find(c => c.id === Number(form.courseId));
      setAssignments(prev => [{ ...newA, courseName: course?.title }, ...prev]);
      setForm({ title: "", description: "", courseId: "", dueDate: "" });
      setShowForm(false);
    } catch (err) {
      alert("Failed to create assignment. Check if the backend has the /api/v1/assignments endpoint.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 pb-16 px-6 lg:px-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#222e48] sora-font">Assignments</h1>
          <p className="text-[#576070] mt-1">Create and review assignments for your courses.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#18a54a] hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer">
          {showForm ? "Cancel" : "+ New Assignment"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#ebecef] rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-[#222e48] mb-4 text-lg">Create Assignment</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#576070] mb-1">Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#18a54a]"
                  placeholder="e.g. Week 3 Problem Set" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#576070] mb-1">Course</label>
                <select required value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#18a54a]">
                  <option value="">Select a course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#576070] mb-1">Description / Instructions</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#18a54a]"
                placeholder="Describe what students should submit..." />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={creating}
                className="bg-[#18a54a] hover:bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer disabled:opacity-50">
                {creating ? "Creating..." : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#18a54a] mx-auto"></div></div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center text-[#576070]">
            <i className="bi bi-file-earmark-text text-5xl text-gray-200 block mb-3"></i>
            No assignments yet. Create your first one!
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f7f8fa] border-b border-[#ebecef]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Title</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Course</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebecef]">
              {assignments.map((a, i) => (
                <tr key={a.id || i} className="hover:bg-[#f7f8fa]">
                  <td className="px-6 py-4 font-semibold text-[#222e48]">{a.title}</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">{a.courseName}</span></td>
                  <td className="px-6 py-4 text-[#576070] line-clamp-1">{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyAssignments;
