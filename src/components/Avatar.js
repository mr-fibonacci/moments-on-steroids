import React from "react";
import styles from "../styles/Avatar.module.css";

function Avatar({ src, height = 45, text }) {
  return (
    <span>
      <img
        className={styles.Avatar}
        alt="avatar"
        src={src}
        height={height}
        width={height}
      />
      {text}
    </span>
  );
}

export default Avatar;
