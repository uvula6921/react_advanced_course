import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import defaultImage from "../../default_image.jpeg";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";
import { actionCreators as imageAction } from "./image";
import { func } from "prop-types";

// initial state
const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "bbakyong",
  //   user_profile: `${defaultImage}`,
  // },
  image_url: `${defaultImage}`,
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

// actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";

// action creators
const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

// middleware actions
const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    let _paging = getState().post.paging;
    if (_paging.start && !_paging.next) {
      // 시작정보가 기록되었는데 다음 가져올 데이터가 없다면? 앗, 리스트가 끝났겠네요!
      // 그럼 아무것도 하지말고 return을 해야죠!
      return;
    }
    dispatch(loading(true));
    const postDB = firestore.collection("image_community");

    let query = postDB.orderBy("insert_dt", "desc");
    if (start) {
      query = query.startAt(start);
    }

    query
      .limit(size + 1)
      // 사이즈보다 1개 더 크게 가져옵시다.
      // 3개씩 끊어서 보여준다고 할 때, 4개를 가져올 수 있으면? 앗 다음 페이지가 있겠네하고 알 수 있으니까요.
      // 만약 4개 미만이라면? 다음 페이지는 없겠죠! :)
      .get()
      .then((docs) => {
        let post_list = [];
        let paging = {
          // 시작점에는 새로 가져온 정보의 시작점을 넣고,
          // next에는 마지막 항목을 넣습니다.
          // (이 next가 다음번 리스트 호출 때 start 파라미터로 넘어올거예요.)
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        docs.forEach((doc) => {
          let _post = doc.data();

          let post = Object.keys(_post).reduce(
            // reduce 쓰는법 참고!!!
            (acc, cur) => {
              if (cur.indexOf("user_") !== -1) {
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                  // [cur] 이렇게 써야 cur의 변수 값이 들어가짐. 그냥 cur 쓰면 문자열이 들어감...?!
                  // value 가져올때도 _post.cur라고 쓰면 안되고 _post[cur] 라고 써야함
                  // reduce만의 특징인듯?
                };
              }
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );

          // let _post = {
          //   id: doc.id,
          //   ...doc.data()
          // }
          // let post = {
          //   id: doc.id,
          //   user_info: {
          //     user_name: _post.user_name,
          //     user_profile: _post.user_profile,
          //     user_id: _post.user_id,
          //   },
          //   image_url: _post.image_url,
          //   contents: _post.contents,
          //   comment_cnt: _post.comment_cnt,
          //   insert_dt: _post.insert_dt,
          // };

          post_list.push(post);
        });
        if (docs.docs.length === size + 1) {
          post_list.pop();
        }

        dispatch(setPost(post_list, paging));
      });
  };
};

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시글 정보가 없어요.");
      return;
    }

    const _image = getState().image.preview;
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    const postDB = firestore.collection("image_community");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");
      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("이미지 업로드에 실패했어요.");
            console.log("앗, 이미지 업로드에 문제가 있어요.");
          });
      });
    }
  };
};

const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const PostDB = firestore.collection("image_community");
    const _user = getState().user.user;
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");
    _upload.then((snapshot) => {
      // 먼저 이미지를 firebase storage에 올리고
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          return url;
          // 생성된 firebase storage 이미지 주소를 가져와서
        })
        .then((url) => {
          // 그 이미지 주소로 firestore에 저장함.
          // 이러면 게시글 작성 버튼으로 사진과 글을 한번에 저장할 수 있음.
          PostDB.add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              // {user_info} 이렇게 넣으면 알아서
              // {user_info: {user_name: _user.user_name, user_id: _user.uid, user_profile: _user.user_profile}} 이렇게 됨.
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageAction.setPreview(null));
            })
            .catch((err) => {
              window.alert("게시글 작성에 실패했어요.");
              console.log("post 작성에 실패했습니다.", err);
            });
        })
        .catch((err) => {
          window.alert("이미지 업로드에 실패했어요.");
          console.log("앗, 이미지 업로드에 문제가 있어요.");
        });
    });
  };
};

// reducer using handle actions, immer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);
        draft.paging = action.payload.paging;
        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
};
export { actionCreators };
