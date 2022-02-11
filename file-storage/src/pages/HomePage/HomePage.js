import { Button, Col, Layout, Menu, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import thumb from '../../images/fileStorage.png';
import logo from '../../images/logo micro.png';
import './home.css';
const { Header, Content, Footer } = Layout;

const HomePage = () => {
	return (
		<Layout>
			<Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
				<img
					src={logo}
					style={{
						width: '130px',
						padding: '0.3rem 0 0 1rem',
					}}
					alt="#"
				/>
				<Menu
					theme="dark"
					mode="horizontal"
					style={{ float: 'right', fontSize: 15 }}
				>
					<Menu.Item>Liên hệ</Menu.Item>
					<Menu.Item>
						{' '}
						<Link to="/register">Đăng ký</Link>
					</Menu.Item>
					<Menu.Item>
						{' '}
						<Link to="/login">Đăng nhập</Link>
					</Menu.Item>
				</Menu>
			</Header>
			<Content
				className="site-layout"
				style={{ padding: '0 0px', marginTop: 64 }}
			>
				<div
					className="site-layout-background"
					style={{ padding: 24, minHeight: 380 }}
				>
					<Row>
						<Col flex="550px" className="title">
							<h1>
								Dung lượng lưu trữ trên đám mây cá nhân của
								OneDrive
							</h1>
							<h2>
								Lưu các tệp và ảnh của bạn vào OneDrive và truy
								nhập chúng từ mọi thiết bị, ở mọi nơi.
							</h2>

							<Button
								type="primary"
								className="btn-auth"
								size="large"
							>
								Đăng nhập
							</Button>
							<Button
								className="btn-auth "
								size="large"
								style={{
									borderColor: '#0078d4',
									borderWidth: 2,
								}}
							>
								Đăng ký miễn phí
							</Button>
						</Col>
						<Col span={12} className="image" flex="100%s">
							<img
								src={thumb}
								style={{
									width: '100%',
									height: '100%',
								}}
								alt="#"
							/>
						</Col>
					</Row>
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>
				Ant Design ©2018 Created by Ant UED
			</Footer>
		</Layout>
	);
};

export default HomePage;
