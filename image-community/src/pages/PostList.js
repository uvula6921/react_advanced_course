import React from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  React.useEffect(() => {
    dispatch(postActions.getPostFB());
  }, []);
  return (
    <React.Fragment>
      {/* <Post></Post> */}
      {post_list.map((p, idx) => {
        return <Post key={p.id} {...p}></Post>;
      })}
    </React.Fragment>
  );
};

export default PostList;
