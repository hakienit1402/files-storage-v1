import {
  GET_LIST,
  GET_LIST_FAIL,
  GET_CURRENT,
  GET_LIST_SUCCESS,
  UPDATE_STORE_TMP,
  GET_PARENT,
  GET_USED_MEMORY
} from "../actions/type";

export const fileReducer = (
  state = { loading: false, datas: [], error: '' },
  action
) => {
  switch (action.type) {
    case GET_LIST:
      return { loading: true };
    case GET_LIST_SUCCESS:
      return { loading: false, datas: action.payload };
    case GET_LIST_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_STORE_TMP:
      return { loading: false, datas: action.payload };
    default:
      return state;
  }
};
export const fileTypeReducer = (state = {}, action) => {
  if (action.type === GET_CURRENT)
    return { type: action.payload };
  else {
    return state;
  }
}
export const parentReducer = (state = {}, action) => {
  if (action.type === GET_PARENT) {
    return { parent: action.payload };
  } else {
    return state;
  }
}

export const usedMemoryReducer = (state = {}, action) => {
  if (action.type === GET_USED_MEMORY) {
    return { memory: action.payload };
  } else {
    return state;
  }
}