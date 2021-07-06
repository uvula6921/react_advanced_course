import React from "react";
import { Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {
  const [is_read, setIsRead] = React.useState(true);
  const user_id = useSelector((state) => state.user.user.uid);
  const notiCheck = () => {
    const notiDB = realtime.ref(`noti/${user_id}`);
    notiDB.update({ read: true });
    props._onClick();
  };

  React.useEffect(() => {
    const notiDB = realtime.ref(`noti/${user_id}`);
    // realtime DB 가져오는법

    notiDB.on("value", (snapshot) => {
      // realtime DB에서 .on()은 변화를 계속 감지함
      if (snapshot.val()) {
        setIsRead(snapshot.val().read);
      }
    });

    return () => notiDB.off();
  }, [user_id]);

  return (
    <React.Fragment>
      <Badge
        color="secondary"
        variant="dot"
        invisible={is_read}
        onClick={notiCheck}
      >
        <NotificationsIcon />
      </Badge>
    </React.Fragment>
  );
};

NotiBadge.defaultProps = {
  _onClick: () => {},
};

export default NotiBadge;
