import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyCertificate } from "../api/certificates";

const VerifyCertificate = () => {
  const { code } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifyCertificate(code)
      .then((res) => setCert(res.data.data))
      .catch(() => setError("Certificate not found or invalid code."))
      .finally(() => setLoading(false));
  }, [code]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div className="min-h-screen bg-[#f3f9ff] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center gap-2 justify-center text-[#222e48] font-bold text-xl sora-font mb-6">
            <div className="w-9 h-9 bg-[#076dcd] rounded-lg flex items-center justify-center">
              <i className="bi bi-mortarboard-fill text-white text-sm"></i>
            </div>
            LearnHub
          </Link>
          <h1 className="text-[#222e48] font-bold sora-font text-2xl">Certificate Verification</h1>
          <p className="text-[#576070] text-sm mt-1">Verifying code: <span className="font-mono text-xs">{code}</span></p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#076dcd] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#576070] text-sm">Verifying certificate…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-x-circle text-red-500 text-3xl"></i>
            </div>
            <h2 className="text-[#222e48] font-bold sora-font text-lg mb-2">Invalid Certificate</h2>
            <p className="text-[#576070] text-sm">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
            {/* Green verified banner */}
            <div className="bg-gradient-to-r from-[#18a54a] to-[#076dcd] p-6 text-center text-white">
              <i className="bi bi-patch-check-fill text-4xl block mb-2"></i>
              <h2 className="font-bold text-xl sora-font">Certificate Verified ✓</h2>
              <p className="text-sm opacity-90 mt-1">This is an authentic LearnHub certificate</p>
            </div>

            {/* Certificate details */}
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-start border-b border-[#f0f0f0] pb-4">
                <span className="text-[#576070] text-sm">Student Name</span>
                <span className="text-[#222e48] font-semibold text-sm text-right">{cert.studentName}</span>
              </div>
              <div className="flex justify-between items-start border-b border-[#f0f0f0] pb-4">
                <span className="text-[#576070] text-sm">Course</span>
                <span className="text-[#222e48] font-semibold text-sm text-right max-w-[60%]">{cert.courseName}</span>
              </div>
              <div className="flex justify-between items-start border-b border-[#f0f0f0] pb-4">
                <span className="text-[#576070] text-sm">Instructor</span>
                <span className="text-[#222e48] font-semibold text-sm">{cert.instructorName || "—"}</span>
              </div>
              <div className="flex justify-between items-start border-b border-[#f0f0f0] pb-4">
                <span className="text-[#576070] text-sm">Completed On</span>
                <span className="text-[#222e48] font-semibold text-sm">{formatDate(cert.completedAt)}</span>
              </div>
              <div className="flex justify-between items-start border-b border-[#f0f0f0] pb-4">
                <span className="text-[#576070] text-sm">Issued On</span>
                <span className="text-[#222e48] font-semibold text-sm">{formatDate(cert.issuedAt)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#576070] text-sm">Certificate ID</span>
                <span className="font-mono text-xs text-[#076dcd] break-all text-right max-w-[60%]">{cert.certificateCode}</span>
              </div>
            </div>

            <div className="px-8 pb-8">
              <Link
                to="/"
                className="block text-center bg-[#076dcd] hover:bg-black text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
              >
                Go to LearnHub
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
