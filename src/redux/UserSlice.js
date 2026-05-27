import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    details: {},
};

const userSlice = createSlice({
    name: 'users',

    initialState,

    reducers: {
        setUserDetails: (state, action) => {
            state.details = action.payload;
        },

        clearUserDetails: (state) => {
            state.details = {};
        },
    },
});

export const {
    setUserDetails,
    clearUserDetails,
} = userSlice.actions;

export default userSlice.reducer;