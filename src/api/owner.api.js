import axiosInstance from "./axiosInstance";

const getOwnerLibrary = async () => {
  const response = await axiosInstance.get("/owner/library");
  return response.data;
};

const getOwnerDashboard = async () => {
  const response = await axiosInstance.get("/owner/dashboard");
  return response.data;
};

export { getOwnerLibrary, getOwnerDashboard };
