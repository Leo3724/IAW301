import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserStatus } from "../api/users";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [togglingId, setTogglingId] = useState(null);

  const fetchStudents = async (p = 0, q = "") => {
    setLoading(true);
    try {
      const res = await getAllUsers({ role: "STUDENT", page: p, size: 10, search: q || undefined });
      const data = res.data?.data;
      setStudents(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch { setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(0, search); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchStudents(0, search);
  };

  const handleStatusToggle = async (student) => {
    setTogglingId(student.id);
    const newStatus = student.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateUserStatus(student.id, newStatus);
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchStudents(p, search);
  };

  const statusBadge = (status) => {
    const map = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-gray-100 text-gray-600",
      SUSPENDED: "bg-red-100 text-red-600",
    };
    return map[status] || "bg-gray-100 text-gray-500";
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#222e48]">Manage Students</h1>
          <p className="text-[#576070] mt-1">View and manage all registered students.</p>
        </div>
        <div className="bg-blue-50 text-[#076dcd] px-4 py-2 rounded-xl text-sm font-semibold">
          <i className="bi bi-people-fill me-2"></i>{students.length} shown
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#076dcd]"
          />
        </div>
        <button type="submit"
          className="bg-[#076dcd] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(""); setPage(0); fetchStudents(0, ""); }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd] mx-auto"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="p-16 text-center text-[#576070]">
            <i className="bi bi-people text-6xl text-gray-200 block mb-4"></i>
            <p className="text-lg font-medium">No students found.</p>
            {search && <p className="text-sm mt-1">Try a different search term.</p>}
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-[#f7f8fa] border-b border-[#ebecef]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Student</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Joined</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-[#576070]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebecef]">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {(s.fullName || s.name || "?")[0].toUpperCase()}
                        </div>
                        <p className="font-semibold text-[#222e48]">{s.fullName || s.name || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#576070]">{s.email}</td>
                    <td className="px-6 py-4 text-[#576070]">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(s.status)}`}>
                        {s.status || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        disabled={togglingId === s.id}
                        onClick={() => handleStatusToggle(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                          s.status === "ACTIVE"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}>
                        {togglingId === s.id ? "..." : s.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[#ebecef] flex items-center justify-between">
                <p className="text-xs text-[#576070]">Page {page + 1} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}
                    className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 hover:border-[#076dcd] disabled:opacity-40 transition-colors cursor-pointer">
                    <i className="bi bi-chevron-left"></i> Prev
                  </button>
                  <button disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}
                    className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 hover:border-[#076dcd] disabled:opacity-40 transition-colors cursor-pointer">
                    Next <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;
