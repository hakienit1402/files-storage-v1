import axios from 'axios';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { uuidv4 } from '../../actions/authAction';
import '../../fonts/font_awesome/css/all.css';
import avatar from '../../images/auth/avatar.svg';
import bg from '../../images/auth/bg.svg';
import wave from '../../images/auth/wave.png';
import './style.css';

const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var uuidRandom = '';
function SignUp() {
    const [eventU, setU] = useState(false);
    const [eventP, setP] = useState(false);
    const [eventCP, setCP] = useState(false);
    const [eventE, setE] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [email, setEmail] = useState('');

    const [otp, setOtp] = useState('');
    const [msgValid, setMsgValid] = useState('');
    const [isClick, setClick] = useState(false);
    function onchangeVipPro(e) {
        // console.log(e.target.value);
        setOtp(e.target.value);
    }
    const history = useHistory();
    function handleOtpConfirm(e) {
        e.preventDefault();
        var data = {
            'uuid': uuidRandom,
            'code': otp,
            'infor':
            {
                'username': username,
                'password': password,
                'full_name': email,
                'email': email
            }
        }
        axios.post('http://localhost:8080/api/signup/validate/otp', data)
            .then(() => {
                setMsgValid('');
                history.push('/signin');
            }).catch(() => {
                setMsgValid('Mã xác nhận không hợp lệ');
            });
    }

    const [notiUid, setNotiUid] = useState('');
    const [notiPwd, setNotiPwd] = useState('');
    const [notiCPwd, setNotiCPwd] = useState('');
    const [notiEmail, setNotiEmail] = useState('');


    function validate() {
        let uid = '';
        let pwd = '';
        let cpwd = '';
        let _email = '';
        if (username === '') {
            uid = 'Không bỏ trống trường này';
        } else {
            uid = ''
        }
        if (password === '') {
            pwd = 'Không bỏ trống trường này';
        } else {
            if (password.length < 8)
                pwd = 'Mật khẩu ít nhất 8 ký tự';
            else
                pwd = '';
        }
        if (cpassword === '') {
            cpwd = 'Không bỏ trống trường này';
        } else {
            if (password !== '' && password.length >= 8 && password === cpassword) {
                cpwd = '';
            } else {
                cpwd = 'Mật khẩu không khớp';
            }
        }
        if (email === '') {
            _email = 'Không bỏ trống trường này';
        } else {
            if (!re.test(email))
                _email = 'Email không hợp lệ';
            else {
                _email = '';
            }
        }
        setNotiUid(uid);
        setNotiEmail(_email);
        setNotiPwd(pwd);
        setNotiCPwd(cpwd);
        // call api
        if (uid === '' && _email === '') {
            var data = {
                'username': username,
                'email': email,
                'uuid': uuidRandom
            }
            axios
                .post('http://localhost:8080/api/signup/validate/user', data)
                .then((res) => {
                    if (res.data === '') {
                        setNotiUid('');
                        setNotiEmail('');
                        if (pwd == '' && cpwd == '')
                            setClick(true);
                    } else {
                        setClick(false);
                        var notis = res.data;
                        if (notis.length === 2) {
                            setNotiUid(notis[0]);
                            setNotiEmail(notis[1]);
                        } else {
                            if (notis[0].includes('Email')) {
                                setNotiEmail(notis[0]);
                            } else {
                                setNotiUid(notis[0]);
                            }
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
    }
    function handleSignup(e) {
        e.preventDefault();
        uuidRandom = uuidv4();
        validate();
    }
    function handleBack() {
        setOtp('');
        setMsgValid('');
        setClick(false);
    }
    return (
        <div className='auth-page'>
            <img className="wave" src={wave} />
            <div className="container-auth">
                <div className="img-auth">
                    <img src={bg} />
                </div>
                <div className="login-content">
                    <form className='form-auth'>
                        <img src={avatar} style={{ width: 50, height: 50 }} />
                        <h2 className="title">Xin chào!!!</h2>
                        {isClick ?
                            <>
                                <p style={{ color: '#32be8f', fontSize: 16 }}>Mã xác nhận đã gửi về email của bạn</p>
                                <div className="input-div pass focus">
                                    <div className="i-auth">
                                        <i className="fas fa-lock" />
                                    </div>
                                    <div className="div">
                                        <input type="text" className="input" placeholder='000000'
                                            value={otp} onChange={onchangeVipPro} />

                                        <div className="noti">
                                            {msgValid !== '' &&
                                                <i class="fas fa-exclamation-circle"></i>}
                                            <p>{msgValid}</p>
                                        </div>

                                    </div>

                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p onClick={handleBack} href="#" style={{ textDecoration: 'underline' }} className='a-signin'>Quay lại</p>
                                    <p href="#" style={{ textDecoration: 'underline' }} className='a-signin'>Gửi lại mã xác nhận.</p>
                                </div>
                                <input onClick={handleOtpConfirm} type="button" className="btn-auth" value="Xác nhận" />
                                <div className='bt'><p>Bạn đã có tài khoản? </p><Link to="./signin">Đăng nhập</Link> <p>ngay</p>.</div>

                            </>
                            :
                            <>
                                <div className={"input-div one " + (eventU ? "focus" : "")}>
                                    <div className="i-auth">
                                        <i className="fas fa-user" />
                                    </div>
                                    <div className="div">
                                        <h5>Tài khoản*</h5>
                                        <input type="text" className="input"
                                            onChange={(e) => { setUsername(e.target.value) }}
                                            value={username}
                                            onFocus={() => { setU(true) }} onBlur={(e) => { e.target.value === '' && setU(false) }} />
                                        <div className="noti">
                                            {notiUid !== '' && <i class="fas fa-exclamation-circle"></i>}
                                            <p>{notiUid}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={"input-div one " + (eventP ? "focus" : "")}>
                                    <div className="i-auth">
                                        <i className="fas fa-lock" />
                                    </div>
                                    <div className="div">
                                        <h5>Mật khẩu*</h5>
                                        <input type="password" className="input"
                                            onChange={(e) => { setPassword(e.target.value) }}
                                            value={password}
                                            onFocus={() => { setP(true) }} onBlur={(e) => { e.target.value === '' && setP(false) }} />
                                        <div className="noti">
                                            {notiPwd !== '' && <i class="fas fa-exclamation-circle"></i>}
                                            <p>{notiPwd}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={"input-div one " + (eventCP ? "focus" : "")}>
                                    <div className="i-auth">
                                        <i className="fas fa-lock" />
                                    </div>
                                    <div className="div">
                                        <h5>Xác nhận mật khẩu*</h5>
                                        <input type="password" className="input"
                                            onChange={(e) => { setCPassword(e.target.value) }}
                                            value={cpassword}
                                            onFocus={() => { setCP(true) }} onBlur={(e) => { e.target.value === '' && setCP(false) }} />
                                        <div className="noti">
                                            {notiCPwd !== '' && <i class="fas fa-exclamation-circle"></i>}
                                            <p>{notiCPwd}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={"input-div pass " + (eventE ? "focus" : "")}>
                                    <div className="i-auth">
                                        <i class="fas fa-at"></i>
                                    </div>
                                    <div className="div">
                                        <h5>Email*</h5>
                                        <input type="text" className="input"
                                            onChange={(e) => { setEmail(e.target.value) }}
                                            value={email}
                                            onFocus={() => { setE(true) }} onBlur={(e) => { e.target.value === '' && setE(false) }} />
                                        <div className="noti">
                                            {notiEmail !== '' && <i class="fas fa-exclamation-circle"></i>}
                                            <p>{notiEmail}</p>
                                        </div>
                                    </div>
                                </div>
                                <input onClick={handleSignup} type="button" className="btn-auth" value="Đăng ký" />
                                <div className='bt'><p>Bạn đã có tài khoản? </p><Link to="./signin">Đăng nhập</Link> <p>ngay</p>.</div>
                            </>
                        }
                    </form>

                </div>

            </div>
        </div>
    );
}

export default SignUp;