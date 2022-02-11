import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateParent } from "../../../actions/rootAction";
import DataTable from "./DataTable";
import HomeContentButton from "./HomeContentButton";
import NavigationTab from "./NavigationTab";
const HomeContent = () => {

  const [listRowKeys, setListRowKeys] = useState([]);
  // const [listRecord, setListRecord] = useState([]);
  const [listBreadcrumb, setListBreadcrumb] = useState([''])
  const dispatch = useDispatch();
  const sendListRowKeys = (listkeys) => {
    setListRowKeys(listkeys)
  }
  // const sendListRecords = (listRecords) => {
  //   setListRecord(listRecords)
  // }
  const updateListBreadcrumb = (name) => {
    if (name)
      setListBreadcrumb([...listBreadcrumb, name]);
    else
      setListBreadcrumb([]);
  }
  const handleItemBreadcrumbClick = (index) => {
    if (index !== -1) {
      setListBreadcrumb(listBreadcrumb.slice(0, index + 1));
      dispatch(updateParent(listBreadcrumb[index]));
    } else {
      dispatch(updateParent(''));
      setListBreadcrumb([]);
    }
  }
  const [giveListKey, setGiveListKey] = useState([]);
  return (
    <>
      <div style={{ margin: "3rem 2rem 0 0" }}>
        <NavigationTab
          listBreadcrumb={listBreadcrumb}
          handleItemBreadcrumbClick={handleItemBreadcrumbClick}
        />
      </div>
      <div>
        <HomeContentButton listRowKeys={listRowKeys} setGiveListKey={setGiveListKey}
        />
      </div>
      <div>
        <DataTable
          sendListRowKeys={sendListRowKeys}
          // sendListRecords={sendListRecords}
          updateListBreadcrumb={updateListBreadcrumb}
          giveListRowKeys={giveListKey}
        />
      </div>
    </>
  );
};
export default HomeContent;
