import React from "react";
import styled from "styled-components";

const Button = ({ text, _onClick }) => {
  return (
    <React.Fragment>
      <ElButton _onClick={_onClick}>{text}</ElButton>
    </React.Fragment>
  );
};

Button.defaultProps = {
  text: "텍스트",
  _onClick: () => {},
};

const ElButton = styled.button`
  width: 100%;
  background-color: #212121;
  color: #ffffff;
  padding: 12px 0;
  box-sizing: border-box;
  border: none;
`;

export default Button;
