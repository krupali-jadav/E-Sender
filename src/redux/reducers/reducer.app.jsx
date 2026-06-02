import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: false,
  panel: {},
  lang: "en",
  currency: "INR",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
     setTheme: (state, action) => {
      state.theme = action.payload;
    },
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
    changeCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setPanel: (state, action) => {
      state.panel = action.payload;
    },
  },
});

export const {
  setTheme,
  changeLanguage,
  changeCurrency,
  setPanel,

} = appSlice.actions;

export default appSlice.reducer;
