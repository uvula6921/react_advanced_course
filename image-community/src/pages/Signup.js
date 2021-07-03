import React, { useState } from "react";
import { Grid, Text, Input, Button } from "../elements";
import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { emailCheck } from "../shared/common";

const Signup = (props) => {
  const dispatch = useDispatch();
  const [id, setID] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd_check, setPwdCheck] = useState("");
  const [user_name, setUserName] = useState("");

  const signUp = () => {
    if (pwd !== pwd_check) {
      window.alert("패스워드와 패스워드 확인이 일치하지 않습니다.");
      return;
    }
    if (id === "" || pwd === "" || user_name === "") {
      window.alert("입력값을 모두 입력해주세요.");
      return;
    }

    if (!emailCheck(id)) {
      window.alert("이메일 형식이 맞지 않습니다.");
      return;
    }

    dispatch(userActions.signupFB(id, pwd, user_name));
  };

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text size="32px" bold>
          회원가입
        </Text>

        <Grid padding="16px 0px">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요."
            _onChange={(e) => {
              setID(e.target.value); // 자식 컴포넌트에 props로 함수를 내려주면 자식컴포넌트의 리턴값을 이용해 부모 컴포넌트의 state를 변경할 수 있다.
            }}
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="닉네임"
            placeholder="닉네임을 입력해주세요."
            _onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            _onChange={(e) => {
              setPwd(e.target.value);
            }}
            type="password"
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요."
            _onChange={(e) => {
              setPwdCheck(e.target.value);
            }}
            type="password"
          />
        </Grid>

        <Button text="회원가입하기" _onClick={signUp}></Button>
      </Grid>
    </React.Fragment>
  );
};

Signup.defaultProps = {};

export default Signup;
