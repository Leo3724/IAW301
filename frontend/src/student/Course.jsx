import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { getPublishedCourses } from "../api/courses";

const LEVEL_OPTIONS = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

const SkeletonCard = () => (
  <div className="bg-white p-3 rounded-xl animate-pulse">
    <div className="h-[230px] rounded-xl bg-gray-200 mb-4"></div>
    <div className="p-3 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [activeLevel, setActiveLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, size: 9 };
      if (activeLevel !== "All") params.level = activeLevel;
      if (search.trim()) params.search = search.trim();
      const res = await getPublishedCourses(params);
      const pageData = res.data.data;
      setCourses(pageData.content || []);
      setTotalElements(pageData.totalElements || 0);
      setTotalPages(pageData.totalPages || 1);
    } catch (err) {
      setError("Failed to load courses. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [activeLevel, search, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleLevelChange = (level) => {
    setActiveLevel(level);
    setPage(0);
  };

  const levelColors = {
    BEGINNER: "bg-green-100 text-green-700",
    INTERMEDIATE: "bg-yellow-100 text-yellow-700",
    ADVANCED: "bg-red-100 text-red-700",
  };

  return (
    <>
      <div className="section-banner bg-[#f3f9ff] h-[400px] py-[50px] lg:py-[90px] flex flex-col justify-center items-center relative">
        <h1 className="chakrapetch-font font-bold text-5xl lg:text-6xl mb-5 text-[#222e48]">Courses</h1>
        <ul className="flex items-center gap-2">
          <li className="cursor-pointer">
            <Link to="/"><FontAwesomeIcon icon={faHome} className="pr-1" /><span className="text-sm xl:text-md text-[#404a60]">Home</span></Link>
          </li>
          /
          <li className="cursor-pointer">
            <span className="text-sm xl:text-md text-[#f37739]">Courses</span>
          </li>
        </ul>
        <img src={"/Images/element-01.png"} alt="shape" className="shape1 absolute left-30 top-30 object-contain hidden md:block" />
        <img src={"/Images/element-02.png"} alt="shape" className="shape2 absolute left-20 top-60 object-contain hidden md:block" />
        <img src={"/Images/element-03.png"} alt="shape" className="shape3 absolute right-96 bottom-10 z-2 object-contain hidden lg:block" />
        <img src={"/Images/element-04.png"} alt="shape" className="shape4 absolute right-30 bottom-30 z-2 object-contain hidden lg:block" />
        <img src={"/Images/element-05.png"} alt="shape" className="shape5 absolute right-30 top-70 w-[20px] h-[20px] hidden sm:flex" />
        <img src={"/Images/element-05.png"} alt="shape" className="shape6 absolute left-10 bottom-50 w-[25px] h-[25px] hidden sm:flex" />
      </div>

      <div className="px-[2%] lg:px-[12%] sm:px-[8%] py-[90px] lg:py-[120px] bg-[#f3f9ff] relative">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text" placeholder="Search courses..."
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 h-[45px] border border-[#ebecef] bg-white ps-4 rounded-full outline-none focus:ring-2 focus:ring-[#076dcd] text-sm"
          />
          <button type="submit" className="bg-[#076dcd] hover:bg-black text-white px-6 h-[45px] rounded-full text-sm transition-colors duration-300 cursor-pointer">
            <i className="bi bi-search me-1"></i> Search
          </button>
        </form>

        {/* Filters row */}
        <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-semibold text-[#066dca]">{courses.length}</span> of{" "}
            <span className="font-semibold text-[#f37739]">{totalElements}</span> Results
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex flex-wrap gap-3 my-4 bg-white p-5 rounded-xl shadow-xl mb-8">
          {LEVEL_OPTIONS.map((level) => (
            <button key={level} onClick={() => handleLevelChange(level)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer shadow-sm ${activeLevel === level ? "bg-blue-600 text-white" : "bg-[#f3f9ff] text-[#404a60] hover:bg-blue-50"}`}>
              {level === "All" ? "All Levels" : level.charAt(0) + level.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id}
                className="bg-white p-3 rounded-xl group hover:shadow-lg transition duration-300 relative block">
                <div className="h-[230px] rounded-xl overflow-hidden relative bg-gray-200">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} loading="lazy"
                      className="group-hover:scale-110 transition duration-500 h-full w-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center">
                      <i className="bi bi-play-circle text-white text-5xl opacity-50"></i>
                    </div>
                  )}
                  {course.level && (
                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold ${levelColors[course.level] || "bg-gray-100"}`}>
                      {course.level}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  {course.category && (
                    <span className="text-xs text-[#076dcd] font-medium bg-blue-50 px-2 py-0.5 rounded-full">{course.category}</span>
                  )}
                  <h4 className="text-[#222e48] font-bold sm:text-lg hover:text-[#006dca] transition-colors duration-300 mt-2 line-clamp-2">
                    {course.title}
                  </h4>
                  <div className="flex justify-between items-center my-2 text-sm text-[#404a60]">
                    <span><i className="bi bi-camera-video pe-2"></i>{course.totalLessons ?? "—"} Lessons</span>
                    <span><i className="bi bi-star-fill text-yellow-400 pe-1"></i>{course.averageRating?.toFixed(1) ?? "N/A"}</span>
                  </div>
                  <div className="border-t-2 border-dotted pt-3 flex justify-between items-center">
                    <h4 className="text-[#f37739] text-xl font-semibold">
                      {course.price === 0 || !course.price ? "Free" : `₹${course.price}`}
                    </h4>
                    <span className="text-[#076dcd] font-medium text-sm">
                      View Course <i className="bi bi-arrow-up-right ps-1"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-16">No courses found.</p>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-4 py-2 rounded-full text-sm border border-[#ebecef] bg-white hover:bg-[#076dcd] hover:text-white disabled:opacity-40 cursor-pointer transition-colors">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-full text-sm border transition-colors cursor-pointer ${page === i ? "bg-[#076dcd] text-white border-[#076dcd]" : "border-[#ebecef] bg-white hover:bg-[#f3f9ff]"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="px-4 py-2 rounded-full text-sm border border-[#ebecef] bg-white hover:bg-[#076dcd] hover:text-white disabled:opacity-40 cursor-pointer transition-colors">
              Next →
            </button>
          </div>
        )}

        <img src={"/Images/element-01.png"} alt="shape" className="hero-shape1 absolute left-30 top-30 object-contain hidden lg:block" />
        <img src={"/Images/element-02.png"} alt="shape" className="hero-shape2 absolute left-20 top-60 object-contain hidden lg:block" />
        <img src={"/Images/element-06.png"} alt="shape" className="hero-shape7 absolute right-50 top-20 hidden lg:flex" />
      </div>
    </>
  );
};

export default Course;
