import React from "react";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { NavLink, useHistory } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import { useClickOutsideToggle } from "../hooks/useClickOutsideToggle";
import Avatar from "./Avatar";
import logo from "../assets/logo.svg";
import styles from "../styles/NavBar.module.css";
import { removeTokenTimestamp } from "../utils/utils";
import Icon from "./Icon";

function NavBar() {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();
  const history = useHistory();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
      history.push("/");
    } catch (err) {
      console.log(err.request);
    }
  };
  return (
    <Navbar
      expanded={expanded}
      expand="md"
      fixed="top"
      className={styles.NavBar}
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height={45} />
          </Navbar.Brand>
        </NavLink>
        {currentUser && (
          <NavLink exact activeClassName={styles.Active} to={"/posts/create"}>
            <Icon add text="add post" />
          </NavLink>
        )}
        <Navbar.Toggle
          ref={ref}
          aria-controls="navbar"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse className="justify-content-end" id="navbar">
          <Nav className="align-items-md-center">
            {currentUser ? (
              <>
                <NavLink exact activeClassName={styles.Active} to={"/"}>
                  <Icon home text="home" />
                </NavLink>
                <NavLink activeClassName={styles.Active} to={"/feed"}>
                  <Icon feed text="feed" />
                </NavLink>
                <NavLink activeClassName={styles.Active} to={"/liked"}>
                  <Icon heart text="liked" />
                </NavLink>
                <NavLink exact to="/" onClick={handleSignOut}>
                  <Icon signOut text="sign out" />
                </NavLink>
                <NavLink
                  activeClassName={styles.Active}
                  to={`/profiles/${currentUser?.profile_id}`}
                >
                  <Avatar src={currentUser?.profile_image} text="profile" />
                </NavLink>
              </>
            ) : (
              <>
                <NavLink exact activeClassName={styles.Active} to={"/"}>
                  <Icon home text="home" />
                </NavLink>
                <NavLink activeClassName={styles.Active} to="/signin">
                  <Icon signIn text="sign in" />
                </NavLink>
                <NavLink activeClassName={styles.Active} to="/signup">
                  <Icon signUp text="sign up" />
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
