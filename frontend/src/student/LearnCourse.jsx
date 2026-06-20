import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCourseById, getLessons } from "../api/courses";
import { checkEnrollment, getCourseProgress, updateLessonProgress } from "../api/enrollment";

const ContentTypeIcon = ({ type }) => {
  const icons = {
    VIDEO: "bi-play-circle-fill",
    DOCUMENT: "bi-file-text-fill",
    QUIZ: "bi-patch-question-fill",
  };
  return <i className={`bi ${icons[type] || "bi-collection-play"} me-2`}></i>;
};

const formatDuration = (seconds) => {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const LearnCourse = () => {
  const { courseId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingComplete, setMarkingComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!isAuthenticated) { navigate("/signin"); return; }
    if (user?.role !== "STUDENT") { navigate("/dashboard"); return; }

    setLoading(true);
    setError("");
    try {
      const [courseRes, lessonsRes, enrollRes] = await Promise.all([
        getCourseById(courseId),
        getLessons(courseId),
        checkEnrollment(courseId),
      ]);

      if (!enrollRes.data.data) {
        navigate(`/courses/${courseId}`);
        return;
      }

      const courseData = courseRes.data.data;
      const lessonData = lessonsRes.data.data || [];
      setCourse(courseData);
      const sorted = [...lessonData].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setLessons(sorted);

      // fetch progress
      try {
        const progressRes = await getCourseProgress(courseId);
        setProgress(progressRes.data.data);
      } catch (_) {
        setProgress(null);
      }

      // Set first incomplete lesson as active, or first lesson
      const firstLesson = sorted[0] || null;
      setActiveLesson(firstLesson);
    } catch (err) {
      setError("Could not load course content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseId, isAuthenticated, user, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const isLessonCompleted = (lessonId) => {
    if (!progress?.lessonProgressList) return false;
    return progress.lessonProgressList.some(
      (p) => p.lessonId === lessonId && p.isCompleted
    );
  };

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const completionPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    setMarkingComplete(true);
    try {
      await updateLessonProgress(activeLesson.id, true, activeLesson.durationSeconds || 0);
      // Re-fetch progress
      const progressRes = await getCourseProgress(courseId);
      setProgress(progressRes.data.data);

      // Auto-advance to next lesson
      const currentIdx = lessons.findIndex((l) => l.id === activeLesson.id);
      if (currentIdx < lessons.length - 1) {
        setActiveLesson(lessons[currentIdx + 1]);
      }
    } catch (err) {
      // silently fail
    } finally {
      setMarkingComplete(false);
    }
  };

  const renderContent = () => {
    if (!activeLesson) return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <i className="bi bi-collection-play text-6xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 text-lg">Select a lesson to start learning</p>
      </div>
    );

    const { contentType, contentUrl, title, durationSeconds } = activeLesson;

    if (contentType === "VIDEO") {
      // Support YouTube, Vimeo, or direct mp4
      const isYouTube = contentUrl && (contentUrl.includes("youtube.com") || contentUrl.includes("youtu.be"));
      const isVimeo = contentUrl && contentUrl.includes("vimeo.com");
      const embedUrl = isYouTube
        ? contentUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
        : contentUrl;

      return (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          {isYouTube || isVimeo ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : contentUrl ? (
            <video
              src={contentUrl}
              controls
              className="w-full h-full"
              controlsList="nodownload"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <p className="text-gray-400">No video URL available for this lesson.</p>
            </div>
          )}
        </div>
      );
    }

    if (contentType === "DOCUMENT") {
      return (
        <div className="bg-white rounded-xl border border-[#ebecef] p-8 min-h-[400px]">
          {contentUrl ? (
            <iframe
              src={contentUrl}
              title={title}
              className="w-full h-[600px] rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
              <i className="bi bi-file-text text-5xl mb-3"></i>
              <p>No document URL provided for this lesson.</p>
            </div>
          )}
        </div>
      );
    }

    if (contentType === "QUIZ") {
      return (
        <div className="bg-white rounded-xl border border-[#ebecef] p-8 text-center">
          <i className="bi bi-patch-question text-6xl text-[#076dcd] mb-4 block"></i>
          <h3 className="text-[#222e48] text-xl font-semibold mb-2">Quiz: {title}</h3>
          <p className="text-[#576070] mb-6 text-sm">
            Test your knowledge with this quiz. Complete it to mark this lesson as done.
          </p>
          <Link
            to={`/courses/${courseId}/lessons/${activeLesson.id}/quiz`}
            className="bg-[#076dcd] hover:bg-black text-white px-6 py-3 rounded-full text-sm transition-colors duration-300 inline-block"
          >
            Start Quiz <i className="bi bi-arrow-right ps-2"></i>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-60 text-gray-400">
        <i className="bi bi-question-circle text-5xl mb-3"></i>
        <p>Unknown content type</p>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#076dcd]"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-600">{error}</p>
      <Link to="/dashboard" className="text-[#076dcd] hover:underline">← Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f9ff]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#ebecef] sticky top-16 z-20 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#f3f9ff] transition-colors cursor-pointer text-[#222e48]"
            title="Toggle sidebar"
          >
            <i className={`bi ${sidebarOpen ? "bi-layout-sidebar-inset" : "bi-layout-sidebar-inset-reverse"} text-lg`}></i>
          </button>
          <div className="min-w-0">
            <p className="text-xs text-[#576070] truncate">{course?.title}</p>
            <p className="text-sm font-semibold text-[#222e48] truncate">{activeLesson?.title || "Select a lesson"}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-[#576070]">{completedCount}/{lessons.length} completed</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-gray-200 rounded-full">
                <div
                  className="h-1.5 bg-[#18a54a] rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-[#18a54a]">{completionPct}%</span>
            </div>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="text-sm text-[#576070] hover:text-[#222e48] transition-colors whitespace-nowrap"
        >
          <i className="bi bi-x-lg"></i>
        </Link>
      </div>

      <div className="flex" style={{ height: "calc(100vh - 128px)" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 min-w-[280px] bg-white border-r border-[#ebecef] overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-[#ebecef]">
              <h2 className="font-bold text-[#222e48] text-sm">Course Content</h2>
              <p className="text-xs text-[#576070] mt-1">{lessons.length} lessons</p>
            </div>
            <div className="py-2">
              {lessons.map((lesson, idx) => {
                const completed = isLessonCompleted(lesson.id);
                const isActive = activeLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-200 cursor-pointer border-l-4 ${
                      isActive
                        ? "bg-blue-50 border-[#076dcd]"
                        : "hover:bg-[#f3f9ff] border-transparent"
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      completed
                        ? "bg-[#18a54a] text-white"
                        : isActive
                        ? "bg-[#076dcd] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {completed ? <i className="bi bi-check-lg"></i> : idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium leading-snug ${isActive ? "text-[#076dcd]" : "text-[#222e48]"} line-clamp-2`}>
                        <ContentTypeIcon type={lesson.contentType} />
                        {lesson.title}
                      </p>
                      {lesson.durationSeconds && (
                        <p className="text-xs text-[#576070] mt-0.5">{formatDuration(lesson.durationSeconds)}</p>
                      )}
                    </div>
                  </button>
                );
              })}
              {lessons.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">No lessons added yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Lesson header */}
            {activeLesson && (
              <div className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {activeLesson.contentType && (
                        <span className="text-xs bg-blue-50 text-[#076dcd] px-2 py-0.5 rounded-full font-medium">
                          {activeLesson.contentType}
                        </span>
                      )}
                      {isLessonCompleted(activeLesson.id) && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          <i className="bi bi-check-circle me-1"></i>Completed
                        </span>
                      )}
                    </div>
                    <h1 className="text-[#222e48] text-xl lg:text-2xl font-bold sora-font">{activeLesson.title}</h1>
                    {activeLesson.durationSeconds && (
                      <p className="text-sm text-[#576070] mt-1">
                        <i className="bi bi-clock me-1"></i>{formatDuration(activeLesson.durationSeconds)}
                      </p>
                    )}
                  </div>
                  {!isLessonCompleted(activeLesson.id) && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={markingComplete}
                      className="bg-[#18a54a] hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer disabled:opacity-60 flex items-center gap-2"
                    >
                      {markingComplete ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Marking...</>
                      ) : (
                        <><i className="bi bi-check2-circle"></i>Mark as Complete</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Content viewer */}
            <div className="mb-8">
              {renderContent()}
            </div>

            {/* Lesson navigation */}
            {lessons.length > 0 && activeLesson && (
              <div className="flex justify-between items-center gap-4 mt-6 pt-6 border-t border-[#ebecef]">
                {(() => {
                  const idx = lessons.findIndex((l) => l.id === activeLesson.id);
                  const prev = idx > 0 ? lessons[idx - 1] : null;
                  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
                  return (
                    <>
                      <button
                        onClick={() => prev && setActiveLesson(prev)}
                        disabled={!prev}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border border-[#ebecef] bg-white hover:bg-[#f3f9ff] disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        <i className="bi bi-arrow-left"></i> Previous
                      </button>
                      <span className="text-xs text-[#576070]">
                        {lessons.findIndex((l) => l.id === activeLesson.id) + 1} / {lessons.length}
                      </span>
                      <button
                        onClick={() => next && setActiveLesson(next)}
                        disabled={!next}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm bg-[#076dcd] text-white hover:bg-black disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        Next <i className="bi bi-arrow-right"></i>
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Course complete banner */}
            {completionPct === 100 && (
              <div className="mt-8 bg-gradient-to-r from-[#18a54a] to-[#076dcd] text-white rounded-2xl p-6 text-center">
                <i className="bi bi-trophy text-4xl block mb-3"></i>
                <h3 className="text-xl font-bold mb-1">🎉 Course Complete!</h3>
                <p className="text-sm opacity-90 mb-4">
                  Congratulations! You've completed all {lessons.length} lessons in this course.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link
                    to={`/student/certificate/${courseId}`}
                    className="bg-[#f37739] hover:bg-[#e06828] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <i className="bi bi-award-fill"></i> Get Your Certificate
                  </Link>
                  <Link
                    to="/student/dashboard"
                    className="bg-white text-[#076dcd] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors inline-block"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;
