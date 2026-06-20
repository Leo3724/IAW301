import React, { useState, useEffect, useCallback } from "react";
import { getLessons, createLesson, deleteLesson } from "../../api/courses";

const LessonBuilder = ({ courseId, isPublished }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    contentType: "VIDEO",
    orderIndex: 0,
    durationSeconds: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchLessons = useCallback(async () => {
    try {
      const res = await getLessons(courseId);
      const sorted = (res.data.data || []).sort((a,b) => a.orderIndex - b.orderIndex);
      setLessons(sorted);
      if (sorted.length > 0) {
        setLessonForm(p => ({ ...p, orderIndex: sorted[sorted.length - 1].orderIndex + 1 }));
      }
    } catch (err) {
      setError("Could not load lessons.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload as lesson content.");
      return;
    }
    setAdding(true);
    try {
      const payload = {
        courseId,
        ...lessonForm
      };
      await createLesson(payload, selectedFile);
      // Reset form
      setSelectedFile(null);
      setLessonForm(p => ({ ...p, title: "", durationSeconds: 0 }));
      setShowAddForm(false);
      // Refresh list
      await fetchLessons();
    } catch (err) {
      alert("Failed to create lesson. Please ensure the file isn't too large.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await deleteLesson(id);
      setLessons(lessons.filter(l => l.id !== id));
    } catch (err) {
      alert("Failed to delete lesson.");
    }
  };

  // ContentType icons
  const icons = {
    VIDEO: "bi-play-circle-fill text-blue-500",
    DOCUMENT: "bi-file-text-fill text-red-500",
    QUIZ: "bi-patch-question-fill text-orange-500"
  };

  if (loading) return <div className="p-4">Loading curriculum...</div>;

  return (
    <div className="bg-white p-6 rounded-xl border border-[#ebecef]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#222e48]">Course Curriculum</h2>
          <p className="text-sm text-gray-500">Add lessons to structure your course material.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#076dcd] text-white px-4 py-2 rounded-full hover:bg-black transition-colors font-medium text-sm"
        >
          {showAddForm ? "Cancel" : "+ Add Content"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Add New Lesson Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6 space-y-4">
          <h3 className="font-bold text-[#222e48]">New Lesson Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Lesson Title</label>
              <input type="text" required value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} className="w-full text-sm p-2 border rounded" placeholder="e.g. Introduction to Variables" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Content Type</label>
              <select value={lessonForm.contentType} onChange={e => setLessonForm({...lessonForm, contentType: e.target.value})} className="w-full text-sm p-2 border rounded bg-white">
                <option value="VIDEO">Video File (.mp4)</option>
                <option value="DOCUMENT">Document (.pdf)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Duration (Seconds) - Required for progress tracking</label>
              <input type="number" min="0" required value={lessonForm.durationSeconds} onChange={e => setLessonForm({...lessonForm, durationSeconds: Number(e.target.value)})} className="w-full text-sm p-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Upload File (Max 15MB)</label>
              <input type="file" required onChange={e => setSelectedFile(e.target.files[0])} className="w-full text-sm p-1.5 border rounded bg-white" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={adding} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
              {adding ? "Uploading to Cloud..." : "Save Lesson"}
            </button>
          </div>
        </form>
      )}

      {/* Lessons List View */}
      {lessons.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 border border-dashed rounded-lg">
          <p className="text-gray-500">No curriculum added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                  {lesson.orderIndex}
                </div>
                <div>
                  <h4 className="font-semibold text-[#222e48]">{lesson.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><i className={icons[lesson.contentType] || "bi-star"}></i> {lesson.contentType}</span>
                    <span><i className="bi bi-clock"></i> {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDelete(lesson.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                  title="Delete Lesson"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonBuilder;
