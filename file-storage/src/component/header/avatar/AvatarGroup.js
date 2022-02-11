import {
	BellOutlined,
	LogoutOutlined, SettingOutlined, ToTopOutlined, UserOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Popover } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/authAction';
import MyProfile from '../../../component/home/myProfile/MyProfile';
import './Style.css';

const AvatarGroup = () => {

	const dataUsers = useSelector((state) => state.auth);
	let { users } = dataUsers;

	const dispatch = useDispatch();
	const [visible, setVisible] = useState(false);
	const his = useHistory();
	const handleLogout = () => {
		dispatch(logout());
		his.replace('/');
		// console.log(
	};

	const showModal = () => {
		setVisible(true);
		setVisiblePopover(false);
	};

	// const handleOk = (e) => {
	// 	console.log(e);
	// 	setVisible(false);
	// };

	const handleCancel = () => {
		setVisible(false);
	};

	const menu = (
		<div className="avatar-group-notifi-detail">
			<Menu>
				<Menu.Item key="0">
					<div>Chào Cô! </div>
				</Menu.Item>
				<Menu.Item key="1">
					<div>Thông báo mới!!</div>
				</Menu.Item>
			</Menu>
		</div>
	);
	const content = (
		<div className="avatar-group-button-user">
			<Menu>
				<Menu.Item key="1" icon={<UserOutlined />}>
					<Link type="primary" onClick={showModal}>
						Thông tin cá nhân
					</Link>
					<MyProfile
						user={users}
						visible={visible}
						onCancel={handleCancel}
					/>
				</Menu.Item>
				<Menu.Item key="2" icon={<ToTopOutlined />}>
					<Link to="/upgrade">Nâng cấp tài khoản</Link>
				</Menu.Item>
			</Menu>
			<Button
				type="dashed"
				shape="round"
				icon={<LogoutOutlined />}
				size={'middle'}
				style={{ marginLeft: '3rem' }}
				onClick={handleLogout}
			>
				Đăng xuất
			</Button>
		</div>
	);

	const [visiblePopover, setVisiblePopover] = useState(false);
	return (
		<div
			style={{ display: 'flex', alignItems: 'center', paddingRight: 25 }}
		>
			<div style={{ display: 'flex' }}>
				<span style={{ fontStyle: 'italic' }}>Xin chào,</span>
				<b style={{ marginRight: 10, marginLeft: 3 }}>{users.full_name}</b>
			</div>

			<Dropdown
				overlay={menu}
				placement="bottomCenter"
				trigger={['click']}
			>
				<BellOutlined style={{ fontSize: 25, color: '#656565', marginRight: 25 }} />
			</Dropdown>
			<Popover
				visible={visiblePopover} placement='bottomRight' content={content} trigger="click"
			>
				<SettingOutlined style={{ fontSize: 25, color: '#656565' }} onClick={() => setVisiblePopover(!visiblePopover)} />
			</Popover>
		</div>
	);
};

export default AvatarGroup;