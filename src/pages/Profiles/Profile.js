import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import btnStyles from "../../styles/Button.module.css";
import Icon from "../../components/Icon";

function Profile(props) {
  const {
    profile,
    handleFollow,
    handleUnfollow,
    imageSize = 55,
    stats = true,
  } = props;
  const {
    id,
    posts_count,
    followers_count,
    following_count,
    following_id,
    image,
    owner,
  } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const statsIcons = (
    <div className="d-flex px-2 justify-content-between text-center">
      <Link to={`/profiles/${id}`}>
        <Icon post text={posts_count} />
      </Link>
      <Link to={`/profiles/${id}`}>
        <Icon threeUsers text={followers_count} />
      </Link>
      <Link to={`/profiles/${id}`}>
        <Icon twoUsers text={following_count} />
      </Link>
    </div>
  );

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>

        <Link
          style={{ flex: 1, wordBreak: "break-all" }}
          className="text-center py-2"
          to={`/profiles/${id}`}
        >
          <b>{owner}</b>
        </Link>
        {stats && <div className="d-none d-md-block">{statsIcons}</div>}
        <div>
          {currentUser ? (
            following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : !is_owner ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ) : (
              <div className={`${btnStyles.Button} invisible`} />
            )
          ) : stats ? (
            <div
              className={`${btnStyles.Button} d-xs-block d-md-none invisible`}
            />
          ) : (
            <div className={`${btnStyles.Button} invisible`} />
          )}
        </div>
      </div>
      <div className={stats ? "d-md-none pt-1" : "d-block pt-1"}>
        {statsIcons}
      </div>
    </>
  );
}

export default Profile;
