import axios from "axios";
import { LOGOUT } from "../constants/authConstants";
import {
    GET_CURRENT,
    GET_LIST,
    GET_LIST_SUCCESS,
    GET_PARENT,
    GET_USED_MEMORY,
    UPDATE_STORE_TMP
} from "./type";

export const updateType = (type) => (dispatch) => {
    dispatch({ type: GET_CURRENT, payload: type });
}
export const updateParent = (parent) => (dispatch) => {
    dispatch({ type: GET_PARENT, payload: parent });
}

const HEAD_URI = "http://localhost:8080/api/user";

export const moveFiles = (keys = [], type = '', new_parent = '', token = '') => {
    let data = keys.map(e => {
        return {
            id: e
        }
    })
    let config = {
        method: 'put',
        url: `${HEAD_URI}/${type}/move`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: {
            new_parent,
            datas: data
        }
    }
    return new Promise((resolve, reject) => {
        try {
            axios(config)
                .then(() => resolve())
                .catch(() => reject())
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

export const getListSearch = async (creator, token, query) => {
    let config = {
        method: 'get',
        url: `${HEAD_URI}/search/${creator}/${query}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const res = await axios(config);
        return res;
    } catch (e) {
        console.log(e);
        return [];
    }
}
export const getListSharedOwner = async (type, user) => {
    let config = {
        method: 'get',
        url: `${HEAD_URI}/shared/${type}/owner/${user.username}`,
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    };
    try {
        const data = await axios(config)
        return data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}
export const deleteSharedById = async (id, type, token) => {
    let config = {
        method: 'post',
        url: `${HEAD_URI}/shared/${type}/delete`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: id
    };
    try {
        const res = await axios(config);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
}
export const addReceiver = async (type, user, receivers, file_ids) => {
    let config = {
        method: 'post',
        url: `${HEAD_URI}/shared/${type}`,
        headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        data: {
            owner: user.username,
            receivers: receivers,
            file_ids: file_ids
        }
    };
    try {
        const res = await axios(config);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }

}
export const findUser = async (text, token) => {
    let config = {
        method: 'get',
        url: `${HEAD_URI}/shared/${text}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const data = await axios(config);
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}
// type: musics, pictures, videos
export const getListDatas = (typeFile, user, parent, state = 1, shared) => (dispatch) => {
    let url;
    if (!shared) {
        url = typeFile === 'trash' ? `${HEAD_URI}/${typeFile}/${user.username}`
            : typeFile === 'shared' ? `${HEAD_URI}/${typeFile}/all/${user.username}` : `${HEAD_URI}/${typeFile}/${state}/${user.username}/${parent}`;
    } else {
        url = `${HEAD_URI}/${typeFile}/shared/${user.username}/${parent}`;
    }
    try {
        dispatch({ type: GET_LIST });
        let config = {
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        };
        axios(config)
            .then((res) => {
                let data = res.data;
                if (typeFile === 'trash')
                    data = transformDataTrash(data);
                if (typeFile !== 'shared')
                    data.sort((a, b) => { return new Date(b.modifyDate) - new Date(a.modifyDate) });
                dispatch({ type: GET_LIST_SUCCESS, payload: data });
            }).catch(() => {
                dispatch({ type: LOGOUT });
            });
    } catch (error) {
        dispatch({ type: LOGOUT });
    }
};
const formatDateTime = () => {
    let d = new Date();
    return d.getFullYear() + '-' +
        ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
        ('0' + d.getDate()).slice(-2) + ' ' +
        ('0' + d.getHours()).slice(-2) + ':' +
        ('0' + d.getMinutes()).slice(-2) + ':' +
        ('0' + d.getSeconds()).slice(-2);
}
export const editFileName = (datas, new_name, index, typeFile, token) => (dispatch) => {
    let dataAlterUpdate = [...datas];
    let oldName = datas[index].name;
    dataAlterUpdate[index].name = new_name;
    dataAlterUpdate[index].modifyDate = formatDateTime();
    const bodyData = {
        id: datas[index].id,
        new_name: new_name,
        old_name: oldName,
        cur_parent: datas[index].parent,
        extension: datas[index].extension,
        creator: datas[index].creator
    }
    let config = {
        method: 'put',
        url: `${HEAD_URI}/${typeFile}/name`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: bodyData
    };

    axios(config)
        .then(function () {
            dataAlterUpdate.sort((a, b) => { return new Date(b.modifyDate) - new Date(a.modifyDate) });
            dispatch({ type: UPDATE_STORE_TMP, payload: dataAlterUpdate });
        })
        .catch(function () {
            dispatch({ type: UPDATE_STORE_TMP, payload: datas });
            // console.log(error);
        });
};
export const moveToTrash = (listIds, listDatas, creator, token, type) => (dispatch) => {
    let datas = listDatas.filter(f => listIds.includes(f.id)).map(f => {
        return {
            id: f.id,
            name: f.name,
            extension: f.extension
        }
    });
    let dataRequest = {
        creator: creator,
        state: 0,
        datas: datas
    }
    const config = {
        method: 'put',
        url: `${HEAD_URI}/${type}/trash`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: dataRequest
    }
    try {
        // console.log('ok');
        axios(config).then(() => {
            let list = listDatas.filter(f => !listIds.includes(f.id));
            // console.log(list);
            dispatch({ type: GET_LIST_SUCCESS, payload: list });
        });
    } catch (err) {
        console.log(err);
    }
    // console.log(dataRequest);

};

export const restoreItem = (listId = [], listDatas = [], creator, token) => (dispatch) => {
    let dataPictures = [];
    let dataVideos = [];
    let dataMusics = [];
    const formatId = id => parseInt(id.substring(0, id.indexOf('##')));
    // lọc ra theo nhóm: videos, musics, pictures

    listDatas.filter(f => listId.includes(f.id))
        .map(f => {
            if (f.parent === 'videos')
                dataVideos.push({ id: formatId(f.id), name: f.name, extension: f.extension })
            else if (f.parent === 'pictures')
                dataPictures.push({ id: formatId(f.id), name: f.name, extension: f.extension })
            else
                dataMusics.push({ id: formatId(f.id), name: f.name, extension: f.extension })
        });
    const dataRequest = {
        creator: creator,
        state: 1,
        datas: null
    }
    const config = {
        method: 'put',
        url: null,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: null
    }
    try {
        if (dataPictures.length !== 0)
            axios({ ...config, url: `${HEAD_URI}/pictures/trash`, data: { ...dataRequest, datas: dataPictures } });
        if (dataVideos.length !== 0)
            axios({ ...config, url: `${HEAD_URI}/videos/trash`, data: { ...dataRequest, datas: dataVideos } });
        if (dataMusics.length !== 0)
            axios({ ...config, url: `${HEAD_URI}/musics/trash`, data: { ...dataRequest, datas: dataMusics } });

        const list = listDatas.filter(f => !listId.includes(f.id));
        dispatch({ type: GET_LIST_SUCCESS, payload: list });

    } catch (err) { console.log(err); }
}

export const deleteItem = (listId = [], listDatas = [], creator, token) => (dispatch) => {
    let dataPictures = [];
    let dataVideos = [];
    let dataMusics = [];
    const formatId = id => parseInt(id.substring(0, id.indexOf('##')));
    // lọc ra theo nhóm: videos, musics, pictures
    listDatas.filter(f => listId.includes(f.id))
        .map(f => {
            if (f.parent === 'videos')
                dataVideos.push({ id: formatId(f.id), name: f.name, extension: f.extension })
            else if (f.parent === 'pictures')
                dataPictures.push({ id: formatId(f.id), name: f.name, extension: f.extension })
            else
                dataMusics.push({ id: formatId(f.id), name: f.name, extension: f.extension })
        });
    const dataRequest = {
        creator: creator,
        datas: null
    }
    const config = {
        method: 'post',
        url: null,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: null
    }
    try {
        if (dataPictures.length !== 0)
            axios({ ...config, url: `${HEAD_URI}/pictures/delete`, data: { ...dataRequest, datas: dataPictures } });
        if (dataVideos.length !== 0) {
            axios({ ...config, url: `${HEAD_URI}/videos/delete`, data: { ...dataRequest, datas: dataVideos } });
        }
        if (dataMusics.length !== 0)
            axios({ ...config, url: `${HEAD_URI}/musics/delete`, data: { ...dataRequest, datas: dataMusics } });

        const list = listDatas.filter(f => !listId.includes(f.id));
        dispatch({ type: GET_LIST_SUCCESS, payload: list });

    } catch (err) { console.log(err); }
}

export const getUsedMemory = (creator, token) => (dispatch) => {
    let config = {
        method: 'get',
        url: `${HEAD_URI}/${creator}`,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };
    try {
        axios(config)
            .then((res) => {
                dispatch({ type: GET_USED_MEMORY, payload: res.data });
            }).catch(err => {
                console.log(err);
            })
    } catch (err) {
        console.log(err);
    }

}
// export const formatBytes = (bytes) => {
//     if (bytes === 0) return '0 B';
//     const k = 1024;
//     const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }
const transformDataTrash = (datas = []) => {
    return datas.map(v => { return { ...v, id: `${v.id}##${v.parent}` } })
}


