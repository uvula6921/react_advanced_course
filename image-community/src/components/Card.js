import React from "react";
import { Grid, Image, Text } from "../elements";
import { history } from "../redux/configureStore";

const Card = (props) => {
  return (
    <React.Fragment>
      <Grid
        _onClick={() => {
          history.push(`/post/${props.post_id}`);
        }}
        padding="16px"
        is_flex
        bg="#fff"
      >
        <Grid width="auto" margin="8px 8px 0 0">
          <Image size="85" shape="square" src={props.image_url}></Image>
        </Grid>
        <Grid>
          <Text>
            <b>{props.user_name}</b> 님이 게시글에 댓글을 남겼습니다.
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Card.defaultProps = {
  image_url: "",
  user_name: "",
  post_id: null,
};

export default Card;
