import React, { useState, useEffect } from "react";
import { sendAnnouncement, getMyNotifications } from "../api/notifications";

const FacultyAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load sent announcements from notifications history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getMyNotifications();
        const all = res.data?.data || [];
        setAnnouncements(all.filter(n => n.type === "ANNOUNCEMENT"));
      } catch {
        // no history yet
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess("");
    setError("");
    try {
      await sendAnnouncement(form.title, form.message);
      setSuccess("Announcement sent to all your enrolled students!");
      // prepend locally so we don't need to refetch
      setAnnouncements(prev => [{
        id: Date.now(),
        subject: form.title,
        body: form.message,
        type: "ANNOUNCEMENT",
        isRead: true,
        sentAt: new Date().toISOString()
      }, ...prev]);
      setForm({ title: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send announcement.");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 pb-16 px-6 lg:px-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">Announcements</h1>
        <p className="text-[#576070] mt-1">Post notices and updates to your enrolled students.</p>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-2xl border border-[#ebecef] p-6 mb-6 shadow-sm">
        <h2 className="font-bold text-[#222e48] text-lg mb-4">New Announcement</h2>
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{success}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#576070] mb-1">Title</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#18a54a]"
              placeholder="e.g. Exam postponed to next week" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#576070] mb-1">Message</label>
            <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#18a54a]"
              placeholder="Write your announcement..." />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={sending}
              className="bg-[#18a54a] hover:bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer disabled:opacity-50">
              <i className="bi bi-megaphone me-2"></i>{sending ? "Sending..." : "Send Announcement"}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ebecef] flex items-center justify-between">
          <h2 className="font-bold text-[#222e48]">Sent Announcements</h2>
          <span className="text-xs text-[#576070] bg-gray-100 px-2 py-1 rounded-full">
            {announcements.length} total
          </span>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18a54a] mx-auto"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-[#576070]">
            <i className="bi bi-megaphone text-4xl text-gray-200 block mb-3"></i>
            <p>No announcements sent yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#ebecef]">
            {announcements.map((a, i) => (
              <div key={a.id || i} className="px-6 py-4 hover:bg-[#f7f8fa] transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="bi bi-megaphone-fill text-[#076dcd] text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#222e48]">{a.subject || a.title}</h3>
                      <p className="text-sm text-[#576070] mt-0.5">{a.body || a.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#576070] whitespace-nowrap ml-4">
                    {a.sentAt ? formatDate(a.sentAt) : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAnnouncements;
