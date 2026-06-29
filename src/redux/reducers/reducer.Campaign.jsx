import { createSlice } from "@reduxjs/toolkit";

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    contacts: [],
  },

  reducers: {
    setCampaignContacts: (state, action) => {
      state.contacts = action.payload;
    },

    addCampaignContacts: (state, action) => {
      const existingIds = new Set(state.contacts.map(c => c._id));

      const newContacts = action.payload.filter(
        (c) => !existingIds.has(c._id)
      );

      state.contacts = [...state.contacts, ...newContacts];
    },

    clearCampaignContacts: (state) => {
      state.contacts = [];
    },
  },
});

export const {
  setCampaignContacts,
  addCampaignContacts,
  clearCampaignContacts,
} = campaignSlice.actions;

export default campaignSlice.reducer;