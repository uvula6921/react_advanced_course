import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";
import { useSelector } from "react-redux";
import { firestore } from "../shared/firebase";

const PostDetail = (props) => {
  const id = props.match.params.id;
  const post_list = useSelector((store) => store.post.list);
  const user_info = useSelector((state) => state.user.user);
  const post_idx = post_list.findIndex((p) => p.id === id);
  const post_data = post_list[post_idx];
  const [post, setPost] = React.useState(post_data ? post_data : null);

  React.useEffect(() => {
    if (post) {
      return;
    }
    const postDB = firestore.collection("image_community");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
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

        setPost(post);
      });
  }, []);

  return (
    <React.Fragment>
      {post && (
        <Post
          {...post}
          is_me={post.user_info.user_id === user_info.uid ? true : false}
        />
      )}
      <CommentWrite />
      <CommentList />
    </React.Fragment>
  );
};

export default PostDetail;
