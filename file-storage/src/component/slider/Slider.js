import {
	CloudOutlined,
	DeleteOutlined,
	PictureOutlined,
	PlayCircleFilled,
	TeamOutlined,
	VideoCameraFilled
} from '@ant-design/icons';
import { Button, Menu, Progress } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateType } from '../../actions/rootAction';
import SliderFormUpload from './SliderFormUpload';
const Slider = ({ type }) => {
	const dataUsers = useSelector((state) => state.auth);
	var { users } = dataUsers;

	const usedMemory = useSelector((state) => state.memory);
	var { memory } = usedMemory;

	const [currentType, setCurrentType] = useState(type || 'pictures');
	const dispatch = useDispatch();
	const handleItemClick = e => {
		dispatch(updateType(e.key));
		setCurrentType(e.key);
	}

	const formatBytes = (bytes) => {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	return (
		<div>
			<SliderFormUpload />
			<div>
				<hr></hr>
				<Menu
					onClick={handleItemClick}
					style={{ width: 256 }}
					defaultSelectedKeys={[currentType]}
					mode="inline"
				>
					<Menu.Item key="pictures">
						<Link
							to='/main/pictures'>
							<PictureOutlined />
						Ảnh
						</Link>

					</Menu.Item>
					<Menu.Item key="musics">
						<Link
							to='/main/musics'>
							<PlayCircleFilled />
						Âm nhạc
					</Link>

					</Menu.Item>
					<Menu.Item key="videos" >
						<Link
							to='/main/videos'>
							<VideoCameraFilled />
						Video
					</Link>
					</Menu.Item>
					<hr></hr>
					<Menu.Item key='shared'>
						<Link style={{ color: '#636363', fontWeight: 500 }}
							to='/main/shared'>
							<TeamOutlined style={{ fontSize: 20, color: '#525252' }} />
								Được chia sẻ với tôi
					</Link>
					</Menu.Item>
					<Menu.Item key='trash'>
						<Link style={{ color: '#636363', fontWeight: 500 }}
							to='/main/trash'>
							<DeleteOutlined style={{ fontSize: 20, color: '#525252' }} />
							Thùng rác
					</Link>
					</Menu.Item>
				</Menu>
			</div>
			<div>
				<hr />
				<Button style={{ display: 'flex' }}
					icon={<CloudOutlined style={{ fontSize: 25, color: '#848484' }} />}
					type="text" shape="round" block>
					<span style={{ fontWeight: 500, fontSize: 16, color: '525252' }}>Bộ nhớ</span>
				</Button>
				<div style={{ width: '90%', margin: 'auto' }}>
					<Progress
						strokeColor={{
							from: '#108ee9',
							to: '#87d068',
						}}
						size="small"
						// percent={Math.round((memory / users.acc_pkg_size) * 100)}
						percent={Math.floor((memory / users.acc_pkg_size) * 100)}
						status="active"
					/>
					<span
						style={{ color: '#656565', fontSize: 13, marginBottom: 10, display: 'block' }}>
						Đã sử dụng <b>{formatBytes(memory)}</b> / <b>{formatBytes(users.acc_pkg_size)}</b>
					</span>

				</div>
				<Button
					href="/upgrade"
					style={{ display: 'block', margin: 'auto', fontWeight: 500, color: '#028888',width:'fit-content' }} shape="round">Mua bộ nhớ</Button>
			</div>
		</div>
	);
};
export default Slider;
