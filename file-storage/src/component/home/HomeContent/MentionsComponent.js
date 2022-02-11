import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Mentions, { Option } from 'antd/lib/mentions';
import { debounce } from 'lodash';
import React, { useRef, useState } from 'react';
import { findUser } from '../../../actions/rootAction';


function MentionsComponent({ onFinishShared, token }) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const onSearch = (search) => {
        setLoading(!!search)
        setUsers([])
        loadUser(search);
    }
    const loadUser = useRef(debounce((nextValue) => loadGithubUsers(nextValue), 800)).current;
    const loadGithubUsers = (key) => {
        if (!key) {
            setUsers([]);
            return;
        }
        findUser(key, token)
            .then(res => {
                if (res.data !== "") {
                    setUsers([res.data])
                }
                setLoading(false);
            })

    }
    const [val, setVal] = useState('');
    return (
        <div style={{ width: '40%', display: 'flex' }}>
            <Mentions
                value={val}
                onChange={(e) => setVal(e)}
                autoSize
                placeholder='Người nhận, #abc hoặc #email@gmail.com'
                notFoundContent={null}
                prefix={'#'}
                style={{ width: '100%' }}
                loading={loading}
                onSearch={(search) => onSearch(search)}>
                {
                    users.map(name => (
                        <Option key={name} value={name} className="antd-demo-dynamic-option">
                            <span>{name}</span>
                        </Option>
                    ))
                }
            </Mentions>
            <Button
                onClick={() => { if (val) { onFinishShared(val); setVal('') } }}
                style={{ margin: '0 7px' }} type="primary" shape="circle" icon={<SendOutlined />} />
            <Button
                onClick={() => onFinishShared()}
                danger type="primary" shape="circle" icon={<CloseOutlined />} />
        </div>
    );
}

export default MentionsComponent;