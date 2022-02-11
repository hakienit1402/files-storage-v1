import {
  GET_LIST,

  GET_LIST_FAIL, GET_LIST_MUSIC,

  GET_LIST_SUCCESS, POST_DELETE_MUSIC,

  POST_DELETE_MUSIC_FAIL, POST_DELETE_MUSIC_SUCCESS, POST_EDIT_MUSIC,

  POST_EDIT_MUSIC_FAIL, POST_EDIT_MUSIC_SUCCESS,

  UPDATE_STORE_MUSIC_TMP,
  UPDATE_STORE_TMP
} from "../actions/type";

const musicReducer = (
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
    case POST_EDIT_MUSIC:
      return { loading: true };
    case UPDATE_STORE_TMP:
      return { loading: false, datas: action.payload };
    case GET_LIST_MUSIC:
      return state;
    case POST_EDIT_MUSIC_SUCCESS:
      return { loading: false, datas: action.payload };
    case POST_EDIT_MUSIC_FAIL:
      return { loading: false, error: action.payload };
    case POST_DELETE_MUSIC:
      return { loading: true };
    case POST_DELETE_MUSIC_SUCCESS:
      return { loading: false, musics: action.payload };
    case POST_DELETE_MUSIC_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export default musicReducer;
