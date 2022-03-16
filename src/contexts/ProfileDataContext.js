import { createContext, useContext, useEffect, useState } from "react";
import { matchPath } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const { pathname } = useLocation();
  const matchedPath = matchPath(pathname, {
    path: "/profiles/:id",
    exact: true,
  });
  const pageProfileId = matchedPath?.params?.id;

  const currentUser = useCurrentUser();

  const [hasProfileDataLoaded, setHasProfileDataLoaded] = useState(false);

  const [profileData, setProfileData] = useState({
    currentUserProfile: { results: [] },
    pageProfile: { results: [] },
    followedProfiles: { results: [] },
    followingProfiles: { results: [] },
    popularProfiles: { results: [] },
  });

  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });

      setProfileData((prevState) => {
        const pageProfile = prevState.pageProfile.results[0];
        const currentUserProfile = prevState.currentUserProfile.results[0];

        const newState = Object.entries(prevState).reduce(
          (acc, [key, value]) => {
            const pageProfileWasClicked =
              key === "followedProfiles" &&
              clickedProfile?.id === pageProfile?.id;
            const pageProfileIsCurrentUserProfile =
              key === "followingProfiles" &&
              pageProfile?.id === currentUserProfile?.id;

            const results = pageProfileWasClicked
              ? [currentUserProfile, ...value.results]
              : pageProfileIsCurrentUserProfile
              ? [clickedProfile, ...value.results]
              : value.results;
            return {
              ...acc,
              [key]: {
                ...value,
                results: results.map((profile) =>
                  followHelper(profile, clickedProfile, data.id)
                ),
              },
            };
          },
          { ...prevState }
        );
        return newState;
      });
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

      setProfileData((prevState) => {
        const pageProfile = prevState.pageProfile.results[0];
        const currentUserProfile = prevState.currentUserProfile.results[0];

        const newState = Object.entries(prevState).reduce(
          (acc, [key, value]) => {
            const pageProfileWasClicked =
              key === "followedProfiles" &&
              clickedProfile?.id === pageProfile?.id;
            const pageProfileIsCurrentUserProfile =
              key === "followingProfiles" &&
              pageProfile?.id === currentUserProfile?.id;

            const results = pageProfileWasClicked
              ? value.results.filter(
                  (profile) => profile.id !== currentUserProfile?.id
                )
              : pageProfileIsCurrentUserProfile
              ? value.results.filter(
                  (profile) => profile.id !== clickedProfile.id
                )
              : value.results;
            return {
              ...acc,
              [key]: {
                ...value,
                results: results.map((profile) =>
                  unfollowHelper(profile, clickedProfile)
                ),
              },
            };
          },
          { ...prevState }
        );
        return newState;
      });
    } catch (err) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: pageProfile },
          { data: followedProfiles },
          { data: followingProfiles },
          { data: popularProfiles },
        ] = await Promise.all([
          axiosReq.get(`/profiles/${pageProfileId || ""}`),
          axiosReq.get(
            `/profiles/?owner__following__followed__profile=${
              pageProfileId || ""
            }`
          ),
          axiosReq.get(
            `/profiles/?owner__followed__owner__profile=${pageProfileId || ""}`
          ),
          axiosReq.get("/profiles/?ordering=-followers_count"),
        ]);

        setProfileData({
          currentUserProfile: {
            results: currentUser?.profile ? [currentUser?.profile] : [],
          },
          pageProfile: { results: [pageProfile] },
          followedProfiles,
          followingProfiles,
          popularProfiles,
        });
      } catch (err) {
      } finally {
        setHasProfileDataLoaded(true);
      }
    };

    setHasProfileDataLoaded(false);
    fetchData();
  }, [pageProfileId, currentUser]);

  return (
    <ProfileDataContext.Provider value={{ profileData, hasProfileDataLoaded }}>
      <SetProfileDataContext.Provider
        value={{
          setProfileData,
          handleFollow,
          handleUnfollow,
        }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
