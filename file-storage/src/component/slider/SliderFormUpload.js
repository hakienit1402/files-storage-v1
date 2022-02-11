import { FolderAddFilled } from '@ant-design/icons';
import Button from '@material-ui/core/Button';
import { Input, Modal, notification, Progress, Spin, Upload } from 'antd';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListDatas } from '../../actions/rootAction';
import PlusIcon from "../../images/plus.png";
import UploadIcon from "../../images/upload.png";

const pictureAccept = ".png, .jpeg, .jpg, .svg";
const videoAccept = ".mp4";
const audioAccept = ".mp3";
let a = false;
const SliderFormUpload = () => {
	const [visible, setVisible] = useState(false);
	const [value, setValue] = useState('');
	const [nameInValid, setNameInValid] = useState(null);
	const data = useSelector((state) => state.auth);
	const { users } = data;

	const currentType = useSelector((state) => state.fileType);
	const { type } = currentType;

	const currenParent = useSelector((state) => state.parent);
	const { parent } = currenParent;

	const usedMemory = useSelector((state) => state.memory);
	var { memory } = usedMemory;

	const showModal = () => {
		setVisible(true);
	};

	const handleOk = async () => {
		if (value == '') {
			setNameInValid('*Vui lòng nhập tên thư mục!');
			return;
		}
		var config = {
			method: 'post',
			url: `http://localhost:8080/api/user/${type}`,
			headers: {
				'Authorization': `Bearer ${users.token}`,
				'Content-Type': 'application/json'
			},
			data: {
				"name": value,
				"parent": parent,
				"creator": users.username
			}
		};
		try {
			await axios(config);
			setVisible(false);
			setNameInValid(null);
			setValue('');
			notification['success']({
				message: 'Thông báo',
				description: 'Tạo thư mục thành công',
				duration: 2
			});
			dispatch(getListDatas(type, users, parent));
		} catch (err) {
			setNameInValid('*Tên thư mục đã tồn tại!');
		}
	};

	const handleCancel = () => {
		setVisible(false);
		setNameInValid(null);
	};



	const openNotification = (title, curPercentNow, key) => {
		// notification.close(key)
		notification.open({
			message: title,
			description: <Progress
				strokeColor={{
					from: '#108ee9',
					to: '#87d068',
				}}
				percent={curPercentNow}
				status="active"
				size='small'
			/>,
			icon: <Spin />,
			key,
			placement: "bottomRight",
			duration: null
		});
	};

	const dispatch = useDispatch();
	const timeOut = useRef(null);
	const props = {
		name: 'file',
		action: `http://localhost:8080/api/user/${type}/upload/${users.username}/${parent}`,
		headers: {
			'Authorization': `Bearer ${users.token}`
		},
		beforeUpload(_, file_list) {
			// console.log('total', memory);
			let size_upload = file_list.reduce((sum, file) => {
				return sum + file.size;
			}, 0)
			let size_uploaded = size_upload + memory;
			let size_valid = users.acc_pkg_size;
			if (size_valid < size_uploaded) {
				if (!a) {
					Modal.warning({
						title: 'Cảnh báo',
						content: 'Dung lượng tải lên vượt quá bộ nhớ cho phép.\nĐể tiếp tục tải lên vui lòng nâng cấp tài khoản của bạn!',
						okText: 'Đóng',
						onOk: () => {a = false },
						onCancel: () => {a = false },
					});
					a = true;
				}
				return false;
			}
			return true;
		},
		onChange(info) {
			if (info.file.status === 'done') {
				console.log("ok");
			}
		},
		onStart: ({ uid, name }) => {
			openNotification(name, 0, uid);
		},
		onSuccess: (_, { uid }) => {
			setTimeout(() => {
				notification.close(uid);
			}, 500)

			if (timeOut.current)
				clearTimeout(timeOut.current);
			timeOut.current = setTimeout(() => {
				dispatch(getListDatas(type, users, parent));
			}, 1000)
		},
		onProgress: ({ percent }, { uid, name }) => {
			openNotification(name, parseFloat(percent.toFixed(2)), uid);
		}

	};
	return (
		<div>
			<div style={{ margin: '3rem 0 1rem 15px' }}>
				<Upload {...props}
					disabled={type === 'trash'}
					multiple
					accept={type === 'pictures' ? pictureAccept : type === 'videos' ? videoAccept : audioAccept}
					showUploadList={false}
				>
					<Button
						disabled={type === 'trash'}
						className='btn-up-new'
						variant="contained"
						startIcon={
							<img src={UploadIcon} width='30' height='30' />
						}
					>
						Tải lên
					</Button>
				</Upload>
			</div>
			<div style={{ margin: '2rem 0 1rem 15px' }}>
				<Button
					disabled={type === 'trash'}
					className='btn-up-new'
					variant="contained"
					startIcon={
						<img src={PlusIcon} width='30' height='30' />
					}
					onClick={() => showModal()}
				>
					Thư mục mới
				</Button>
				<Modal
					width={300}
					visible={visible}
					title="Thư mục mới"
					okText='Tạo'
					cancelText='Đóng'
					onOk={() => handleOk()}
					onCancel={() => handleCancel()}
				>
					<Input
						prefix={<FolderAddFilled style={{ color: '#525252' }} />}
						allowClear
						placeholder="Tên thư mục" value={value} onChange={(e) => { setValue(e.target.value); setNameInValid(null) }} />
					{nameInValid && <span style={{ color: '#dc2020', position: 'absolute', right: 25, fontSize: 12, display: 'block' }}>{nameInValid}</span>}
				</Modal>
			</div>
		</div>
	);
};
export default SliderFormUpload;
