import axiosInstance from "./axiosInstance";

export const registerUser = (data) =>
  axiosInstance.post("/api/v1/auth/register", data);

export const loginUser = (data) =>
  axiosInstance.post("/api/v1/auth/login", data);

export const verifyOtp = (data) =>
  axiosInstance.post("/api/v1/auth/verify-otp", data);

export const resendOtp = (email) =>
  axiosInstance.post("/api/v1/auth/resend-otp", { email });

export const forgotPassword = (email) =>
  axiosInstance.post("/api/v1/auth/forgot-password", { email });

export const verifyPasswordResetOtp = (data) =>
  axiosInstance.post("/api/v1/auth/forgot-password/verify-otp", data);

export const resetPassword = (data) =>
  axiosInstance.post("/api/v1/auth/forgot-password/reset", data);
