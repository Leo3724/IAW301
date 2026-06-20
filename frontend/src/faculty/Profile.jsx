import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const FacultyProfile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || "", bio: user?.bio || "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      await axiosInstance.put("/api/v1/users/me", form);
      // Update local storage
      const updated = { ...user, ...form };
      localStorage.setItem("lms_user", JSON.stringify(updated));
      setSuccess("Profile updated successfully!");
    } catch {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 pb-16 px-6 lg:px-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">My Profile</h1>
        <p className="text-[#576070] mt-1">Update your account information.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="bg-white rounded-2xl border border-[#ebecef] p-8 text-center shadow-sm h-fit">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#18a54a] to-[#076dcd] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
          <h2 className="font-bold text-[#222e48] text-xl">{user?.fullName}</h2>
          <p className="text-[#576070] text-sm mt-1">{user?.email}</p>
          <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Faculty Member</span>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ebecef] p-6 shadow-sm">
          <h2 className="font-bold text-[#222e48] text-lg mb-5">Account Information</h2>
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{success}</div>}
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#576070] mb-1.5">Full Name</label>
              <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#18a54a]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#576070] mb-1.5">Email</label>
              <input value={user?.email || ""} disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#576070] mb-1.5">Bio</label>
              <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#18a54a]"
                placeholder="Tell students about yourself..." />
            </div>
            <button type="submit" disabled={saving}
              className="bg-[#18a54a] hover:bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
