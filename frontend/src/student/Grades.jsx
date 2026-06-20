import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const StudentGrades = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/api/v1/enrollments/my")
      .then(res => setEnrollments(res.data.data || []))
      .catch(() => {
        // fallback: try the other endpoint pattern
        axiosInstance.get("/api/v1/enrollment/my")
          .then(res => setEnrollments(res.data.data || []))
          .catch(() => setEnrollments([]));
      })
      .finally(() => setLoading(false));
  }, []);

  const getGradeColor = (pct, isCompleted) => {
    if (!isCompleted && pct < 100) return "text-gray-400";
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-yellow-600";
    return "text-red-500";
  };

  const getGradeLetter = (pct, isCompleted) => {
    // Only award a grade to completed courses
    if (!isCompleted) return "—";
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B";
    if (pct >= 60) return "C";
    if (pct >= 50) return "D";
    return "F";
  };

  return (
    <div className="min-h-screen bg-[#f3f9ff] pt-24 pb-16 px-[2%] lg:px-[12%] sm:px-[8%]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">Course Grades</h1>
        <p className="text-[#576070] mt-1">Your academic performance across all enrolled courses.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd] mx-auto"></div></div>
        ) : enrollments.length === 0 ? (
          <div className="p-12 text-center text-[#576070]">
            <i className="bi bi-bar-chart text-5xl text-gray-200 block mb-3"></i>
            No grades available. Enroll in courses to begin tracking.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f7f8fa] border-b border-[#ebecef]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Course</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Progress</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Completion %</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Grade</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-[#576070]">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebecef]">
              {enrollments.map(e => {
                const pct = Math.round(e.completionPercentage || 0);
                const isCompleted = e.isCompleted || pct === 100;
                return (
                  <tr key={e.id} className="hover:bg-[#f7f8fa]">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#222e48]">{e.courseTitle || "—"}</p>
                      {!isCompleted && pct === 0 && (
                        <p className="text-xs text-[#576070] mt-0.5">Start learning to track progress</p>
                      )}
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-[#076dcd] h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#222e48]">{pct}%</td>
                    <td className={`px-6 py-4 font-bold text-xl ${getGradeColor(pct, isCompleted)}`}>
                      {getGradeLetter(pct, isCompleted)}
                    </td>
                    <td className="px-6 py-4">
                      {isCompleted ? (
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">✓ Completed</span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">In Progress</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isCompleted ? (
                        <Link
                          to={`/student/certificate/${e.courseId}`}
                          className="inline-flex items-center gap-1.5 bg-[#f37739] hover:bg-[#e06828] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                        >
                          <i className="bi bi-award-fill"></i> Download
                        </Link>
                      ) : (
                        <span className="text-[#a0aab8] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentGrades;
