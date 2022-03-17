import React from "react";
import { useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "./Icon";
import styles from "../styles/MoreDropdown.module.css";

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <div
    role="button"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <Icon dots />
  </div>
));

function MoreDropdown({ handleAdd, handleEdit, handleDelete }) {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu className="text-center p-0">
        <Dropdown.Item className={styles.DropdownItem} onClick={handleEdit}>
          <Icon edit />
        </Dropdown.Item>
        {handleDelete && (
          <Dropdown.Item className={styles.DropdownItem} onClick={handleDelete}>
            <Icon remove />
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MoreDropdown;

export function ProfileEditDropdown({ id }) {
  const history = useHistory();
  return (
    <Dropdown
      style={{ position: "absolute", right: "0px", zIndex: 99 }}
      className="ml-auto px-3"
      drop="left"
    >
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu className="p-0">
        <Dropdown.Item onClick={() => history.push(`/profiles/${id}/edit`)}>
          <Icon user text="edit profile" />
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
        >
          <Icon editSquare text="change username" />
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
        >
          <Icon password text="change password" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
