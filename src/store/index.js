import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";

const appStore = configureStore({
  reducer: { auth: authSlice },
});

export default appStore;
