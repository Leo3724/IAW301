import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { issueCertificate } from "../api/certificates";
import { useAuth } from "../context/AuthContext";

const Certificate = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    issueCertificate(courseId)
      .then((res) => setCert(res.data.data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Could not issue certificate. Make sure you've completed all lessons."
        );
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const handlePrint = () => window.print();

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f9ff]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#076dcd] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#576070]">Generating your certificate…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f9ff] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#ebecef] p-10 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-[#222e48] font-bold sora-font text-xl mb-2">Certificate Unavailable</h2>
          <p className="text-[#576070] text-sm mb-6">{error}</p>
          <Link
            to={`/learn/${courseId}`}
            className="bg-[#076dcd] hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-print, #certificate-print * { visibility: visible; }
          #certificate-print { position: fixed; inset: 0; }
          .no-print { display: none !important; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
      `}</style>

      {/* Action bar */}
      <div className="no-print bg-white border-b border-[#ebecef] px-[4%] lg:px-[12%] py-4 flex items-center justify-between">
        <Link to="/student/dashboard" className="flex items-center gap-2 text-[#576070] hover:text-[#076dcd] text-sm transition-colors">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </Link>
        <div className="flex gap-3">
          <Link
            to="/student/grades"
            className="border border-[#ebecef] text-[#404a60] hover:border-[#076dcd] hover:text-[#076dcd] px-4 py-2 rounded-full text-sm transition-colors"
          >
            My Certificates
          </Link>
          <button
            onClick={handlePrint}
            className="bg-[#076dcd] hover:bg-black text-white px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="bi bi-printer"></i> Print / Download
          </button>
        </div>
      </div>

      <div className="no-print bg-[#f3f9ff] py-10 px-4 flex items-center justify-center min-h-[calc(100vh-64px)]">
        {/* Certificate */}
        <div
          id="certificate-print"
          ref={printRef}
          className="bg-white w-full max-w-4xl aspect-[1.414/1] relative overflow-hidden shadow-2xl rounded-2xl"
          style={{ minHeight: 480 }}
        >
          {/* Decorative border */}
          <div className="absolute inset-3 border-4 border-[#076dcd] rounded-xl pointer-events-none opacity-20"></div>
          <div className="absolute inset-5 border border-[#076dcd] rounded-xl pointer-events-none opacity-10"></div>

          {/* Corner ornaments */}
          {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-10 h-10 border-2 border-[#f37739] opacity-40 rounded-sm`}></div>
          ))}

          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-[200px] font-black text-[#076dcd]">LH</span>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 py-10 text-center">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-[#076dcd] rounded-lg flex items-center justify-center">
                <i className="bi bi-mortarboard-fill text-white text-sm"></i>
              </div>
              <span className="text-[#222e48] font-bold text-xl sora-font">LearnHub</span>
            </div>

            {/* Header */}
            <p className="text-[#f37739] text-sm font-semibold chakrapetch-font tracking-[0.3em] uppercase mb-1">
              Certificate of Completion
            </p>
            <p className="text-[#576070] text-xs tracking-widest uppercase mb-6">
              This is to certify that
            </p>

            {/* Student Name */}
            <h1
              className="text-[#222e48] font-bold mb-4"
              style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
            >
              {cert.studentName}
            </h1>

            <p className="text-[#576070] text-sm mb-2">has successfully completed the course</p>

            {/* Course Name */}
            <h2 className="text-[#076dcd] font-bold sora-font text-2xl md:text-3xl mb-6 px-4">
              {cert.courseName}
            </h2>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full max-w-sm mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#ebecef]"></div>
              <i className="bi bi-award-fill text-[#f37739] text-xl"></i>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#ebecef]"></div>
            </div>

            {/* Date + Instructor row */}
            <div className="flex items-end justify-between w-full max-w-lg">
              <div className="text-left">
                <div className="w-32 h-px bg-[#222e48] mb-1"></div>
                <p className="text-[#222e48] text-xs font-semibold">{cert.instructorName || "LearnHub"}</p>
                <p className="text-[#576070] text-xs">Instructor</p>
              </div>

              <div className="text-center px-4">
                <i className="bi bi-patch-check-fill text-[#076dcd] text-3xl"></i>
                <p className="text-[#576070] text-xs mt-1">Verified</p>
              </div>

              <div className="text-right">
                <div className="w-32 h-px bg-[#222e48] mb-1 ml-auto"></div>
                <p className="text-[#222e48] text-xs font-semibold">{formatDate(cert.completedAt)}</p>
                <p className="text-[#576070] text-xs">Date of Completion</p>
              </div>
            </div>

            {/* Certificate code */}
            <p className="text-[#a0aab8] text-xs mt-5 tracking-wider">
              Certificate ID: <span className="font-mono">{cert.certificateCode}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="no-print bg-white border-t border-[#ebecef] px-[4%] lg:px-[12%] py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[#222e48] font-semibold text-sm">Verify this certificate</p>
            <p className="text-[#576070] text-xs mt-0.5">
              Anyone can verify at:{" "}
              <span className="font-mono text-[#076dcd]">
                {window.location.origin}/verify/{cert.certificateCode}
              </span>
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.certificateCode}`)}
            className="border border-[#ebecef] hover:border-[#076dcd] text-[#404a60] hover:text-[#076dcd] px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="bi bi-clipboard"></i> Copy Verify Link
          </button>
        </div>
      </div>
    </>
  );
};

export default Certificate;
