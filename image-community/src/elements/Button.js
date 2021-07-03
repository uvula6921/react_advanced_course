import React from "react";
import styled from "styled-components";

const Button = ({ text, _onClick, is_float }) => {
  if (is_float) {
    return (
      <React.Fragment>
        <FloatButton onClick={_onClick}>{text}</FloatButton>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ElButton onClick={_onClick}>{text}</ElButton>
    </React.Fragment>
  );
};

Button.defaultProps = {
  text: "텍스트",
  _onClick: () => {},
  is_float: false,
};

const ElButton = styled.button`
  width: 100%;
  background-color: #212121;
  color: #ffffff;
  padding: 12px 0;
  box-sizing: border-box;
  border: none;
`;

const FloatButton = styled.button`
  width: 50px;
  height: 50px;
  background-color: #212121;
  color: #fff;
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 800;
  position: fixed;
  bottom: 50px;
  right: 16px;
  text-align: center;
  border: none;
  border-radius: 50px;
  vertical-align: middle;
`;

export default Button;
