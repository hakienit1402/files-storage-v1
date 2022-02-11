import { TreeSelect } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TreeSelectCustom = ({ setFolderSelect, user, type, curParent }) => {


    const [treeData, setTreeData] = useState([]);
    const [value, setValue] = useState(null);
    useEffect(() => {
        genTreeNode(0, curParent);
        return () => {
            // clean
            setTreeData([]);
            setValue(null);
        }
    }, []);


    const genTreeNode = async (parentId, parent) => {
        var config = {
            method: 'get',
            url: `http://localhost:8080/api/user/${type}/fo/${user.username}/${parent}`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        };
        try {
            var { data } = await axios(config);
            var tree = [...treeData];
            data.map(v => {
                tree = tree.concat({
                    id: v.id,
                    pId: parentId,
                    value: v.id,
                    title: v.name,
                    isLeaf: false
                });
            })
            setTreeData(tree);
        } catch (err) {
            console.log(err);
        }
    };


    const onLoadData = ({ id, title }) =>
        new Promise((resolve) => {
            setTimeout(() => {
                genTreeNode(id, title);
                resolve();
            }, 300);
        });

    const onChange = (value, label) => {
        setValue(value);
        setFolderSelect(label[0]);
    };
    return (
        <div>
            <TreeSelect
                treeDataSimpleMode
                style={{ width: "100%" }}
                value={value}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Thư mục hiện tại"
                onChange={onChange}
                loadData={onLoadData}
                treeData={treeData}
            />

        </div>
    );
}

export default TreeSelectCustom;