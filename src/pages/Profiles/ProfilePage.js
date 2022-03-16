import React, { useState, useEffect } from "react";

import { useParams } from "react-router";
import Post from "../Posts/Post";
import Profile from "./Profile";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData, fetchMoreDataState } from "../../utils/utils";
import "../../styles/ProfilePage.css";
import Asset from "../../components/Asset";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import appStyles from "../../App.module.css";

import { ProfileEditDropdown } from "../../components/MoreDropdown";
import btnStyles from "../../styles/Button.module.css";
import PopularProfiles from "../Profiles/PopularProfiles";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function ProfilePage() {
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const { profileData, pageProfileDataHasLoaded } = useProfileData();
  const { pageProfile, followingProfiles, followedProfiles } = profileData;
  const [profile] = pageProfile.results;

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();

  const [profilePosts, setProfilePosts] = useState({ results: [] });
  const [profilePostsHaveLoaded, setProfilePostsHaveLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: profilePosts }] = await Promise.all([
          axiosReq.get(`/posts/?owner__profile=${id}`),
        ]);

        setProfilePosts(profilePosts);
      } catch (err) {
        console.log(err.request);
      } finally {
        setProfilePostsHaveLoaded(true);
      }
    };

    setProfilePostsHaveLoaded(false);
    fetchData();
  }, [id]);

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile={true} />
        <Container className={appStyles.Content}>
          {pageProfileDataHasLoaded ? (
            pageProfile?.fetchingError ? (
              <Asset
                noResults
                message="Apologies, unable to fetch the given profile."
              />
            ) : (
              <>
                {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
                <Row noGutters className="px-3">
                  <Col lg={3} className="text-center text-lg-left">
                    <Image
                      className="ProfileImage"
                      roundedCircle
                      src={profile?.image}
                    />
                  </Col>
                  <Col lg={6} className="text-center">
                    <h3 className="m-2">{profile?.owner}</h3>

                    <Row className="text-center justify-content-center no-gutters">
                      <Col xs={3} className="my-2">
                        <div>{profile?.posts_count}</div>
                        <div>posts</div>
                      </Col>
                      <Col xs={3} className="my-2">
                        <div>{profile?.followers_count}</div>
                        <div>followers</div>
                      </Col>
                      <Col xs={3} className="my-2">
                        <div>{profile?.following_count}</div>
                        <div>following</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={3} className="text-center text-lg-right">
                    {!profile?.is_owner && (
                      <>
                        {currentUser &&
                          (profile?.following_id ? (
                            <Button
                              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                              onClick={() => handleUnfollow(profile)}
                            >
                              unfollow
                            </Button>
                          ) : (
                            !profile?.is_owner && (
                              <Button
                                className={`${btnStyles.Button} ${btnStyles.Black}`}
                                onClick={() => handleFollow(profile)}
                              >
                                follow
                              </Button>
                            )
                          ))}
                      </>
                    )}
                  </Col>
                  {profile?.content && (
                    <Col className="text-center p-3">{profile.content}</Col>
                  )}
                </Row>
                <hr />
                <Tabs variant="pills">
                  <Tab eventKey="posts" title="posts">
                    {profilePostsHaveLoaded ? (
                      <InfiniteScroll
                        dataLength={profilePosts?.results.length}
                        next={() =>
                          fetchMoreData(profilePosts, setProfilePosts)
                        }
                        hasMore={!!profilePosts.next}
                        loader={<Asset spinner />}
                      >
                        {profilePosts?.results.length ? (
                          profilePosts?.results.map((post) => (
                            <Post
                              key={post.id}
                              {...post}
                              setPosts={setProfilePosts}
                            />
                          ))
                        ) : (
                          <Asset
                            noResults
                            message={`No results found, ${profile?.owner} hasn't posted yet.`}
                          />
                        )}
                      </InfiniteScroll>
                    ) : (
                      <Asset spinner />
                    )}
                  </Tab>
                  <Tab eventKey="followers" title="followers">
                    <InfiniteScroll
                      dataLength={followedProfiles?.results.length}
                      next={() =>
                        fetchMoreDataState(followedProfiles, setProfileData)
                      }
                      hasMore={!!followedProfiles.next}
                      loader={<Asset spinner />}
                    >
                      <Container fluid>
                        {followedProfiles?.results.length ? (
                          followedProfiles?.results.map((profile) => (
                            <Profile
                              key={profile.id}
                              profile={profile}
                              handleFollow={() => handleFollow(profile)}
                              handleUnfollow={() => handleUnfollow(profile)}
                            />
                          ))
                        ) : (
                          <Asset
                            noResults
                            message={`No profiles found, no users are following ${profile?.owner} yet.`}
                          />
                        )}
                      </Container>
                    </InfiniteScroll>
                  </Tab>
                  <Tab eventKey="following" title="following">
                    <InfiniteScroll
                      dataLength={followingProfiles?.results?.length}
                      next={() =>
                        fetchMoreDataState(followingProfiles, setProfileData)
                      }
                      hasMore={!!followingProfiles.next}
                      loader={<Asset spinner />}
                    >
                      <Container fluid>
                        {followingProfiles?.results.length ? (
                          followingProfiles?.results.map((profile) => (
                            <Profile
                              key={profile.id}
                              profile={profile}
                              handleFollow={() => handleFollow(profile)}
                              handleUnfollow={() => handleUnfollow(profile)}
                            />
                          ))
                        ) : (
                          <Asset
                            noResults
                            message={`No profiles found, ${profile?.owner} isn't following anyone yet.`}
                          />
                        )}
                      </Container>
                    </InfiniteScroll>
                  </Tab>
                </Tabs>
              </>
            )
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ProfilePage;
