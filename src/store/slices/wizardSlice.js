import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 1,
  libraryId: null,
  createdFloors: [],
};

const wizardSlice = createSlice({
  name: "wizard",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setLibraryId: (state, action) => {
      state.libraryId = action.payload;
    },
    addFloor: (state, action) => {
      state.createdFloors.push(action.payload);
    },
    clearWizard: () => initialState,
  },
});

export const { setCurrentStep, setLibraryId, addFloor, clearWizard } =
  wizardSlice.actions;
export default wizardSlice.reducer;
