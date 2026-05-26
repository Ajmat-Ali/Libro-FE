import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";
import wizardReducer from "./slices/wizardSlice";
import librarySlice from "./slices/library";

const appStore = configureStore({
  reducer: {
    auth: authSlice,
    wizard: wizardReducer,
    library: librarySlice,
  },
});

export default appStore;
