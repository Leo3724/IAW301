import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { getCourseById } from "../api/courses";
import { enrollInCourse, checkEnrollment } from "../api/enrollment";
import { useAuth } from "../context/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getCourseById(id);
        setCourse(res.data.data);
        if (isAuthenticated && user?.role === "STUDENT") {
          const enrollRes = await checkEnrollment(id);
          setIsEnrolled(enrollRes.data.data);
        }
      } catch (err) {
        setError("Could not load course.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate("/signin"); return; }
    setEnrolling(true);
    try {
      await enrollInCourse(Number(id));
      setIsEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  const levelColors = { BEGINNER: "bg-green-100 text-green-700", INTERMEDIATE: "bg-yellow-100 text-yellow-700", ADVANCED: "bg-red-100 text-red-700" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#076dcd]"></div>
    </div>
  );

  if (error || !course) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-600">{error || "Course not found."}</p>
      <Link to="/courses" className="text-[#076dcd] hover:underline">← Back to Courses</Link>
    </div>
  );

  return (
    <>
      <div className="section-banner bg-[#f3f9ff] h-[350px] py-[50px] lg:py-[90px] flex flex-col justify-center items-center relative">
        <h1 className="chakrapetch-font font-bold text-3xl lg:text-5xl mb-4 text-[#222e48] text-center px-4">{course.title}</h1>
        <ul className="flex items-center gap-2">
          <li><Link to="/"><FontAwesomeIcon icon={faHome} className="pr-1" /><span className="text-sm text-[#404a60]">Home</span></Link></li>
          / <li><Link to="/courses"><span className="text-sm text-[#404a60]">Courses</span></Link></li>
          / <li><span className="text-sm text-[#f37739]">{course.title}</span></li>
        </ul>
      </div>

      <div className="px-[2%] lg:px-[12%] sm:px-[8%] py-[50px] lg:py-[80px]">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="lg:w-2/3 w-full">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-[350px] object-cover rounded-2xl mb-6" />
            ) : (
              <div className="w-full h-[350px] bg-gradient-to-br from-[#076dcd] to-[#18a54a] rounded-2xl mb-6 flex items-center justify-center">
                <i className="bi bi-play-circle text-white text-8xl opacity-50"></i>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              {course.level && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level] || "bg-gray-100 text-gray-600"}`}>{course.level}</span>
              )}
              {course.category && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{course.category}</span>}
            </div>

            <h2 className="text-[#222e48] text-2xl lg:text-3xl font-bold sora-font mb-4">{course.title}</h2>
            <p className="text-[#576070] text-sm lg:text-base leading-relaxed mb-6">{course.description || "No description available."}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f3f9ff] p-6 rounded-xl border border-[#ebecef]">
              <div className="text-center">
                <i className="bi bi-camera-video text-[#076dcd] text-2xl"></i>
                <p className="text-[#222e48] font-bold text-lg">{course.totalLessons ?? "—"}</p>
                <p className="text-[#576070] text-xs">Lessons</p>
              </div>
              <div className="text-center">
                <i className="bi bi-star-fill text-yellow-400 text-2xl"></i>
                <p className="text-[#222e48] font-bold text-lg">{course.averageRating?.toFixed(1) ?? "N/A"}</p>
                <p className="text-[#576070] text-xs">Rating ({course.totalReviews ?? 0} reviews)</p>
              </div>
              <div className="text-center">
                <i className="bi bi-bar-chart text-[#076dcd] text-2xl"></i>
                <p className="text-[#222e48] font-bold text-lg">{course.level || "—"}</p>
                <p className="text-[#576070] text-xs">Level</p>
              </div>
              <div className="text-center">
                <i className="bi bi-globe text-[#076dcd] text-2xl"></i>
                <p className="text-[#222e48] font-bold text-lg">{course.currency || "INR"}</p>
                <p className="text-[#576070] text-xs">Currency</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-white border border-[#ebecef] rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-4">
                <h3 className="text-[#f37739] text-4xl font-bold mb-1">
                  {course.price === 0 || course.price === "0.00" || !course.price ? "Free" : `₹${course.price}`}
                </h3>
                {course.price > 0 && <p className="text-[#404a60] text-sm">One-time payment</p>}
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

              {isEnrolled ? (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm font-medium">
                    <i className="bi bi-check-circle me-2"></i>You're enrolled in this course!
                  </div>
                  <Link to="/dashboard" className="block w-full bg-[#076dcd] hover:bg-black text-white py-3 rounded-full text-sm text-center transition-colors duration-300">
                    Go to Dashboard
                  </Link>
                </div>
              ) : user?.role === "INSTRUCTOR" || user?.role === "ADMIN" ? (
                <div className="text-center text-[#404a60] text-sm p-3 bg-[#f3f9ff] rounded-xl">
                  Enrollment is for students only.
                </div>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling}
                  className="w-full bg-[#076dcd] hover:bg-black text-white py-3 rounded-full text-sm cursor-pointer transition-colors duration-300 disabled:opacity-60">
                  {enrolling ? "Enrolling..." : isAuthenticated ? "Enroll Now" : "Sign In to Enroll"}
                  <i className="bi bi-arrow-up-right ps-2"></i>
                </button>
              )}

              <div className="mt-6 space-y-3 text-sm text-[#404a60]">
                <div className="flex items-center gap-2"><i className="bi bi-check2-circle text-green-500"></i> Full course access</div>
                <div className="flex items-center gap-2"><i className="bi bi-check2-circle text-green-500"></i> {course.totalLessons || 0} lessons included</div>
                <div className="flex items-center gap-2"><i className="bi bi-check2-circle text-green-500"></i> Certificate on completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
