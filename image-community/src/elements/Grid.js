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
      {/* {children}: Post.js에서  <Text>{props.contents}</Text> 처럼 컴포넌트 자식으로 있는 부분을 가져와줌 */}
      {/* 이거도 props를 불러오는것이기때문에 컴포넌트 상단에서 비구조 할당 선언에 children이 있음. */}
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
