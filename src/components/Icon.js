import React from "react";
import styles from "../styles/Icon.module.css";

function Icon(props) {
  // Short explanation/graphic on how this is working
  const { component: Component, text, nav = false, label } = props;
  return (
    <span
      {...props}
      aria-label={label}
      className={`${styles.Icon} ${nav ? styles.NavIcon : ""}`}
    >
      <Component className="mx-2" />
      {text}
    </span>
  );
}

export default Icon;
