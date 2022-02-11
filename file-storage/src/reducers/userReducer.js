import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from "../constants/authConstants";

const userReducer = (state = { }, action) => {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_REQUEST:
      return {
        ...state,

      };
    case REGISTER_SUCCESS:
      return {
        ...state,

      };
    case REGISTER_FAIL:
      return {
        ...state,

      };
    case LOGIN_REQUEST:
      return {
        
        loading: true,

        // isLoggedIn: true,
        // user: payload.user,
      };
    case LOGIN_SUCCESS:
      return {
        users: action.payload,
        error: null
      };
    case LOGIN_FAIL:
      return {
         users: null, error: action.payload
      };
    case LOGOUT:
      return {
        users: null
      };
    default:
      return state;
  }
};
export default userReducer;
