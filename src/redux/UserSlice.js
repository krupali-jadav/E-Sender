import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    details: null,
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserDetails(state, action) {
            state.details = action.payload
        },
        clearUserDetails(state) {
            state.details = null
        },
    },
})

export const { setUserDetails, clearUserDetails } = userSlice.actions
export default userSlice.reducer
