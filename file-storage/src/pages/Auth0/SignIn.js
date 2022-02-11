import { Button, Form, Input, Modal, notification } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { checkOTP, login, sendMail, updatePwd } from '../../actions/authAction';
import '../../fonts/font_awesome/css/all.css';
import avatar from '../../images/auth/avatar.svg';
import bg from '../../images/auth/bg.svg';
import wave from '../../images/auth/wave.png';
import './style.css';


const reMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const reNum = /^[0-9]{6}$/;
function SignIn() {
    const [form] = Form.useForm();
    const [formPwd] = Form.useForm();

    const [eventU, setU] = useState(false);
    const [eventP, setP] = useState(false);


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const user = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { error, users } = user;
    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };
    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };
    const his = useHistory();
    const [isClick, setIsClick] = useState(false);
    const handleLogin = e => {
        e.preventDefault();
        setIsClick(true);
        dispatch(login(username, password));
    }
    useEffect(() => {
        // console.log('user ', users);
        if (users) {
            his.push('/main/pictures');
        }
    }, [users]);

    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('Nhập Email đã đăng ký');
    const [textBtn, setTextBtn] = useState('Gửi');
    const [email, setEmail] = useState('');
    const [validOTP, setValidOTP] = useState('');
    const [OTP, setOTP] = useState('');
    const [isSend, setIsSend] = useState(false);
    const [seconds, setSeconds] = useState(180);
    const timeValid = useRef(null);
    function startSecond() {
        let i = seconds;
        timeValid.current = setInterval(() => {
            setSeconds(--i);
            if (i == 0) {
                clearInterval(timeValid.current);
                setSeconds(180);
                setIsSend(false);
            }
        }, 1000);
    }

    function onCancel() {
        timeValid.current && clearInterval(timeValid.current);
        setSeconds(180);
        timeValid.current = null;
        setIsSend(false);
        setVisible(false);
        setTitle('Nhập Email đã đăng ký');
        setTextBtn('Gửi');
        setValidOTP('');
    }
    function onOK() {
        if (!isSend) {
            if (!email || !reMail.test(email)) return;

            sendMail(email);

            setTitle('OTP đã được gửi đến email của bạn!');
            setTextBtn('Xác nhận');
            setIsSend(true);
            startSecond();
        } else {
            if (!reNum.test(OTP)) return;
            checkOTP(OTP, email)
                .then(res => {
                    if (res.data)
                        setValidOTP(res.data)
                    else {
                        setVisiblePwd(true)
                        setVisible(false);
                    }
                });
        }

    }
    // new Password
    function resetAllState() {
        setCPwd('');
        setEmail('');
        setIsClick(false);
        setIsSend(false);
        setOTP('');
        setPassword('');
        setPwd('');
        setVisible(false);
        setVisiblePwd(false);
    }
    const [visiblePwd, setVisiblePwd] = useState(false);

    const [pwd, setPwd] = useState('');
    const [c_pwd, setCPwd] = useState('');

    function onUpdatePwd() {
        formPwd
            .validateFields()
            .then((val) => {
                if (val.new_pwd !== val.c_new_pwd)
                    return;
                updatePwd(email, val.new_pwd)
                    .then(() => {
                        resetAllState();
                        notification['success']({
                            message: 'Thông báo',
                            description: 'Cập nhật mật khẩu thành công',
                        });
                    })
                    .catch(() => { console.log('FAIL 132'); })
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    return (
        <div className='auth-page'>
            <img className="wave" src={wave} />
            <div className="container-auth">
                <div className="img-auth">
                    <img src={bg} />
                </div>
                <div className="login-content">
                    <form className='form-auth' onSubmit={handleLogin}>
                        <img src={avatar} />
                        <h2 className="title">Xin chào!!!</h2>
                        <div className={"input-div one " + (eventU ? "focus" : "")}>
                            <div className="i-auth">
                                <i className="fas fa-user" />
                            </div>
                            <div className="div">
                                <h5>Tài khoản</h5>
                                <input type="text" className="input" onFocus={() => { setU(true) }} onBlur={(e) => { e.target.value === '' && setU(false) }} onChange={onChangeUsername} />
                            </div>
                        </div>
                        <div className={"input-div pass " + (eventP ? "focus" : "")}>
                            <div className="i-auth">
                                <i className="fas fa-lock" />
                            </div>
                            <div className="div">
                                <h5>Mật khẩu</h5>
                                <input type="password" className="input" onFocus={() => { setP(true) }} onBlur={(e) => { e.target.value === '' && setP(false) }} onChange={onChangePassword} />
                            </div>
                        </div>
                        {error && isClick && <p style={{ fontSize: 14, color: '#b90a0a' }}>{error}</p>}
                        <Button
                            onClick={() => setVisible(true)}
                            type='link'
                            style={{ color: '#38d39f', float: 'right' }}
                        >
                            Quên mật khẩu?
                        </Button>
                        <input type="submit" className="btn-auth" value="Đăng nhập" />
                        <div className='bt'><p>Bạn chưa có tài khoản? </p><Link to="./signup">Đăng ký</Link> <p>ngay</p>.</div>
                    </form>
                    <Modal
                        visible={visible}
                        title={title}
                        okText={textBtn}
                        cancelText='Đóng'
                        onCancel={onCancel}
                        onOk={onOK}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            name="form_in_modal"
                        >
                            {
                                !isSend
                                    ?
                                    <Form.Item
                                        rules={[
                                            {
                                                type: 'email',
                                                message: 'Email không đúng định dạng',
                                            },
                                            {
                                                required: true,
                                                message: 'Không được bỏ trống',
                                            },
                                        ]}
                                        name="pwd"
                                    >
                                        <Input
                                            allowClear="true"
                                            placeholder='Nhập...'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </Form.Item>
                                    :
                                    <Form.Item
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Không được bỏ trống',
                                            },
                                        ]}
                                        help={
                                            <div
                                                style={{ display: 'flex', justifyContent: 'space-between' }}
                                            >
                                                <div style={{ display: 'flex' }}>
                                                    <p
                                                        style={{ fontWeight: '600', color: '#137d6f', marginRight: 5 }}
                                                    >
                                                        Mã OTP còn hiệu lực
                                                    </p>
                                                    <b style={{ color: '#e64646' }}>{` ${seconds}s.`}</b>
                                                </div>
                                                <p
                                                    style={{ fontWeight: '600', color: '#e64646' }}
                                                >
                                                    {validOTP}
                                                </p>

                                            </div>}
                                        name="otp"
                                    >
                                        <Input
                                            allowClear="true"
                                            placeholder='OTP?'
                                            value={OTP}
                                            onChange={e => setOTP(e.target.value)}
                                        />
                                    </Form.Item>
                            }
                        </Form>
                    </Modal>

                    <Modal
                        visible={visiblePwd}
                        title='Cập nhật mật khẩu'
                        okText='Cập nhật'
                        cancelText='Đóng'
                        onCancel={() => {
                            setVisiblePwd(false);
                            setPwd('');
                            setCPwd('');
                        }}
                        onOk={onUpdatePwd}
                    >
                        <Form
                            form={formPwd}
                            layout="vertical"
                            name="form_in_modal_pwd"
                        >
                            <Form.Item
                                rules={[
                                    {
                                        type: 'string',
                                        pattern: /^\w{8,}$/,
                                        message: 'Mật khẩu phải ít nhất 8 ký tự',
                                    },
                                    {

                                        required: true,
                                        message: 'Không được bỏ trống',
                                    },
                                ]}
                                label='Mật khẩu mới'
                                name="new_pwd"
                            >
                                <Input
                                    allowClear="true"
                                    placeholder='Nhập...'
                                    value={pwd}
                                    onChange={e => setPwd(e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item
                                rules={[
                                    {
                                        type: 'string',
                                        pattern: /^\w{8,}$/,
                                        message: 'Mật khẩu phải ít nhất 8 ký tự',
                                    },
                                    {
                                        required: true,
                                        message: 'Không được bỏ trống',
                                    },
                                ]}
                                label='Nhập lại mật khẩu'
                                name="c_new_pwd"
                            >
                                <Input
                                    allowClear="true"
                                    placeholder='Nhập...'
                                    value={c_pwd}
                                    onChange={e => setCPwd(e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default SignIn;