import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";
import firebase from "firebase/app";
import { actionCreators as postActions } from "./post";

const initialState = {
  list: {},
  is_loading: false,
};

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
  post_id,
  comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
  post_id,
  comment,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const addCommentFB = (post_id, contents) => {
  return function (dispatch, getState, { history }) {
    const commentDB = firestore.collection("comment");
    const user_info = getState().user.user;

    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    commentDB.add(comment).then((doc) => {
      const postDB = firestore.collection("image_community");
      const post = getState().post.list.find((l) => l.id === post_id);
      const increment = firebase.firestore.FieldValue.increment(1);
      // 특정 필드의 value에 값을 더하고 싶을때 이렇게 FieldValue.increment() 쓰면 됨.
      comment = { ...comment, id: doc.id };

      postDB
        .doc(post_id)
        .update({ comment_cnt: increment })
        .then((_post) => {
          dispatch(addComment(post_id, comment));

          if (post) {
            dispatch(
              postActions.editPost(post_id, {
                comment_cnt: parseInt(post.comment_cnt) + 1,
              })
            );

            if (post.user_info.user_id !== comment.user_id) {
              // realtime DB에 값 추가하는 방법
              const _noti_item = realtime.ref(
                `noti/${post.user_info.user_id}/list`
              );
              // ref로 불러옴

              _noti_item.set(
                // 데이터 추가할때 set을 사용.
                {
                  post_id: post.id,
                  user_name: comment.user_name,
                  image_url: post.image_url,
                  insert_dt: comment.insert_dt,
                },
                (err) => {
                  if (err) {
                    console.log("알림 저장에 실패했어요!");
                  } else {
                    const notiDB = realtime.ref(
                      `noti/${post.user_info.user_id}`
                    );
                    notiDB.update({ read: false });
                  }
                }
              );
              // notiDB.update({ read: false });
            }
          }
        });
    });
  };
};

const getCommentFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      return;
    }

    const commentDB = firestore.collection("comment");

    commentDB
      .where("post_id", "==", post_id)
      .orderBy("insert_dt", "desc")
      .get()
      .then((docs) => {
        let list = [];

        docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });

        dispatch(setComment(post_id, list));
      })
      .catch((err) => {
        console.log("댓글 정보를 가져오다가 실패했는디요?");
      });
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id] = action.payload.comment_list;
        // comment들을 담는 list를 딕셔너리 형으로 만들고
        // post_id를 key, 해당 post의 comment들(딕셔너리)을 배열 형태로 담은 comment_list를 value로 할당.
      }),
    [ADD_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id].unshift(action.payload.comment);
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
  addCommentFB,
};

export { actionCreators };
