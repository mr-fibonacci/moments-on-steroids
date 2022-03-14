import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useProfileRedirect } from "../../hooks/useProfileRedirect";

const UsernameForm = () => {
  useProfileRedirect();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    handleMount();
  }, []);
  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("/dj-rest-auth/user/");
      setUsername(data.username);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
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
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
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
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              type="submit"
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;
