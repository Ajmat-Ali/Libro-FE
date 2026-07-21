import axiosInstance from "./axiosInstance";

const getStudentDashboard = async () => {
  return await axiosInstance.get("/student/dashboard");
};

const getOneBooking = (bookingId) =>
  axiosInstance.get(`/student/bookings/${bookingId}`).then((res) => res.data);

const getStudentProfile = () =>
  axiosInstance.get("/student/profile").then((res) => res.data);

const fetchMyQRAsBase64 = async (qrId) => {
  console.log(qrId);
  try {
    const imgRes = await axiosInstance.get(`/student/my-qr/${qrId}`, {
      responseType: "blob",
    });

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imgRes.data);
    });
  } catch {
    return null;
  }
};

const downloadMyQr = (qrId) =>
  axiosInstance.get(`/student/my-qr/${qrId}/download`, {
    responseType: "blob",
  });

const getStudentFloors = () =>
  axiosInstance.get("/student/floors").then((res) => res.data);

const getStudentSlots = () =>
  axiosInstance.get("/student/slots").then((res) => res.data);

const getStudentSeatGrid = (floorId, { slotId, date }) =>
  axiosInstance
    .get(`/student/floor/${floorId}/seat-grid`, {
      params: { slot: slotId, date },
    })
    .then((res) => res.data);

const getAllPLans = async () => {
  return await axiosInstance.get(`/student/plans`);
};

const initiateStudentBooking = async (data) => {
  return await axiosInstance.post(`/student/bookings//initiate`, data);
};

export {
  getStudentDashboard,
  getOneBooking,
  getStudentProfile,
  fetchMyQRAsBase64,
  downloadMyQr,
  getStudentFloors,
  getStudentSlots,
  getStudentSeatGrid,
  getAllPLans,
  initiateStudentBooking,
};
