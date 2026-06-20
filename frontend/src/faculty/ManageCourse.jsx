import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getCourseById, createCourse, updateCourse, publishCourse, uploadThumbnail } from "../api/courses";
import CourseMetadataForm from "./components/CourseMetadataForm";
import LessonBuilder from "./components/LessonBuilder";

const ManageCourse = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("metadata"); // metadata | lessons

  // Load course if ID exists
  useEffect(() => {
    if (courseId) {
      setLoading(true);
      getCourseById(courseId)
        .then(res => setCourse(res.data.data))
        .catch(() => setError("Failed to load course details. It may not exist or you lack permission."))
        .finally(() => setLoading(false));
    } else {
      // New course template
      setCourse({
        title: "",
        description: "",
        price: 0,
        level: "BEGINNER",
        category: "Programming"
      });
    }
  }, [courseId]);

  const handleSaveDraft = async (formData) => {
    setSaving(true);
    setError("");
    try {
      if (courseId && course) {
        // Update existing
        const res = await updateCourse(courseId, formData);
        setCourse(res.data.data);
      } else {
        // Create new
        const res = await createCourse(formData);
        // Redirect to edit mode
        navigate(`/faculty/manage-course?id=${res.data.data.id}`, { replace: true });
        setCourse(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!courseId) return;
    setPublishing(true);
    try {
      const res = await publishCourse(courseId);
      setCourse(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish course. Ensure you have lessons and a thumbnail.");
    } finally {
      setPublishing(false);
    }
  };

  const handleThumbnailUpload = async (file) => {
    if (!courseId) {
      alert("Please save the course draft first before uploading a thumbnail.");
      return;
    }
    setSaving(true);
    try {
      await uploadThumbnail(courseId, file);
      // Reload course
      const res = await getCourseById(courseId);
      setCourse(res.data.data);
    } catch (err) {
      alert("Failed to upload thumbnail.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin h-8 w-8 border-b-2 border-[#076dcd] mx-auto rounded-full"></div></div>;
  if (!course) return null;

  const isPublished = course.status === "PUBLISHED";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/faculty/courses" className="text-gray-500 hover:text-black text-sm mb-2 inline-block">
            <i className="bi bi-arrow-left me-1"></i> Back to My Courses
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-[#222e48]">
            {courseId ? `Managing: ${course.title || "Course"}` : "Create New Course"}
          </h1>
          {courseId && (
            <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-bold ${
              isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              STATUS: {course.status || 'DRAFT'}
            </span>
          )}
        </div>

        {courseId && !isPublished && (
          <button 
            onClick={handlePublish}
            disabled={publishing}
            className="bg-[#18a54a] text-white px-6 py-2.5 rounded-full font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {publishing ? "Publishing..." : "Publish Course Content"}
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3">
          <i className="bi bi-exclamation-circle-fill text-lg flex-shrink-0 mt-0.5"></i>
          <div>
            <strong>Error:</strong> {error}
            {error.includes("403") || error.includes("Forbidden") ?
              <p className="mt-1">You must be logged in as <strong>faculty@learnhub.com</strong> (INSTRUCTOR role) to create courses.</p> : null}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#ebecef] mb-6">
        <button 
          onClick={() => setActiveTab("metadata")}
          className={`pb-3 px-4 font-semibold text-sm transition-colors ${activeTab === 'metadata' ? 'text-[#076dcd] border-b-2 border-[#076dcd]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          1. Course Information
        </button>
        <button 
          onClick={() => {
            if (!courseId) alert("Save your draft first to unlock Curriculum Builder!");
            else setActiveTab("lessons");
          }}
          disabled={!courseId}
          className={`pb-3 px-4 font-semibold text-sm transition-colors ${!courseId ? 'opacity-40 cursor-not-allowed' : activeTab === 'lessons' ? 'text-[#076dcd] border-b-2 border-[#076dcd]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          2. Curriculum Details
        </button>
      </div>

      {/* Tab Payload */}
      {activeTab === "metadata" ? (
        <CourseMetadataForm 
          course={course} 
          onSave={handleSaveDraft} 
          isSaving={saving} 
          onUploadImage={handleThumbnailUpload}
        />
      ) : (
        <LessonBuilder courseId={courseId} isPublished={isPublished} />
      )}
    </div>
  );
};

export default ManageCourse;
