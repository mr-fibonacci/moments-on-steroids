import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/Profile.module.css";

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
  return (
    <div className="my-3 d-flex align-items-center">
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className="ml-3" style={{ wordBreak: "break-all" }}>
        <div>
          <b>{owner}</b>
        </div>
        {stats && (
          <div className={styles.Stats}>
            posts: {posts_count} followers: {followers_count} following:{" "}
            {following_count}
          </div>
        )}
      </div>
      <div className="text-right ml-auto">
        {currentUser &&
          (following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => handleUnfollow(profile)}
            >
              unfollow
            </Button>
          ) : (
            !is_owner && (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            )
          ))}
      </div>
    </div>
  );
}

export default Profile;
