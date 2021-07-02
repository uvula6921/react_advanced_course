import React from "react";
import styled from "styled-components";

const Grid = ({ is_flex, width, margin, padding, bg, children }) => {
  const styled = {
    // style에 쓰이는 props만 따로 모아준다,
    is_flex: is_flex,
    width: width,
    margin: margin,
    padding: padding,
    bg: bg,
  };

  return (
    <React.Fragment>
      <GridBox {...styled}>{children}</GridBox>
    </React.Fragment>
  );
};

Grid.defaultProps = {
  // grid 레이아웃을 잡는데 필요한 css들을 대충 잡아둔다.
  children: null,
  is_flex: false,
  width: "100%",
  padding: false,
  margin: false,
  bg: false,
};

const GridBox = styled.div`
  width: ${(props) => props.width};
  height: 100%;
  box-sizing: border-box;
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")};
  ${(props) => (props.bg ? `background-color: ${props.bg};` : "")};
  ${(props) =>
    props.is_flex
      ? `display: flex; align-items: center; justify-content: space-between`
      : ""};
`;

export default Grid;
