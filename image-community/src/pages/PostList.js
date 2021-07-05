import React from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);
  const is_loading = useSelector((state) => state.post.is_loading);
  const paging = useSelector((state) => state.post.paging);

  React.useEffect(() => {
    if (post_list.length === 0) {
      dispatch(postActions.getPostFB());
    }
  }, []);
  return (
    <React.Fragment>
      <InfinityScroll
        callNext={() => {
          dispatch(postActions.getPostFB(paging.next));
        }}
        is_next={paging.next ? true : false}
        loading={is_loading}
      >
        {post_list.map((p, idx) => {
          if (p.user_info.user_id === user_info?.uid) {
            return <Post key={p.id} {...p} is_me></Post>;
          } else {
            return <Post key={p.id} {...p}></Post>;
          }
          // p에 있는 각 key, value를 한 번에 props로 넘겨줄때 {...p} 이렇게 쓰면 되네...?
        })}
      </InfinityScroll>
    </React.Fragment>
  );
};

export default PostList;
