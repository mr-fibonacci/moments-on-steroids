import axios from "axios";
import React, { useEffect, useState } from "react";
import Comment from "../Comments/Comment";
import CommentCreateForm from "../Comments/CommentCreateForm";
import { useHistory, useParams } from "react-router";
import Post from "./Post";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import PopularProfiles from "../Profiles/PopularProfiles";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";

function PostPage() {
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const { id } = useParams();
  const history = useHistory();
  const [post, setPost] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  useEffect(() => {
    handleMount();
  }, []);
  const handleMount = async () => {
    try {
      const [{ data: post }, { data: comments }] = await Promise.all([
        axiosReq.get(`/posts/${id}`),
        axios.get(`/comments/?post=${id}`),
      ]);
      console.log("post", post);
      setPost({ results: [post] });
      setComments(comments);
    } catch (err) {
      console.log(err.request);
    }
  };

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err.request);
    }
  };

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Post
          {...post.results[0]}
          setPosts={setPost}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          postPage
        />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <>
              <CommentCreateForm
                profile_id={currentUser.profile_id}
                profileImage={profile_image}
                post={id}
                setPost={setPost}
                setComments={setComments}
              />
            </>
          ) : comments.results.length ? (
            "Comments"
          ) : null}

          {comments.results.length ? (
            <InfiniteScroll
              dataLength={comments.results.length}
              next={() => fetchMoreData(comments, setComments)}
              hasMore={!!comments.next}
              loader={<Asset children={<Spinner animation="border" />} />}
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  setPost={setPost}
                  {...comment}
                  setComments={setComments}
                />
              ))}
            />
          ) : currentUser ? (
            "No comments yet, be the first one to comment!"
          ) : (
            <span>No comments...</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostPage;
