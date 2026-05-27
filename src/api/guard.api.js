import axiosInstance from "./axiosInstance";

const scanQR = (token) => axiosInstance.post("/guard/scan", { token });

export { scanQR };
