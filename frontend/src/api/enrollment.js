import axiosInstance from "./axiosInstance";

export const enrollInCourse = (courseId) =>
  axiosInstance.post("/api/v1/enrollments", { courseId });

export const getMyEnrollments = () =>
  axiosInstance.get("/api/v1/enrollments/my");

export const checkEnrollment = (courseId) =>
  axiosInstance.get(`/api/v1/enrollments/course/${courseId}/check`);

export const getCourseProgress = (courseId) =>
  axiosInstance.get(`/api/v1/progress/course/${courseId}`);

export const updateLessonProgress = (lessonId, isCompleted, watchDurationSeconds = 0) =>
  axiosInstance.put("/api/v1/progress/lesson", { lessonId, isCompleted, watchDurationSeconds });

export const getCourseStudents = (courseId) =>
  axiosInstance.get(`/api/v1/enrollments/course/${courseId}/students`);
