import { DeleteOutlined } from '@ant-design/icons';
import { List } from 'antd';
import React, { useState } from 'react';
import { deleteSharedById } from '../../../actions/rootAction';

function SharedComponent({ datas, type, token }) {
    const pop = (id) => {
        deleteSharedById(id, type, token)
            .then(data => {
                if (data.status === 200) {
                    let a = [...datass];
                    a.splice(datass.findIndex(e => e.id == id), 1);
                    setDatass(a);
                }
            })
    }
    const [datass, setDatass] = useState(datas);
    return (
        <List className="list-shared"
            itemLayout="horizontal"
            dataSource={datass}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<DeleteOutlined
                            onClick={() => pop(item.id)}
                            className='delete-shared' />}
                        title={<span className='title-shared'>{item.receiver}</span>}
                    />
                </List.Item>
            )}
        />
    );
}

export default SharedComponent;