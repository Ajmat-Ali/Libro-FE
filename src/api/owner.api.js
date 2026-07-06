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

// ---------------------------------- Floor and Seats ---------------------------
const createFloor = async (data) => {
  const response = await axiosInstance.post("/owner/floors", data);
  return response.data;
};

const updateFloor = async (floorData) => {
  const { value, id } = floorData;
  return await axiosInstance.patch(`owner/floors/${id}`, { name: value });
};

const deleteFloor = async (id) => {
  return await axiosInstance.delete(`owner/floors/${id}`);
};

const createSeat = async (floorId, data) => {
  const response = await axiosInstance.post(
    `/owner/floors/${floorId}/seats`,
    data,
  );
  return response.data;
};

const createBulkSeats = async (floorId, seats) => {
  return axiosInstance.post(`owner/floors/${floorId}/seats/bulk`, seats);
};

const updateSeat = async (seatUpdateData) => {
  const { floorId, seatId, data } = seatUpdateData;
  return axiosInstance.patch(`owner/floors/${floorId}/seats/${seatId}`, data);
};

const updateSeatStatus = async (floorId, seatId, data) => {
  return axiosInstance.patch(
    `owner/floors/${floorId}/seats/${seatId}/status`,
    data,
  );
};

const deleteSeat = async (floorId, seatId) => {
  return axiosInstance.delete(`owner/floors/${floorId}/seats/${seatId}`);
};

// -------------------------------- Slots --------------------------

const createSlot = async (data) => {
  const response = await axiosInstance.post("/owner/slots", data);
  return response.data;
};

const updateSlot = async (slotId, data) => {
  return axiosInstance.patch(`/owner/slots/${slotId}`, data);
};

const deleteSlot = async (slotId) => {
  return axiosInstance.delete(`/owner/slots/${slotId}`);
};

const togglePlanStatus = async () => {
  return;
};

const getSeatGrid = async (floorId, data) => {
  const response = await axiosInstance.get(
    `/owner/floors/${floorId}/seat-grid`,
    {
      params: {
        slot: data.slot,
        date: data.date,
      },
    },
  );
  return response;
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

// --------------------------------------------------- Bookings -----------------------

// API functions to ADD to src/api/owner.api.js:

const getFloors = () => axiosInstance.get("/owner/floors");

const getSeats = (floorId) =>
  axiosInstance.get(`/owner/floors/${floorId}/seats`);

const getSlots = () => axiosInstance.get("/owner/slots");

const getPlans = (params) => axiosInstance.get("/owner/plans", { params });

const getBookings = (params) =>
  axiosInstance.get("/owner/bookings", { params });

const createBooking = (data) => axiosInstance.post("/owner/bookings", data);

const cancelBooking = (id, data) =>
  axiosInstance.patch(`/owner/bookings/${id}/cancel`, data);

const extendBooking = (id, data) =>
  axiosInstance.patch(`/owner/bookings/${id}/extend`, data);

const getOneBooking = (id) => axiosInstance.get(`/owner/bookings/${id}`);

//------------------------------- QR --------------------------------------
const getStudentQRList = (memberId) =>
  axiosInstance.get(`/owner/members/${memberId}/qr`);

const getStudentQRImage = (memberId, qrId) =>
  axiosInstance.get(`/owner/members/${memberId}/qr/${qrId}`, {
    responseType: "blob",
  });

// ------------------------------- Library --------------------------------
const updateLibrary = (data) => axiosInstance.patch("/owner/library", data);
const uploadLogo = (form) => axiosInstance.patch("/owner/library/logo", form);
const addHoliday = (data) =>
  axiosInstance.post("/owner/library/holidays", data);
const removeHoliday = (id) =>
  axiosInstance.delete(`/owner/library/holidays/${id}`);
const getGuards = () => axiosInstance.get("/owner/guards");
const createGuard = (data) => axiosInstance.post("/owner/guards", data);
const deactivateGuard = (id) => axiosInstance.delete(`/owner/guards/${id}`);

// ----------------------------------- Payment --------------------------------------------

export const getPayments = (params) =>
  axiosInstance.get("/payments", { params });

export const getOnePayment = (paymentId) =>
  axiosInstance.get(`/payments/${paymentId}`);

export const recordCashPayment = (paymentId) =>
  axiosInstance.post(`/payments/${paymentId}/record-cash`);

export const downloadReceipt = async (paymentId) => {
  const response = await axiosInstance.get(`/payments/${paymentId}/receipt`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `receipt-${paymentId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
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
  getFloors,
  getSeats,
  getSlots,
  getPlans,
  getBookings,
  createBooking,
  cancelBooking,
  extendBooking,
  getOneBooking,
  getStudentQRList,
  getStudentQRImage,
  updateLibrary,
  uploadLogo,
  addHoliday,
  removeHoliday,
  getGuards,
  createGuard,
  deactivateGuard,
  getSeatGrid,
  createBulkSeats,
  updateSeatStatus,
  deleteSeat,
  updateSeat,
  updateFloor,
  deleteFloor,
  togglePlanStatus,
  updateSlot,
  deleteSlot,
};
