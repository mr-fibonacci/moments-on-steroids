import React from "react";
import styles from "../styles/Icon.module.css";
import { ReactComponent as Add } from "../assets/add-post.svg";
import { ReactComponent as Home } from "../assets/home.svg";
import { ReactComponent as Feed } from "../assets/feed.svg";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as SignUp } from "../assets/signup.svg";
import { ReactComponent as SignIn } from "../assets/signin.svg";
import { ReactComponent as SignOut } from "../assets/signout.svg";

import { ReactComponent as Dots } from "../assets/dots.svg";
import { ReactComponent as Edit } from "../assets/edit.svg";
import { ReactComponent as Remove } from "../assets/remove.svg";

import { ReactComponent as Comment } from "../assets/comment.svg";
import { ReactComponent as Camera } from "../assets/camera.svg";

import { ReactComponent as User } from "../assets/user.svg";
import { ReactComponent as Key } from "../assets/key.svg";
import { ReactComponent as EditSquare } from "../assets/edit-square.svg";

import { ReactComponent as PostIcon } from "../assets/post.svg";
import { ReactComponent as TwoUsers } from "../assets/2-user.svg";
import { ReactComponent as ThreeUsers } from "../assets/3-user.svg";

function Icon(props) {
  const {
    text,
    nav = false,
    add,
    home,
    feed,
    heart,
    liked,
    signUp,
    signIn,
    signOut,
    dots,
    edit,
    remove,
    comment,
    camera,
    user,
    password,
    editSquare,
    post,
    twoUsers,
    threeUsers,
  } = props;
  let component, label;

  if (add) {
    component = <Add />;
    label = "add";
  }
  if (home) {
    component = <Home />;
    label = "home";
  }
  if (feed) {
    component = <Feed />;
    label = "feed";
  }
  if (heart) {
    component = <Heart />;
    label = "heart";
  }
  if (signUp) {
    component = <SignUp />;
    label = "sign up";
  }
  if (signIn) {
    component = <SignIn />;
    label = "sign in";
  }
  if (signOut) {
    component = <SignOut />;
    label = "sign out";
  }

  if (dots) {
    component = <Dots />;
    label = "more";
  }
  if (edit) {
    component = <Edit />;
    label = "edit";
  }
  if (remove) {
    component = <Remove />;
    label = "delete";
  }

  if (comment) {
    component = <Comment />;
    label = "comments";
  }
  if (camera) {
    component = <Camera />;
    label = "camera";
  }

  if (user) {
    component = <User />;
    label = "user";
  }

  if (password) {
    component = <Key />;
    label = "password";
  }

  if (editSquare) {
    component = <EditSquare />;
    label = "edit";
  }

  if (post) {
    component = <PostIcon />;
    label = "post";
  }

  if (twoUsers) {
    component = <TwoUsers />;
    label = "two users";
  }

  if (threeUsers) {
    component = <ThreeUsers />;
    label = "three users";
  }

  return (
    <span
      {...props}
      aria-label={label}
      className={`${styles.Icon} ${heart && styles.Heart} ${
        liked && styles.Liked
      } ${nav && styles.NavIcon}`}
    >
      <span className="mx-1">{component}</span>
      <span>{text}</span>
    </span>
  );
}

export default Icon;
