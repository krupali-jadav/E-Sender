// Minimal user reducer placeholder
export const SET_USER_DETAILS = 'SET_USER_DETAILS';

const initialState = {
    details: null,
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER_DETAILS:
            return { ...state, details: action.payload };
        default:
            return state;
    }
}

export const setUserDetails = (payload) => ({ type: SET_USER_DETAILS, payload });
