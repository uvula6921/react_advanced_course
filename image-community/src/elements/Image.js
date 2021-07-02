import React from "react";
import styled from "styled-components";
import defaultImage from "../default_image.jpeg";

const Image = ({ shape, src, size }) => {
  const styles = {
    src: src,
    size: size,
  };

  if (shape === "circle") {
    return <ImageCircle {...styles}></ImageCircle>;
  }

  if (shape === "rectangle") {
    return (
      <AspectOutter>
        <AspectInner {...styles}></AspectInner>
      </AspectOutter>
    );
  }
  return <div className="App"></div>;
};

Image.defaultProps = {
  shape: "rectangle",
  src: `${defaultImage}`,
  size: 36,
};

const ImageCircle = styled.div`
  --size: ${(props) => props.size}px;
  // css 값을 변수화해서
  width: var(--size); // 이렇게 불러서 사용함
  height: var(--size);
  border-radius: var(--size);

  background-image: url("${(props) => props.src}");
  background-size: cover;
  margin: 4px;
`;

const AspectOutter = styled.div`
  width: 100%;
  min-width: 250px;
`;

const AspectInner = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  background-image: url("${(props) => props.src}");
  background-size: cover;
  background-position-y: 50%;
`;

export default Image;
