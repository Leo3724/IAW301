import axiosInstance from "./axiosInstance";

// Admin - Get all users (paginated, with role filter)
export const getAllUsers = (params = {}) =>
  axiosInstance.get("/api/v1/users", { params });

// Admin - Update user status (ACTIVE, INACTIVE, SUSPENDED)
export const updateUserStatus = (id, status) =>
  axiosInstance.put(`/api/v1/users/${id}/status`, null, { params: { status } });

// Admin - Delete a user
export const deleteUser = (id) =>
  axiosInstance.delete(`/api/v1/users/${id}`);

// Get own profile
export const getMyProfile = () =>
  axiosInstance.get("/api/v1/users/me");

// Update own profile
export const updateMyProfile = (data) =>
  axiosInstance.put("/api/v1/users/me", data);
