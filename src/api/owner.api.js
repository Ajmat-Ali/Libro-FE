import axiosInstance from "./axiosInstance";

const getOwnerLibrary = async () => {
  const response = await axiosInstance.get("/owner/library");
  return response.data;
};

const getOwnerDashboard = async () => {
  const response = await axiosInstance.get("/owner/dashboard");
  return response.data;
};

const createLibrary = async (data) => {
  const response = await axiosInstance.post("/owner/library", data);
  return response.data;
};

const createFloor = async (data) => {
  const response = await axiosInstance.post("/owner/floors", data);
  return response.data;
};

const createSeat = async (floorId, data) => {
  const response = await axiosInstance.post(
    `/owner/floors/${floorId}/seats`,
    data,
  );
  return response.data;
};

const createSlot = async (data) => {
  const response = await axiosInstance.post("/owner/slots", data);
  return response.data;
};

export {
  getOwnerLibrary,
  getOwnerDashboard,
  createLibrary,
  createFloor,
  createSeat,
  createSlot,
};
