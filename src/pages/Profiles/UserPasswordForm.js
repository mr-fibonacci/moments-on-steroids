import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useProfileRedirect } from "../../hooks/useProfileRedirect";

const UserPasswordForm = () => {
  useProfileRedirect();
  const history = useHistory();
  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
    old_password: "",
  });
  const { new_password1, new_password2, old_password } = userData;
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post(
        "/dj-rest-auth/password/change/",
        userData
      );
      console.log("change user name data", data);
    } catch (err) {
      console.log(err.request);
      setErrors(err.response?.data);
    }
  };
  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>New password</Form.Label>
              <Form.Control
                placeholder="new password"
                type="text"
                value={new_password1}
                onChange={handleChange}
                name="new_password1"
              />
            </Form.Group>
            {errors?.new_password1?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Form.Group>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                placeholder="confirm new password"
                type="text"
                value={new_password2}
                onChange={handleChange}
                name="new_password2"
              />
            </Form.Group>
            {errors?.new_password2?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Form.Group>
              <Form.Label>Old password</Form.Label>
              <Form.Control
                placeholder="old password"
                type="text"
                value={old_password}
                onChange={handleChange}
                name="old_password"
              />
            </Form.Group>
            {errors?.old_password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => history.goBack()}
            >
              cancel
            </Button>
            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UserPasswordForm;
