import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const is_login = useSelector((state) => state.user.is_login);
  const [contents, setContents] = React.useState("");
  const changeContents = (e) => {
    setContents(e.target.value);
  };

  if (!is_login) {
    return (
      <Grid margin="100px 0" padding="16px" center>
        <Text size="16px" bold>
          로그인을 해야 글을 쓸 수 있습니다.
        </Text>
        <Button
          _onClick={() => {
            history.replace("/login");
          }}
        >
          로그인 하러가기.
        </Button>
      </Grid>
    );
  }
  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="0px" size="36px" bold>
          게시글 작성
        </Text>
        <Upload />
      </Grid>

      <Grid>
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold>
            미리보기
          </Text>
        </Grid>

        <Image shape="rectangle" />
      </Grid>

      <Grid padding="16px">
        <Input
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="16px">
        <Button _onClick={() => dispatch(postActions.addPostFB(contents))}>
          게시글 작성
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
