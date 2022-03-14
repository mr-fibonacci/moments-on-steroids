import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

import NoResults from "../assets/no-results.svg";
import Upload from "../assets/upload.svg";

const Asset = ({ spinner, upload, noResults, message }) => {
  const src = upload ? Upload : noResults ? NoResults : null;
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;
