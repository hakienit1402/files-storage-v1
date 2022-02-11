import { EditFilled, HistoryOutlined, TeamOutlined } from '@ant-design/icons';
import { Form, Image, Input, message, Popover, Table, Tooltip, Typography } from "antd";
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from "react";
import { useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from "react-redux";
import { editFileName, getListDatas, getListSharedOwner, getUsedMemory, restoreItem, updateParent } from "../../../actions/rootAction";
import FolderIcon from "../../../images/folder.png";
import JpgIcon from "../../../images/jpg.svg";
import Mp3Icon from "../../../images/mp3.png";
import Mp4Icon from "../../../images/mp4.png";
import PngIcon from "../../../images/png.svg";
import SvgIcon from "../../../images/svg.svg";
import MusicMainIcon from "../../../images/music-main.png";
import PictureMainIcon from "../../../images/picture.png";
import VideoMainIcon from "../../../images/video-main.png";
import SharedComponent from './SharedComponent';

const renderIcon = (extension) => {
  switch (extension) {
    case "jpg":
      return <img className="img-type" alt="#" src={JpgIcon} />;
    case "png":
      return <img className="img-type" alt="#" src={PngIcon} />;
    case "svg":
      return <img className="img-type" alt="#" src={SvgIcon} />;
    case "FOLDER":
      return <img className="img-type" alt="#" src={FolderIcon} />;
    case "mp3":
      return <img className="img-type" alt="#" src={Mp3Icon} />;
    case "mp4":
      return <img className="img-type" alt="#" src={Mp4Icon} />;
    default:
      break;
  }
};
const renderKind = (kind) => {
  switch (kind) {
    case "videos":
      return <img className="img-type" alt="#" src={VideoMainIcon} />;
    case "musics":
      return <img className="img-type" alt="#" src={MusicMainIcon} />;
    default: // picture
      return <img className="img-type" alt="#" src={PictureMainIcon} />;
  }
}

const renderSize = (bytes) => {
  if (bytes === 0) return '/';
  const k = 1024;
  const sizes = ['', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
const pictureFilter = [
  {
    text: 'Thư mục',
    value: 'FOLDER',
  },

  {
    text: 'PNG',
    value: 'png',
  },
  {
    text: 'JPG',
    value: 'jpg',
  },
  {
    text: 'SVG',
    value: 'svg',
  },
]
const musicFilter = [
  {
    text: 'Thư mục',
    value: 'FOLDER',
  },

  {
    text: 'MP3',
    value: 'mp3',
  },
]
const videoFilter = [
  {
    text: 'Thư mục',
    value: 'FOLDER',
  },

  {
    text: 'MP4',
    value: 'mp4',
  },
]
const filterDataShared = (id, datas) => {
  return datas.filter(f => f.file_id === id);
}

const DataTable = ({ sendListRowKeys, updateListBreadcrumb, giveListRowKeys }) => {
  const [selectedRowKeys, setSelectedRowked] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const listDatas = useSelector((state) => state.file);
  let { datas } = listDatas;

  const currentType = useSelector((state) => state.fileType);
  let { type } = currentType;

  const currenParent = useSelector((state) => state.parent);
  let { parent } = currenParent;

  //
  const [visible, setVisible] = useState(false);
  //

  const dataUsers = useSelector((state) => state.auth);
  let { users } = dataUsers;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getUsedMemory(users.username, users.token));
    setLoading(true);
    const time = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => { clearTimeout(time) }
  }, [datas]);
  const isEditing = (record) => record.id === editingKey;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedRowked(giveListRowKeys);
  }, [giveListRowKeys]);

  const recordHis = useRef(null);
  useEffect(() => {
    if (type === 'shared') {
      if (recordHis.current) {
        dispatch(getListDatas(recordHis.current.kind, { username: recordHis.current.owner, token: users.token }, parent, 1, true));
      }
    }
    else
      dispatch(getListDatas(type, users, parent));
  }, [parent]);


  useEffect(() => {
    sendListRowKeys([]);
    setSelectedRowked([]);
    clearAll();
    setEditingKey("");
  }, [parent, type]);

  useEffect(() => {
    dispatch(getListDatas(type, users, ''));
    dispatch(updateParent(''));
    updateListBreadcrumb();
    if (type !== 'trash' && type !== 'shared')
      getListSharedOwner(type, users)
        .then(res => {
          let sharedIdsTmp = [];
          res.map(s => {
            if (!sharedIdsTmp.includes(s.file_id))
              sharedIdsTmp.push(s.file_id);
          });
          setSharedIds(sharedIdsTmp);
          setSharedDatas(res);
        })
  }, [type]);
  const [sharedIds, setSharedIds] = useState([]);
  const [sharedDatas, setSharedDatas] = useState([]);
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form initialValues={{ name: record.name }} form={form}>
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập dữ liệu!`,
                },
              ]}
            >
              <Input
              //  onChange={handleChange}
              />
            </Form.Item>
          </Form>
        ) : (
          children
        )}
      </td>
    );
  };
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      name: record.name,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const index = datas.findIndex((item) => record.id === item.id);
      const indexName = datas.findIndex((item) => row.name === item.name && datas[index].extension === item.extension);
      if (indexName !== -1) {
        message.error(
          (row.extension !== null ? "File " : "Thư mục ") + `"${row.name}"` + " đã tồn tại!"
        );
      } else {
        if (index !== -1) {
          dispatch(editFileName(datas, row.name, index, type, users.token));
        }
        setEditingKey("");
      }

    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (_, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearAll = () => {
    setFilteredInfo(null);
    setSortedInfo(null);
  };
  const handleRestore = (record) => {
    dispatch(restoreItem([record.id], datas, users.username, users.token))
  }
  const columns = [
    {
      title: "Loại",
      className: "type-custom",
      dataIndex: "type",
      render: (_, record) => renderIcon(record.extension),
      filteredValue: filteredInfo && (filteredInfo.type || null),
      filters: type === 'pictures' ? pictureFilter : type === 'musics' ? musicFilter : videoFilter,
      filterMultiple: false,
      onFilter: (value, record) => record.extension.indexOf(value) === 0,
      ellipsis: true,
    },
    {
      title: "Tên",
      className: "name-custom",
      dataIndex: "name",
      editable: true,
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo && (sortedInfo.field === 'name' && sortedInfo.order),
      ellipsis: true,
      render: (_, record) => (
        <div style={{ position: 'relative' }}>
          {sharedIds.includes(record.id) &&
            <Popover
              content={<SharedComponent
                datas={filterDataShared(record.id, sharedDatas)}
                type={type}
                token={users.token}
              />}
              title="Chia sẻ với"
              trigger="click"
              placement="rightTop"
            >
              <TeamOutlined className="icon-shared" />
            </Popover>
          }
          <Tooltip placement="top" title={<span>{record.name}</span>}>
            <span>{record.name}</span>
          </Tooltip>
        </div>
      )
    },
    {
      title: (<span>{type === 'trash' ? 'Nhóm' : "Kích thước"}</span>),
      dataIndex: "size",
      render: (_, record) => type === 'trash' ? renderKind(record.parent) : renderSize(record.size),
    },
    {
      title: (<span>{type === 'trash' ? 'Ngày vào thùng rác' : type === 'shared' ? "Chủ sở hữu" : "Sửa đổi lần cuối"}</span>),
      dataIndex: type !== 'shared' ? "modifyDate" : "owner",
    },
    {
      title: (<span>{type === 'trash' ? 'Khôi phục' : type === 'shared' ? "Nhóm" : "Đổi tên"}</span>),
      dataIndex: "operation",
      render: (_, record) => {
        return type === 'trash' ?
          (<HistoryOutlined
            onClick={() => handleRestore(record)}
            style={{ fontSize: 18, paddingLeft: 20 }} />
          )
          : type === 'shared' ?
            renderKind(record.kind)
            : isEditing(record) ? (
              <span>
                <a
                  onClick={() => save(record)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Lưu
                </a>
                <a onClick={cancel}>Hủy</a>
              </span>
            ) : (
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                <EditFilled
                  style={{
                    fontSize: 18, paddingLeft: 20
                  }
                  } />
              </Typography.Link>
            );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowked(selectedRowKeys);
    // sendListRecords(record);
    sendListRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideDefaultSelections: true,
  };

  const URI = 'http://127.0.0.1:6969/';
  const handlePlay = (rc) => {
    const extension = rc.extension;
    const src = rc.file_sk + '.' + rc.extension;
    if (extension.includes('mp')) {
      const title = rc.name;
      if (extension === 'mp4') {
        setIsVideoPlaying(true);
        setSrcVideo(URI + 'Videos/' + src);
        setTitleVideo(title);
      } else { // mp3
        setIsVideoPlaying(false);
        setSrcAudio(URI + 'Musics/' + src);
        setTitleAudio(title);
        // console.log(src);
      }
      setVisible(true);
    } else {
      setSrcImage(URI + 'Pictures/' + src);
      setPreview(true);
    }


  }
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [srcVideo, setSrcVideo] = useState('');
  const [titleVideo, setTitleVideo] = useState('');

  const [srcAudio, setSrcAudio] = useState('');
  const [titleAudio, setTitleAudio] = useState('');

  const [srcImage, setSrcImage] = useState('');

  const handleCancel = () => {
    setVisible(false);
    if (isVideoPlaying) {
      let videoElement = document.getElementsByTagName('video');
      videoElement[0].pause();
      videoElement[0].src = '';
      videoElement[0].load();
      setSrcVideo('');
    } else {
      let videoElement = document.getElementsByTagName('audio');
      videoElement[0].pause();
      videoElement[0].src = '';
      videoElement[0].load();
      setSrcAudio('');
    }
  }
  const handlePauseAudio = (cut) => {
    document.getElementById('img-audio').style.webkitAnimationPlayState = cut;
  }
  const [preview, setPreview] = useState(false);
  return (
    <div >
      <Image
        preview={{
          visible: preview,
          onVisibleChange: () => { setPreview(false); setSrcImage('') },
          src: srcImage,
        }}
      />
      <Modal
        className='model-custom'
        title={isVideoPlaying ? titleVideo : titleAudio}
        centered
        visible={visible}
        onCancel={() => { handleCancel() }}
        footer={null}
      >
        {isVideoPlaying ?
          <ReactPlayer
            height='fit-content'
            url={srcVideo}
            // loop
            stopOnUnmount={true}
            playing={true}
            controls={true}
            volume={1}
            muted={true}
          /> :
          <div style={{ width: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '15px 0' }}>
              <img id='img-audio' src={MusicMainIcon} alt="" width='150' height='150' />
            </div>
            <hr />
            <AudioPlayer
              autoPlay
              onPause={() => { handlePauseAudio('paused'); }}
              onPlay={() => { handlePauseAudio('running') }}
              src={srcAudio}
            />
          </div>

        }
      </Modal>
      <Table
        loading={loading}
        onChange={handleChange}
        rowSelection={rowSelection}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={mergedColumns}
        rowClassName="editable-row"
        dataSource={datas}
        rowKey="id"
        onRow={(record, _) => {
          return type !== 'trash' && {
            onDoubleClick: () => {
              if (record.extension === 'FOLDER') {
                dispatch(updateParent(record.name));
                updateListBreadcrumb(record.name);
                if (type === 'shared') {
                  recordHis.current = {
                    kind: record.kind,
                    owner: record.owner,
                  }
                }
              } else {
                handlePlay(record);
              }
            }
          }
        }}
      />
    </div>
  );
};
export default DataTable;
