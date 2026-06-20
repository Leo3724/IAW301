import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateUserStatus, deleteUser } from "../api/users";

const ROLE_TABS = ["ALL", "STUDENT", "INSTRUCTOR"];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, size: 10 };
      if (search.trim()) params.search = search.trim();
      if (activeTab !== "ALL") params.role = activeTab;
      const res = await getAllUsers(params);
      setUsers(res.data.data?.content ?? []);
      setTotalPages(res.data.data?.totalPages ?? 1);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search: reset to page 0 when search or tab changes
  useEffect(() => {
    setPage(0);
  }, [search, activeTab]);

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    setActionLoading(`status-${user.id}`);
    try {
      await updateUserStatus(user.id, newStatus);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch {
      alert("Failed to update user status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Permanently delete this user? This cannot be undone.")) return;
    setActionLoading(`del-${userId}`);
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      alert("Failed to delete user.");
    } finally {
      setActionLoading(null);
    }
  };

  const roleColor = {
    STUDENT: "bg-blue-100 text-blue-700",
    INSTRUCTOR: "bg-green-100 text-green-700",
    ADMIN: "bg-red-100 text-red-700",
  };
  const statusColor = {
    ACTIVE: "text-green-600",
    INACTIVE: "text-gray-500",
    SUSPENDED: "text-red-600",
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 pb-16 px-6 lg:px-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">Manage Users</h1>
        <p className="text-[#576070] mt-1">Search, filter, suspend, or remove platform users.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#ebecef] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-sm">
          <i className="bi bi-search absolute top-1/2 -translate-y-1/2 left-3.5 text-gray-400"></i>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#076dcd]"
          />
        </div>
        <div className="flex gap-2">
          {ROLE_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${activeTab === tab ? "bg-[#076dcd] text-white" : "bg-gray-100 text-[#404a60] hover:bg-gray-200"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#576070]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd] mx-auto mb-3"></div>
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-[#576070]">
            <i className="bi bi-people text-5xl text-gray-200 block mb-3"></i>
            No users found.
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-[#f7f8fa] border-b border-[#ebecef]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-[#576070]">Joined</th>
                  <th className="px-6 py-3 text-right font-semibold text-[#576070]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebecef]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#222e48]">{u.fullName}</p>
                          <p className="text-[#576070] text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor[u.role] || "bg-gray-100"}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${statusColor[u.status] || "text-gray-500"}`}>
                        <i className={`bi ${u.status === "ACTIVE" ? "bi-check-circle-fill" : u.status === "SUSPENDED" ? "bi-slash-circle-fill" : "bi-circle"} me-1.5`}></i>
                        {u.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#576070]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusToggle(u)}
                          disabled={actionLoading === `status-${u.id}` || u.role === "ADMIN"}
                          title={u.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 ${u.status === "SUSPENDED" ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200" : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"}`}>
                          {actionLoading === `status-${u.id}` ? "..." : u.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={actionLoading === `del-${u.id}` || u.role === "ADMIN"}
                          title="Delete User"
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer disabled:opacity-40 transition-colors">
                          {actionLoading === `del-${u.id}` ? "..." : <><i className="bi bi-trash me-1"></i>Delete</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
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

export default ManageUsers;
