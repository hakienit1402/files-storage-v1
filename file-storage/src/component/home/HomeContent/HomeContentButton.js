import {
	CloseCircleFilled, DownloadOutlined,
	InfoCircleOutlined,
	SwapOutlined,
	UserAddOutlined
} from '@ant-design/icons';
import { HistoryOutlined } from '@material-ui/icons';
import { Button, message, Modal, notification, Popconfirm } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReceiver, deleteItem, getListDatas, moveFiles, moveToTrash, restoreItem } from '../../../actions/rootAction';
import MentionsComponent from './MentionsComponent';
import TreeSelectCustom from './TreeSelectCustom';
// import { saveAs } from 'file-saver';

const HomeContentButton = ({ listRowKeys, setGiveListKey }) => {

	const dispatch = useDispatch();
	const listDatas = useSelector((state) => state.file);
	var { datas } = listDatas;
	const currentType = useSelector((state) => state.fileType);
	var { type } = currentType;

	const currenParent = useSelector((state) => state.parent);
	var { parent } = currenParent;


	const dataUsers = useSelector((state) => state.auth);
	var { users } = dataUsers;

	const [keys, setKeys] = useState([]);
	useEffect(() => {
		setKeys(listRowKeys);
	}, [listRowKeys])
	const handleDelete = () => {
		dispatch(moveToTrash(listRowKeys, datas, users.username, users.token, type));
	};

	const onDownload = () => {
		message.loading({ content: 'Đang tải xuống...', key: 'download', duration: 999 });
		const headURI = 'http://127.0.0.1:6969';
		let links = [];
		let name = [];
		let new_data = datas.filter(f => listRowKeys.includes(f.id));
		if (type === 'shared') {
			new_data.map(f => {
				name.push(f.name+'.'+f.extension);
				if (f.kind === 'videos')
					links.push(headURI + '/Videos/' + f.file_sk + '.' + f.extension)
				else if (f.kind === 'pictures')
					links.push(headURI + '/Pictures/' + f.file_sk + '.' + f.extension)
				else
					links.push(headURI + '/Musics/' + f.file_sk + '.' + f.extension)
			})
		} else {
			new_data.map(f => {
				name.push(f.name+'.'+f.extension);
				if (f.extension === 'mp4')
					links.push(headURI + '/Videos/' + f.file_sk + '.' + f.extension)
				else if (f.extension === 'mp3')
					links.push(headURI + '/Musics/' + f.file_sk + '.' + f.extension)
				else
					links.push(headURI + '/Pictures/' + f.file_sk + '.' + f.extension)
			})
		}
		const a = document.createElement('a');
		a.style.display = 'none';
		let i = 0;
		let c = true;
		const inter = setInterval(() => {
			if (c)
				fetch(links[i])
					.then(
						resp => {
							c = false;
							resp.blob()
								.then(blob => {
									c = false;
									const url = URL.createObjectURL(blob);
									a.href = url;
									a.download = name[i];
									document.body.appendChild(a);
									a.click();
									URL.revokeObjectURL(url);
									++i;
									if (i == links.length) {
										message.success({ content: 'Hoàn thành!', key: 'download', duration: 4 });
										clearInterval(inter);
										setKeys([]);
										setGiveListKey([]);
										return;
									}
									c = true;
								})
						}
					)
					.catch((err) => {
						console.log('???', err);
						c = false;
						setKeys([]);
						setGiveListKey([]);
						clearInterval(inter);
					});
		}, 1000);
	};

	const onOk = async () => {
		const folderDestination = ref.current;
		const creator = users.username;
		let datass = [];
		listRowKeys.forEach(key => {
			let ele = datas.find(v => v.id === key);
			datass.push(ele);
		});
		datass = datass.map(v => {
			return {
				id: v.id,
				name: v.name,
				extension: v.extension
			}
		});

		var config = {
			method: 'put',
			url: `http://localhost:8080/api/user/${type}/copy`,
			headers: {
				'Authorization': `Bearer ${users.token}`,
				'Content-Type': 'application/json'
			},
			data: {
				new_parent: folderDestination,
				creator: creator,
				datas: datass,
				type_copy_move: 0
			}
		};
		// console.log(folderDestination);
		try {
			const { data } = await axios(config);
			if (data.msg) {
				Modal.warning({
					title: data.msg,
					content:
						<>
							<p>Chọn <b>Thao tác</b> hoặc <b>Bỏ qua</b></p>
							<Button
								onClick={() => handleClickMore({ ...config, data: { ...data.data, type_copy_move: 1 } })}
								style={{ marginBottom: 2 }} type="dashed" block>Thay thế file ở thư mục đích
							</Button>
							<Button
								onClick={() => handleClickMore({ ...config, data: { ...data.data, type_copy_move: 2 } })} //2
								type="dashed" block>Sao chép với tên "Copy (n)"
							</Button>
						</>,
					okText: "Bỏ qua",
					onOk() { },
				})
			} else {
				setGiveListKey([]);
				notification['success']({
					message: 'Thông báo',
					description: 'Sao chép file thành công',
					duration: 2
				});
				dispatch(getListDatas(type, users, parent));
				ref.current = '';
			}

		} catch (err) {
			console.log(err, 'err ne');
		}
	}
	const handleClickMore = async (config) => {
		try {
			await axios(config);
			Modal.destroyAll();
			notification['success']({
				message: 'Thông báo',
				description: 'Sao chép file thành công',
				duration: 2
			});
			setGiveListKey([]);
			dispatch(getListDatas(type, users, parent));
			ref.current = '';
		} catch (err) {
			console.log(err);
		}
	}
	const ref = useRef('');
	const okok = (adu) => {
		ref.current = adu;
	}
	const handleDeleteVV = () => {
		dispatch(deleteItem(keys, datas, users.username, users.token));
		message.success('Xóa thành công');
	}
	const handleRestore = () => {
		dispatch(restoreItem(listRowKeys, datas, users.username, users.token))
	}
	const [close, setClose] = useState(true);
	const onFinishShared = (receiver) => {
		if (receiver) {
			let data = receiver.split(' ');
			data = data.filter(e => e.includes('#')).map(e => e.substring(1));
			addReceiver(type, users, data, listRowKeys)
				.then(res => {
					if (res && res.status === 200) {
						notification['success']({
							message: 'Thông báo',
							description: 'Chia sẻ thành công!',
							duration: 3
						});
						setKeys([]);
						setGiveListKey([]);
					}
				})
		} else {
			setKeys([]);
			setGiveListKey([]);
			setClose(true);
		}
	}

	//move

	function onMove() {
		moveFiles(keys, type, ref.current, users.token)
			.then(() => {
				setGiveListKey([]);
				notification['success']({
					message: 'Thông báo',
					description: 'Di chuyển file thành công',
					duration: 2
				});
				dispatch(getListDatas(type, users, parent));
				ref.current = '';

			}).catch(() => { ref.current = ''; })
	}

	return type === 'trash' ?
		(<div style={{ marginBottom: 10 }}>
			<Button icon={<HistoryOutlined style={{ fontSize: 20, margin: '-3px 1px' }} />}
				disabled={keys.length === 0}
				onClick={() => { handleRestore() }}
				type="default" size="large" style={{ marginRight: '1rem' }}>
				Khôi phục
			</Button>
			<Popconfirm
				title='Xóa sẽ không thể khôi phục!'
				onConfirm={handleDeleteVV}
				okText="Đồng ý"
				cancelText="Hủy"
			>
				<Button disabled={keys.length === 0}
					type="default"
					size="large"
					style={{ marginRight: '1rem' }}
				>
					<CloseCircleFilled />
					Xóa vĩnh viễn
				</Button>
			</Popconfirm>,

		</div>)
		: type === 'shared' ?
			(<div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
				<Button disabled={keys.length === 0}
					onClick={onDownload}
					type="default" size="large" style={{ marginRight: '1rem' }}>
					<DownloadOutlined />
					Tải xuống
				</Button></div>) :
			(<div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
				<Button disabled={keys.length === 0}
					onClick={onDownload}
					type="default" size="large" style={{ marginRight: '1rem' }}>
					<DownloadOutlined />
					Tải xuống
				</Button>
				<Button disabled={keys.length === 0}
					type="default"
					size="large"
					style={{ marginRight: '1rem' }}
					onClick={handleDelete}
				>
					<CloseCircleFilled />
					Xóa
				</Button>
				<Button disabled={keys.length === 0}
					onClick={() => {
						keys.length === 0 ?
							message.warning('Vui lòng chọn ít nhất 1 file') :
							Modal.confirm({
								title: "Chọn thư mục",
								content: <TreeSelectCustom
									setFolderSelect={okok}
									user={users}
									type={type}
									curParent={''}
								/>,
								okText: "Sao chép",
								cancelText: "Hủy",
								icon: <InfoCircleOutlined style={{ color: '#0e9c82' }} />,
								onOk() { onOk() },
								// onCalcel() { console.log("ca"); }
							});
					}}
					type="default" size="large" style={{ marginRight: '1rem' }}>
					<CloseCircleFilled />
					Sao chép
				</Button>
				<Button
					onClick={() => {
						keys.length === 0 ?
							message.warning('Vui lòng chọn ít nhất 1 file') :
							Modal.confirm({
								title: "Chọn thư mục",
								content: <TreeSelectCustom
									setFolderSelect={okok}
									user={users}
									type={type}
									curParent={''}
								/>,
								okText: "Di chuyển",
								cancelText: "Hủy",
								icon: <InfoCircleOutlined style={{ color: '#0e9c82' }} />,
								onOk() { onMove() },
							});
					}}
					disabled={keys.length === 0}
					type="default" size="large" style={{ marginRight: '1rem' }}>
					<SwapOutlined />
					Di chuyển
				</Button>
				<Button
					onClick={() => setClose(false)}
					disabled={keys.length === 0}
					icon={<UserAddOutlined />}
					type="default" size="large" style={{ marginRight: '1rem' }}>
					Chia sẻ
				</Button>
				{keys.length !== 0 && !close && <MentionsComponent onFinishShared={onFinishShared} token={users.token} />}
			</div >)
		;
};
export default HomeContentButton;
