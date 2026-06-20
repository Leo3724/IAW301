import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: get enrolled courses
        const enRes = await axiosInstance.get("/api/v1/enrollments/my");
        const enrolled = enRes.data.data || [];

        if (enrolled.length === 0) {
          setAssignments([]);
          setLoading(false);
          return;
        }

        // Step 2: fetch assignments for each enrolled course (in parallel)
        const results = await Promise.allSettled(
          enrolled.map(e =>
            axiosInstance.get(`/api/v1/assignments/course/${e.courseId}`)
              .then(r => (r.data.data || []).map(a => ({
                ...a,
                courseName: e.courseTitle,
                courseId: e.courseId,
              })))
          )
        );

        const all = results
          .filter(r => r.status === "fulfilled")
          .flatMap(r => r.value);

        setAssignments(all);
      } catch (err) {
        setError("Could not load assignments. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f9ff] pt-24 pb-16 px-[2%] lg:px-[12%] sm:px-[8%]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">My Assignments</h1>
        <p className="text-[#576070] mt-1">Assignments posted by your instructors for your enrolled courses.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
        {assignments.length === 0 ? (
          <div className="p-12 text-center text-[#576070]">
            <i className="bi bi-file-earmark-check text-5xl text-gray-200 block mb-3"></i>
            <p className="text-base font-medium">No assignments yet.</p>
            <p className="text-sm mt-1">Your instructors haven't posted any assignments for your courses.</p>
            <Link to="/courses" className="mt-4 inline-block bg-[#076dcd] text-white px-5 py-2 rounded-full text-sm hover:bg-black transition-colors">
              Browse More Courses
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#ebecef]">
            {assignments.map((a, i) => (
              <div key={a.id || i} className="px-6 py-5 flex items-start justify-between hover:bg-[#f7f8fa] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <i className="bi bi-file-earmark-text text-[#076dcd]"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#222e48]">{a.title}</h3>
                    <p className="text-xs text-[#576070] mt-0.5">
                      <i className="bi bi-collection-play me-1"></i>{a.courseName}
                    </p>
                    {a.description && (
                      <p className="text-sm text-[#576070] mt-1.5 line-clamp-2">{a.description}</p>
                    )}
                    {a.dueDate && (
                      <p className="text-xs text-orange-600 mt-1.5 font-medium">
                        <i className="bi bi-clock me-1"></i>
                        Due: {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                  <Link to={`/learn/${a.courseId}`}
                    className="text-xs text-[#076dcd] hover:underline">
                    Go to Course →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
