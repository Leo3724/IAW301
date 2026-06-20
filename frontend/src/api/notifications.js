import axiosInstance from "./axiosInstance";

export const getMyNotifications = () =>
  axiosInstance.get("/api/v1/notifications/my");

export const markNotificationRead = (id) =>
  axiosInstance.put(`/api/v1/notifications/${id}/read`);

export const sendAnnouncement = (title, message) =>
  axiosInstance.post("/api/v1/notifications/send-announcement", { title, message });
