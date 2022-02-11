import axios from "axios";
import { LOGOUT } from "../constants/authConstants";
import {
  GET_MUSIC_SUCCESS,
  POST_DELETE_MUSIC,
  POST_DELETE_MUSIC_FAIL, POST_EDIT_MUSIC_FAIL, REQUEST_GET_MUSIC,
  UPDATE_STORE_MUSIC_TMP
} from "./type";

const HEAD_URI = "http://localhost:8080/api/user";
// const data = JSON.parse(localStorage.getItem('data'));
// type: musics, pictures, videos
// export const getListMusics = (type,data, parent) => (dispatch) => {
//   try {
//     // dispatch({ type: REQUEST_GET_MUSIC });

//     var config = {
//       method: 'get',
//       url: `${HEAD_URI}/${type}/${data.username}/${parent}`,
//       headers: {
//         'Authorization': `Bearer ${data.token}`
//       }
//     };

//     axios(config)
//       .then((res) => {
//         dispatch({ type: GET_MUSIC_SUCCESS, payload: res.data });
//       }).catch(() => {
//         dispatch({ type: LOGOUT });
//       });
//   } catch (error) {
//     dispatch({ type: LOGOUT });
//   }
// };
// export const updateMusicStore = (musics, name, index) => (dispatch) => {
//   let dataAlterUpdate = [...musics];
//   let oldName = musics[index].name;
//   dataAlterUpdate[index].name = name;
//   const bodyData = {
//     id: musics[index].id,
//     new_name: name,
//     old_name: oldName,
//     extension: musics[index].extension,
//     creator: musics[index].creator
//   }
//   dispatch({ type: UPDATE_STORE_MUSIC_TMP, payload: dataAlterUpdate });
//   // id, new_name,old_name,extension,creator

//   // dispatch({ type: POST_EDIT_MUSIC });
//   axios
//     .put(`${HEAD_URI}/name`, bodyData
//       //   dataAlterUpdate[index]
//     )
//     .then((res) => {
//       //   console.log(res)
//       dispatch({ type: UPDATE_STORE_MUSIC_TMP, payload: dataAlterUpdate });
//     }).catch((err) => {
//       dispatch({ type: UPDATE_STORE_MUSIC_TMP, payload: musics });
//       // dispatch({ type: POST_EDIT_MUSIC_FAIL, payload:err.message });
//       // console.log("iiiiiiii")
//     })

// };
export const deleteMusicItem = (listkey) => (dispatch) => {

  try {
    dispatch({ type: POST_DELETE_MUSIC });
    // let dataAlterDelete = [...musics]
    // console.log(dataAlterDelete)
    // console.log(data);
    // const dataDelete = data.filter(	res.data =>
    // 	data
    // );

    // axios
    // 	.post(
    // 		'https://file-storage-2021.herokuapp.com/musics/deletemussic',
    // data
    // 	)
    // 	.then((res) => {
    // dispatch({ type: POST_DELETE_MUSIC_SUCCESS, payload: res.data });
    // });
  } catch (error) {
    dispatch({ type: POST_DELETE_MUSIC_FAIL, payload: error.message });
  }
};
