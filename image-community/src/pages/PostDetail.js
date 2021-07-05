import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostDetail = (props) => {
  const id = props.match.params.id;
  const post_list = useSelector((store) => store.post.list);
  const user_info = useSelector((state) => state.user.user);
  const post_idx = post_list.findIndex((p) => p.id === id);
  const post = post_list[post_idx];
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (post) {
      return;
    }

    dispatch(postActions.getOnePostFB(id));
  }, []);

  return (
    <React.Fragment>
      {post && (
        <Post
          {...post}
          is_me={post.user_info.user_id === user_info?.uid ? true : false}
        />
      )}
      <CommentWrite />
      <CommentList />
    </React.Fragment>
  );
};

export default PostDetail;
