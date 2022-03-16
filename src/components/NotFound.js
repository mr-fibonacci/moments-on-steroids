import React from "react";
import Asset from "./Asset";

const NotFound = () => {
  return (
    <div className="p-5 m-5 border border-white rounded">
      <Asset
        noResults
        message="Apologies, a webpage with the following URL could not be found."
      />
    </div>
  );
};

export default NotFound;
