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
      <Dropdown.Menu className="text-center">
        <Dropdown.Item className={styles.DropdownItem} onClick={handleEdit}>
          <Icon edit />
        </Dropdown.Item>
        {handleDelete && (
          <Dropdown.Item className={styles.DropdownItem} onClick={handleDelete}>
            <Icon delete />
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
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => history.push(`/profiles/${id}/edit`)}>
          edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
        >
          change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
        >
          change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
