import React from "react";
import defaultImage from "../default_image.jpeg";
import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configureStore";

const Post = (props) => {
  return (
    <React.Fragment>
      {/* Grid는 다양한 모양으로 변신할 수 있도록 props 종류들을 만들어두고 Post.js에서 Grid에 필요한 props만 넘겨주면서 이용한다. */}
      <Grid>
        <Grid padding="0 16px" is_flex>
          <Grid is_flex width="auto">
            {/* 헤더 */}
            <Image shape="circle" src={props.image_url}></Image>
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <Button
                text="수정"
                padding="4px"
                width="auto"
                margin="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              ></Button>
            )}
          </Grid>
        </Grid>
        <Grid padding="16px">
          {/* 내용 */}
          <Text>{props.contents}</Text>
        </Grid>
        <Grid>
          {/* 메인 이미지 */}
          <Image shape="rectangle" src={props.image_url}></Image>
        </Grid>
        <Grid padding="16px">
          {/* 댓글 */}
          <Text bold>댓글 {props.comment_cnt}개</Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "bbakyong",
    user_profile: `${defaultImage}`,
  },
  image_url: `${defaultImage}`,
  contents: "사란짠",
  comment_cnt: 10,
  insert_dt: "2021-07-02 16:12:00",
  is_me: false,
};

export default Post;
