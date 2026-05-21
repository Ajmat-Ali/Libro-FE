import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";
import wizardReducer from "./slices/wizardSlice";

const appStore = configureStore({
  reducer: {
    auth: authSlice,
    wizard: wizardReducer,
  },
});

export default appStore;
