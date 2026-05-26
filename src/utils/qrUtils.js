import axiosInstance from "../api/axiosInstance";

export const fetchQRAsBase64 = async (memberId, bookingId) => {
  try {
    const listRes = await axiosInstance.get(`/owner/members/${memberId}/qr`);

    const qrs = listRes.data.qrCodes ?? [];

    const qr = qrs.find((q) => q?.booking?.bookingId === bookingId);
    if (!qr) return null;

    const imgRes = await axiosInstance.get(
      `/owner/members/${memberId}/qr/${qr.qrId}`,
      { responseType: "blob" },
    );
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imgRes.data);
    });
  } catch {
    return null;
  }
};
