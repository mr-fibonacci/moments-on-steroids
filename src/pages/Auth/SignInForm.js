import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { NavLink } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useLastLocation } from "react-router-last-location";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();
  const lastLocation = useLastLocation();
  useRedirect(false);
  console.log("last location:", lastLocation);
  const [errors, setErrors] = useState({});
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);

      if (
        lastLocation.pathname === "/signup" ||
        lastLocation.pathname === "/signin" ||
        !lastLocation
      ) {
        history.push("/");
      } else {
        history.goBack();
      }
    } catch (err) {
      setErrors(err.response?.data);
    }
  };
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-0 p-md-2" md={6}>
        <Container
          className={appStyles.Content}
          style={{ padding: "30px 10px" }}
        >
          <h1 className={styles.Header}>sign in</h1>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group>
              <Form.Control
                placeholder="username"
                className={styles.Input}
                type="text"
                onChange={handleChange}
                value={username}
                name="username"
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Form.Group>
              <Form.Control
                placeholder="password"
                className={styles.Input}
                type="password"
                onChange={handleChange}
                value={password}
                name="password"
              />
            </Form.Group>
            {errors?.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
            >
              sign in
            </Button>
            {errors?.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <NavLink className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </NavLink>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-0 p-md-2`}
        style={{ height: "320px" }}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={
            "https://res.cloudinary.com/drlqahj5d/image/upload/v1630595345/hero_f2ypz1.jpg"
          }
        />
      </Col>
    </Row>
  );
}

export default SignInForm;
