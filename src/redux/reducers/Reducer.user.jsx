import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    details: {},
    token: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.details = action.payload;
            state.token = action.payload.token;
            
        },

        removeUserDetails: (state) => {
            state.details = {};
            state.token = null;
        },
    },
});

export const {
    setUserDetails,
    removeUserDetails,
} = userSlice.actions;

export default userSlice.reducer;