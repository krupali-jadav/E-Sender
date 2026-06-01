import { removeUserDetails } from "./reducers/Reducer.user";

export function logout() {
  return async (dispatch) => {
    try {
      dispatch(removeUserDetails());
    } catch (error) {
      console.log(error)
    }
  };
}

export const getPanelDetails = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const lang = state?.app?.lang;
    const { data } = await axiosInstance.get("panel/details/telecaller");
    if (data?.status) {
      dispatch(setPanel(data?.panel));
      if (lang == null) {
        dispatch(changeLanguage(data?.panel?.crm?.language ?? "en"));
        i18next.changeLanguage(data?.panel?.crm?.language ?? "en");
      }
    } else {
      dispatch(setPanel(null));
    }
  };
};