import { createSlice } from "@reduxjs/toolkit";

const domainSlice = createSlice({
  name: "domain",
  initialState: {
    selectedDomain: "example.com",
  },
  reducers: {
    setSelectedDomain: (state, action) => {
      state.selectedDomain = action.payload;
    },
  },

  
});

export const { setSelectedDomain } = domainSlice.actions;
export default domainSlice.reducer;