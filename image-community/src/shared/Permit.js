import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

const Permit = (props) => {
  const is_login = useSelector((state) => state.user.user);
  const session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(session_key) ? true : false;

  if (is_session && is_login) {
    // 리덕스와 세션에 모두 로그인 확인이 되어야 함.
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return null;
};

export default Permit;
