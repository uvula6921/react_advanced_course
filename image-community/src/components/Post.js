import React from "react";
import defaultImage from "../default_image.jpeg";

const Post = (props) => {
  return (
    <>
      <div>user profile / user name / inser_dt / is_me (edit btn)</div>
      <div>contents</div>
      <div>image</div>
      <div>comment cnt</div>
    </>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "bbakyong",
    user_profile: { defaultImage },
  },
  image_url: { defaultImage },
  contents: "사란짠",
  comment_cnt: 10,
  insert_dt: "2021-07-02 16:12:00",
};

export default Post;
