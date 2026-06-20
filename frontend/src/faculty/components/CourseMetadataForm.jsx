import React, { useState, useEffect } from "react";

const CourseMetadataForm = ({ course, onSave, isSaving, onUploadImage }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    level: "BEGINNER",
    category: ""
  });

  // Sync incoming state
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || 0,
        level: course.level || "BEGINNER",
        category: course.category || ""
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Data Form */}
      <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-[#ebecef]">
        <div>
          <label className="block text-sm font-semibold text-[#222e48] mb-2">Course Title</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#076dcd]" 
            placeholder="e.g. Master React in 30 Days"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#222e48] mb-2">Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#076dcd]" 
            placeholder="Explain what the students will learn..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#222e48] mb-2">Price (₹)</label>
            <input 
              type="number" 
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#076dcd]" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#222e48] mb-2">Difficulty Level</label>
            <select 
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#076dcd]"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#222e48] mb-2">Category</label>
            <input 
              type="text" 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#076dcd]" 
              placeholder="e.g. Design, Web Dev"
            />
          </div>
        </div>

        <button 
          onClick={() => onSave(formData)}
          disabled={isSaving || !formData.title.trim()}
          className="bg-[#076dcd] text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : course?.id ? "Update Course Details" : "Save & Continue"}
        </button>
      </div>

      {/* Right Media Upload */}
      <div className="bg-white p-6 rounded-xl border border-[#ebecef] h-fit">
        <h3 className="font-bold text-[#222e48] mb-4">Course Thumbnail</h3>
        <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden mb-4">
          {course?.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <i className="bi bi-image text-3xl text-gray-400 mb-2 block"></i>
              <p className="text-xs text-gray-500">1280x720 recommended. Safe to upload after saving draft.</p>
            </div>
          )}
        </div>
        <input 
          type="file" 
          id="thumbUpload" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange}
        />
        <label 
          htmlFor="thumbUpload" 
          className="block w-full text-center border border-[#076dcd] text-[#076dcd] hover:bg-[#076dcd] hover:text-white transition-colors cursor-pointer py-2 rounded-full font-medium text-sm"
        >
          {course?.thumbnailUrl ? "Change Thumbnail" : "Upload Image"}
        </label>
      </div>
    </div>
  );
};

export default CourseMetadataForm;
