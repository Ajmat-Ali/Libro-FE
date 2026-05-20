import axios from "axios";
import axiosInstance from "./axiosInstance";
import { Meta } from "react-router-dom";

const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

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

export { loginUser, logoutUser, refreshToken };
