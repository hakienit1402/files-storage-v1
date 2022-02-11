import axios from "axios";
import {
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_REQUEST
} from "../constants/authConstants";
import { GET_CURRENT, GET_PARENT } from "./type";
const HEAD_URI = "http://localhost:8080/api";
export const updateTotalMemory = (price, user) => (dispatch) => {
    let config = {
        method: 'get',
        url: `${HEAD_URI}/user/total/${price}`,
        headers: {
            'Authorization': `Bearer ${user.token}`,
        }
    };
    try {
        axios(config)
            .then((res) => {
                console.log(res, 'sizeee');
                user.acc_pkg_size = res.data;
                dispatch({ type: LOGIN_SUCCESS, payload: user });
            }).catch(er => {
                console.log(er);
            })
    } catch (err) {
        console.log(err);
    }

}
export const login = (username, password) => (dispatch) => {
    // dispatch({ type: LOGIN_REQUEST, payload: { username, password } })
    axios
        .post(
            //url
            `${HEAD_URI}/signin`, { username, password }
        )
        .then((res) => {
            dispatch({ type: LOGIN_SUCCESS, payload: res.data });
            dispatch({ type: GET_PARENT, payload: '' });
            dispatch({ type: GET_CURRENT, payload: 'pictures' });
        })
        .catch(() => {
            dispatch({ type: LOGIN_FAIL, payload: "Tài khoản hoặc mật khẩu không chính xác" });
        }
        )
};
export const register = (fullname, username, email, password) => (dispatch) => {
    dispatch({ type: REGISTER_REQUEST, payload: { fullname, username, email, password } })
    axios
        .post(
            //url
            //   "https://file-storage-2021.herokuapp.com/musics/thanhtri98"
        )
        .then((res) => {
            //   dispatch({ type: REGISYER_SUCCESS, payload: res.data.info });
            // Cookies.set('user-data',JSON.stringify(res.data))
        })
        .catch((err) => {
            // dispatch({ type: LOGIN_SUCCESS, payload: err.message });
        }
        )
}
export const logout = () => (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch({ type: GET_CURRENT });
    dispatch({ type: GET_PARENT });
}

export const checkPwd = async (password, username, token) => {
    let config = {
        method: 'post',
        url: `${HEAD_URI}/user/checkPwd`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        data: {
            username,
            password
        }
    };
    try {
        const res = await axios(config);
        return res;
    } catch (err) {
        console.log(err);
    }
}


export const sendMail = (email) => {
    console.log(email);
    let config = {
        method: 'post',
        url: `${HEAD_URI}/mail`,
        headers: {
            'Content-Type': 'text/plain'
        },
        data: email
    };
    try {
        axios(config);
    } catch (er) {
        console.log(er);
    }
}
export const checkOTP = async (otp, email) => {
    let config = {
        method: 'post',
        url: `${HEAD_URI}/otp`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            otp,
            email
        }
    };
    try {
        const res = await axios(config);
        return res;
    } catch (err) {
        console.log(err);
    }
}
export const updatePwd = (email, pwd) => {
    let config = {
        method: 'put',
        url: `${HEAD_URI}/pwd`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            email,
            pwd
        }
    };
    return new Promise((resolve, reject) => {
        try {
            axios(config)
                .then(res => resolve(res))
                .catch(() => reject())
        } catch (err) {
            console.log('FAIL ', err);
        }

    });


}


//
export const uuidv4 = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}