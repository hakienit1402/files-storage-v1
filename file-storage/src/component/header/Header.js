import { Col, Row } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateType } from "../../actions/rootAction";
import logo from "../../images/cloudy.svg";
import AvatarGroup from "./avatar/AvatarGroup";
import "./HeaderStyle.css";
import SearchInput from "./searchBar/SearchInput";
const Header = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Row >
        <Col span={5} style={{}}>
          <Link to="/main/pictures">
            <img
              onClick={() => dispatch(updateType('pictures'))}
              // preview={false}
              src={logo}
              alt='...'
              style={{
                cursor: 'pointer',
                height: 55,
                width: '35%'
              }}
            />
          </Link>
        </Col>
        <Col
          span={14}
          className="inputSearchHeader"
          style={{ display: "flex" }}
        >
          <SearchInput />
        </Col>
        <Col
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          span={5}
        >
          <AvatarGroup />
        </Col>
      </Row>
    </>
  );
}
export default Header;
