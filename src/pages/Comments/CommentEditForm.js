import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../styles/CommentCreateEditForm.module.css";
import InputGroup from "react-bootstrap/InputGroup";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

function CommentEditForm(props) {
  const {
    id,
    profile_id,
    content,
    setShowEditForm,
    setComments,
    profileImage,
  } = props;
  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? { ...comment, content: formContent.trim() }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err.request);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            as="textarea"
            value={formContent}
            onChange={handleChange}
            rows={4}
          />
        </InputGroup>
      </Form.Group>
      <div className="text-right">
        <button
          className={styles.Button}
          disabled={!content.trim()}
          type="submit"
        >
          save
        </button>
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
        >
          cancel
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
