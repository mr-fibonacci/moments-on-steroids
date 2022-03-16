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

function Icon(props) {
  const {
    text,
    nav = false,
    add,
    home,
    feed,
    heart,
    signUp,
    signIn,
    signOut,
    dots,
    edit,
    remove,
    comment,
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

  return (
    <span
      {...props}
      aria-label={label}
      className={`${styles.Icon} ${nav ? styles.NavIcon : ""}`}
    >
      <span className="mx-1">{component}</span>
      <span>{text}</span>
    </span>
  );
}

export default Icon;
