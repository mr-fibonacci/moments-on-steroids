import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import btnStyles from "../../styles/Button.module.css";
import FilterSlider from "../../components/FilterSlider";
import appStyles from "../../App.module.css";

import { axiosReq, axiosRes } from "../../api/axiosDefaults";

function PostEditForm() {
  const { id } = useParams();
  const history = useHistory();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
    image_filter: "normal",
  });
  const { title, content, image, image_filter } = postData;
  const [errors, setErrors] = useState({});
  const imageFile = useRef();
  useEffect(() => {
    handleMount();
  }, []);

  const handleMount = async () => {
    try {
      const { data } = await axiosReq.get(`/posts/${id}/`);
      const { title, content, image, image_filter, is_owner } = data;
      if (!is_owner) {
        history.goBack();
      }
      setPostData({
        title,
        content,
        image,
        image_filter,
      });
    } catch (err) {
      console.log(err.response);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }
    formData.append("image_filter", image_filter);
    try {
      await axiosRes.put(`/posts/${id}/`, formData);
      history.goBack();
    } catch (err) {
      console.log(err.request);
      setErrors(err.response?.data);
    }
  };
  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = (newFilter) => {
    setPostData((prevState) => ({
      ...prevState,
      image_filter: newFilter,
    }));
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          rows={6}
          value={content}
          onChange={handleChange}
        />
        {errors?.content?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container className={appStyles.Content}>
            <Form.Group className="text-center">
              {image && (
                <figure className={image_filter}>
                  <Image className={appStyles.Image} src={image} />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <FilterSlider
                image={image}
                image_filter={image_filter}
                handleClick={handleClick}
              />
              <Form.File
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setPostData({
                      ...postData,
                      image_filter: "normal",
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;
