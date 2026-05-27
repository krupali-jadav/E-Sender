// Minimal app reducer for UI-only state (no theme/language)
const initialState = {
    panel: { telecaller: { logo: '' } },
};

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}
