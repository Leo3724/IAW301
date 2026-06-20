import axiosInstance from "./axiosInstance";

// --- COURSE FETCHING ---
export const getPublishedCourses = (params = {}) =>
  axiosInstance.get("/api/v1/courses", { params });

export const getCourseById = (id) =>
  axiosInstance.get(`/api/v1/courses/${id}`);

export const getInstructorCourses = () =>
  axiosInstance.get("/api/v1/courses/instructor/my");

export const getLessons = (courseId) =>
  axiosInstance.get(`/api/v1/courses/${courseId}/lessons`);

// --- COURSE MANAGEMENT ---
export const createCourse = (data) =>
  axiosInstance.post("/api/v1/courses", data);

export const updateCourse = (id, data) =>
  axiosInstance.put(`/api/v1/courses/${id}`, data);

export const publishCourse = (id) =>
  axiosInstance.patch(`/api/v1/courses/${id}/publish`);

export const uploadThumbnail = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post(`/api/v1/courses/${id}/thumbnail`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// --- LESSON MANAGEMENT ---
export const createLesson = (data, file) => {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
  if (file) {
    formData.append("file", file);
  }
  
  return axiosInstance.post("/api/v1/lessons", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteLesson = (id) =>
  axiosInstance.delete(`/api/v1/lessons/${id}`);
