import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setLibrary: (state, action) => {
      return action.payload;
    },
  },
});

export const { setLibrary } = librarySlice.actions;
export default librarySlice.reducer;
