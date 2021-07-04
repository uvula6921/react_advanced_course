import React from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  React.useEffect(() => {
    if (post_list.length === 0) {
      dispatch(postActions.getPostFB());
    }
  }, []);
  return (
    <React.Fragment>
      {/* <Post></Post> */}
      {post_list.map((p, idx) => {
        return <Post key={p.id} {...p}></Post>;
        // p에 있는 각 key, value를 한 번에 props로 넘겨줄때 {...p} 이렇게 쓰면 되네...?
      })}
    </React.Fragment>
  );
};

export default PostList;
