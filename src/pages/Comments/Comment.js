import React, { useState } from "react";
import Media from "react-bootstrap/Media";
import { Link } from "react-router-dom";
import CommentEditForm from "./CommentEditForm";
import Avatar from "../../components/Avatar";
import MoreDropdown from "../../components/MoreDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

function Comment(props) {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    content,
    setComments,
    setPost,
    updated_at,
  } = props;
  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err.request);
    }
  };

  return showEditForm ? (
    <CommentEditForm
      id={id}
      profile_id={profile_id}
      content={content}
      profileImage={profile_image}
      setComments={setComments}
      setShowEditForm={setShowEditForm}
    />
  ) : (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <b style={{ color: "#2142b2" }}>{owner}</b>{" "}
          <span style={{ fontWeight: "lighter", color: "#c1c1c5" }}>
            {updated_at}
          </span>
          <p>{content}</p>
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
}

export default Comment;
