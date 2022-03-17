import React from "react";
import Container from "react-bootstrap/Container";
import Profile from "./Profile";
import { Swiper, SwiperSlide } from "swiper/react";
import appStyles from "../../App.module.css";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import Asset from "../../components/Asset";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";

const PopularProfiles = ({ mobile }) => {
  const { profileData, globalProfileDataHasLoaded } = useProfileData();
  const { popularProfiles } = profileData;
  const { handleFollow, handleUnfollow } = useSetProfileData();
  return mobile ? (
    <Container
      className={`${appStyles.Content} d-block d-lg-none text-center mb-3`}
    >
      {!globalProfileDataHasLoaded ? (
        <Asset spinner />
      ) : (
        <>
          <div className="my-1">Most followed profiles.</div>
          <Swiper
            style={{ marginLeft: "-10px", marginRight: "-10px" }}
            slidesPerView={3.5}
          >
            {popularProfiles?.results?.map((profile) => (
              <SwiperSlide key={profile.id}>
                <Link to={`/profiles/${profile.id}`}>
                  <div className="d-flex flex-column align-items-center">
                    <Image
                      roundedCircle
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                      }}
                      src={profile.image}
                    />
                    {profile.owner}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </Container>
  ) : (
    <Container className={appStyles.Content}>
      {!globalProfileDataHasLoaded ? (
        <Asset spinner />
      ) : (
        <>
          <p>Most followed profiles.</p>
          {popularProfiles?.results?.map((profile) => (
            <Profile
              key={profile.id}
              profile={profile}
              stats={false}
              handleFollow={() => handleFollow(profile)}
              handleUnfollow={() => handleUnfollow(profile)}
            />
          ))}
        </>
      )}
    </Container>
  );
};

export default PopularProfiles;
