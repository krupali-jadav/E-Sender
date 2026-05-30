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