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

// -------------------------------- Member ---------------------------------------
const getMembers = async (params = {}) => {
  const response = await axiosInstance.get("/owner/members", { params });
  return response.data;
};

const reviewMember = async (memberId, data) => {
  const response = await axiosInstance.patch(
    `/owner/members/${memberId}/review`,
    data,
  );
  return response.data;
};

const getOneMember = async (memberId) => {
  const response = await axiosInstance.get(`/owner/members/${memberId}`);
  return response.data;
};

const toggleMemberStatus = async (memberId) => {
  const response = await axiosInstance.patch(
    `/owner/members/${memberId}/toggle-status`,
  );
  return response.data;
};

const addWalkInMember = async (data) => {
  const response = await axiosInstance.post("/owner/members", data);
  return response.data;
};

const updateMember = async (memberId, data) => {
  const response = await axiosInstance.patch(
    `/owner/members/${memberId}`,
    data,
  );
  return response.data;
};

export {
  getOwnerLibrary,
  getOwnerDashboard,
  createLibrary,
  createFloor,
  createSeat,
  createSlot,
  getMembers,
  reviewMember,
  getOneMember,
  toggleMemberStatus,
  addWalkInMember,
  updateMember,
};
