import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import defaultImage from "../../default_image.jpeg";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";

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
};

// actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

// action creators
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));

// middleware actions
const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("image_community");
    postDB.get().then((docs) => {
      let post_list = [];
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

      dispatch(setPost(post_list));
    });
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

    PostDB.add({ ...user_info, ..._post })
      .then((doc) => {
        let post = { user_info, ..._post, id: doc.id };
        // {user_info} 이렇게 넣으면 알아서
        // {user_info: {user_name: _user.user_name, user_id: _user.uid, user_profile: _user.user_profile}} 이렇게 됨.
        dispatch(addPost(post));
        history.replace("/");
      })
      .catch((err) => {
        console.log("post 작성에 실패했습니다", err);
      });
  };
};

// reducer using handle actions, immer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
};
export { actionCreators };
