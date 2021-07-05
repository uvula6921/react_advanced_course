import React from "react";
import styled from "styled-components";
import { Text, Grid } from "./index";

const Input = ({
  label,
  placeholder,
  _onChange,
  type,
  multiLine,
  value,
  is_Submit,
  onSubmit,
}) => {
  if (multiLine) {
    return (
      <Grid>
        {label && <Text margin="0">{label}</Text>}
        <ElTextarea
          placeholder={placeholder}
          onChange={_onChange}
          rows={10}
          value={value}
        ></ElTextarea>
      </Grid>
    );
  }

  return (
    <Grid>
      {label && <Text margin="0">{label}</Text>}
      {is_Submit ? (
        <ElInput
          placeholder={placeholder}
          onChange={_onChange}
          type={type}
          value={value}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
      ) : (
        <ElInput placeholder={placeholder} onChange={_onChange} type={type} />
      )}
    </Grid>
  );
};

Input.defaultProps = {
  label: false,
  placeholder: "텍스트를 입력해주세요.",
  _onChange: () => {},
  type: "text",
  multiLine: false,
  value: "",
  is_Submit: false,
  onSubmit: () => {},
};

const ElInput = styled.input`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;

const ElTextarea = styled.textarea`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;

export default Input;
