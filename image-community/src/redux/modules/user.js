import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";
import { auth } from "../../shared/firebase";
import firebase from "firebase/app";

// initial state
const user_initial = {
  user_name: "bbakyong",
};
// initialState
const initialState = {
  user: null,
  is_login: false,
};

// actions
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// middleware actions
const loginFB = (id, pwd) => {
  return (dispatch, getState, { history }) => {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          dispatch(
            setUser({
              id: id,
              user_name: user.user.displayName,
              user_profile: null,
              uid: user.user.user_uid,
            })
          );
          history.push("/");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {
        console.log(user);

        auth.currentUser
          .updateProfile({
            displayName: user_name,
          })
          .then(() => {
            dispatch(
              setUser({
                id: id,
                user_name: user_name,
                user_profile: null,
                uid: user.user.user_uid,
              })
            );
            history.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };
};

const loginCheckFB = () => {
  // ????????? ????????? ?????? ?????? ????????? ???????????? ??????.
  // ????????? ?????? ????????? ??? ????????? ???????????? ?????? ????????????.
  // ????????? ?????? ??????????????? ?????????????????? logOut??? ????????? ?????? ????????????.
  return (dispatch, getState, { history }) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: null,
            id: user.email,
            uid: user.uid,
          })
        );
      } else {
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return (dispatch, getState, { history }) => {
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace("/"); // replace: ?????? ???????????? ?????? ?????? ???????????? ???????????? ??????. ???????????? ?????? ??? ???????????? ????????? ?????????.
    });
  };
};

// reducer using handle actions, immer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

const actionCreators = {
  logOut,
  getUser,
  loginFB,
  signupFB,
  loginCheckFB,
  logoutFB,
};
export { actionCreators };
