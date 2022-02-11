import { Button, Collapse, Form, Input, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { checkPwd } from '../../../actions/authAction';
import './profile.css';

function MyProfile({ user, visible, onCancel }) {
	const { Panel } = Collapse;

	const [form] = Form.useForm();

	const [name, setName] = useState('');
	const [pwd, setPwd] = useState('');
	const [newPwd, setNewPwd] = useState('');

	const [pwdInValid, setPwdInValid] = useState(null);
	const [newPwdInValid, setNewPwdInValid] = useState(null);

	const onUpdate = () => {
		if (pwd) {
			checkPwd(pwd, user.username, user.token)
				.then(res => {
					if (res.data)
						setPwdInValid(res.data);
					else {
						setPwdInValid(null); //current pwd ok
						if (newPwd === pwd)
							setNewPwdInValid('Vui lòng nhập mật khẩu khác mật khẩu hiện tại');
						else if (newPwd.length < 8)
							setNewPwdInValid('Mật khẩu ít nhất 8 ký tự');
						else {
							console.log(user.username, newPwd);
							setNewPwdInValid(null);
							setPwd(null)
							setNewPwd(null)
							resetForm();
						}

					}

				});
		}

		else
			console.log(user.username == name, name);
	}
	const resetForm = () => {
		form.setFieldsValue({ pwd: null, new_pwd: null });
	}
	const currentName = useRef(user.full_name);
	const [visibleBtn, setVisibleBtn] = useState(true);
	return (
		<Modal
			visible={visible}
			title="Thông tin cá nhân"
			footer={null}
			onCancel={onCancel}
		>
			<Form
				form={form}
				layout="vertical"
				name="form_in_modal"
				initialValues={{
					name: user.full_name,
					email: user.email
				}}
			>
				<Form.Item
					name="name"
					label="Họ tên"
					rules={[
						{
							required: true,
							message: 'Không được phép để trống!',
						},
					]}
				>
					<Input
						placeholder="Nhập tên"
						allowClear="true"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setVisibleBtn(e.target.value === '' || e.target.value === currentName.current)
						}}
					/>
				</Form.Item>
				<Form.Item name="email" label="Email">
					<Input type="text" disabled={true} />
				</Form.Item>
				<Collapse
					ghost
				>
					<Panel
						showArrow={false}
						header={<b
							style={{ textDecoration: 'underline', color: '#2f5cc1' }}>Đổi mật khẩu</b>}
						key='1'
					>
						<Form
							form={form}
							layout="vertical"
							name="form_in_modal"

						>
							<Form.Item
								validateStatus={pwdInValid && 'error'}
								help={pwdInValid}
								name="pwd"
								label="Mật khẩu hiện tại"
								rules={[
									{
										required: true,
										message: 'Không được phép để trống!',
									},
								]}
							>
								<Input
									allowClear="true"
									value={pwd}
									onChange={(e) => {
										setPwd(e.target.value);
										setVisibleBtn(!e.target.value);
									}}
								/>
							</Form.Item>
							<Form.Item
								validateStatus={newPwdInValid && 'error'}
								help={newPwdInValid}
								name="new_pwd"
								label="Mật khẩu mới"
								rules={[
									{
										required: true,
										message: 'Không được phép để trống!',
									},
								]}
							>
								<Input
									allowClear="true"
									value={newPwd}
									onChange={(e) => {
										setNewPwd(e.target.value);
									}} />
							</Form.Item>
						</Form>
					</Panel>
				</Collapse>
				<Form.Item>
					<Button
						disabled={visibleBtn}
						block
						type='primary'
						onClick={onUpdate}
					>
						Cập nhật
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
}
export default MyProfile;