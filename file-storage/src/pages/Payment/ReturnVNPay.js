import { Button, Result } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateTotalMemory } from '../../actions/authAction';

function ReturnVNPay() {
    var query = window.location.search.substring(1);
    const params = new URLSearchParams(query);

    const dataUsers = useSelector((state) => state.auth);
    var { users } = dataUsers;
    const dispatch = useDispatch();
    // vnp_Amount
    useEffect(() => {
        if (params.get('vnp_ResponseCode') === '00') {
            let vnp_Amount = params.get('vnp_Amount')/100;
            let username = params.get('username');
            console.log(vnp_Amount,username);
            let config = {
                method: 'post',
                url: `http://localhost:8080/api/user/vnpay/success`,
                headers: {
                    'Authorization': `Bearer ${users.token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    username: username,
                    amount: vnp_Amount
                }
            };
            try {
                axios(config);
                dispatch(updateTotalMemory(vnp_Amount, users));
            } catch (err) {
                console.log(err);
            }
        }
    }, [])
    return (
        <div>
            <Result
                status={params.get('vnp_ResponseCode') === '00' ? "success" : "error"}
                title={params.get('vnp_ResponseCode') === '00' ? "Giao dịch thành công!" : "Giao dịch thất bại!"}
                subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!!!"
                extra={params.get('vnp_ResponseCode') === '00' ? [
                    <Button type="primary" key="console" href="/main/pictures">
                        Trang chủ
                    </Button>
                ] : [<Button type="primary" key="console" href="/main/pictures">
                    Trang chủ
            </Button>,
                <Button key="buy" href='/upgrade'>Giao dịch lại</Button>,]}
            />
        </div>
    );
}

export default ReturnVNPay;