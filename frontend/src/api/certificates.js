import axiosInstance from "./axiosInstance";

export const issueCertificate = (courseId) =>
  axiosInstance.post(`/api/v1/certificates/${courseId}`);

export const getCertificate = (courseId) =>
  axiosInstance.get(`/api/v1/certificates/${courseId}`);

export const getMyCertificates = () =>
  axiosInstance.get("/api/v1/certificates");

export const verifyCertificate = (code) =>
  axiosInstance.get(`/api/v1/certificates/verify/${code}`);
