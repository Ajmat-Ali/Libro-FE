import axios from "axios";
import axiosInstance from "./axiosInstance";
import { Meta } from "react-router-dom";

const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

// --------------------------------- Register Student ------------------------------------

const registerStudent = (data) =>
  axiosInstance.post("/auth/register-student", data);
const verifyEmail = (data) => axiosInstance.post("/auth/verify-email", data);
const resendOTP = (data) => {
  return axiosInstance.post("/auth/resend-otp", data);
};
const forgotPassword = (data) =>
  axiosInstance.post("/auth/forgot-password", data);
const resetPassword = (data) =>
  axiosInstance.post("/auth/reset-password", data);
const changePassword = (data) =>
  axiosInstance.patch("/auth/change-password", data);

const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

const refreshToken = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export {
  loginUser,
  logoutUser,
  refreshToken,
  registerStudent,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  changePassword,
};
