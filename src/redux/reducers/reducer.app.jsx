import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: false,
  panel: {},
  lang: "en",
  currency: "INR",
  selectedProject: null,
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
    changePageTitle: (state, action) => {
      state.pageTitle = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
});

export const {
  setTheme,
  changeLanguage,
  changeCurrency,
  setPanel,
  changePageTitle,
  setSelectedProject,

} = appSlice.actions;

export default appSlice.reducer;
