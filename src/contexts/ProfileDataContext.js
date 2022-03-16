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

  const [pageProfileDataHasLoaded, setPageProfileDataHasLoaded] =
    useState(false);
  const [globalProfileDataHasLoaded, setGlobalProfileDataHasLoaded] =
    useState(false);

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
        const [pageProfile] = prevState.pageProfile.results;
        const [currentUserProfile] = prevState.currentUserProfile.results;

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
        const [pageProfile] = prevState.pageProfile.results;
        const [currentUserProfile] = prevState.currentUserProfile.results;

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
    const fetchPageProfileData = async () => {
      try {
        const [
          { data: pageProfile },
          { data: followedProfiles },
          { data: followingProfiles },
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
        ]);

        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
          followedProfiles,
          followingProfiles,
        }));
      } catch (err) {
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { fetchingError: true, results: [] },
          followedProfiles: { results: [] },
          followingProfiles: { results: [] },
        }));
      } finally {
        setPageProfileDataHasLoaded(true);
      }
    };

    setPageProfileDataHasLoaded(false);
    fetchPageProfileData();
  }, [pageProfileId]);

  useEffect(() => {
    const fetchGlobalProfileData = async () => {
      try {
        const { data: popularProfiles } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );

        setProfileData((prevState) => ({
          ...prevState,
          currentUserProfile: {
            results: currentUser?.profile ? [currentUser?.profile] : [],
          },
          popularProfiles,
        }));
      } catch (err) {
        setProfileData((prevState) => ({
          ...prevState,
          currentUserProfile: {
            results: currentUser?.profile ? [currentUser?.profile] : [],
          },
          popularProfiles: { results: [] },
        }));
      } finally {
        setGlobalProfileDataHasLoaded(true);
      }
    };
    setGlobalProfileDataHasLoaded(false);
    fetchGlobalProfileData();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider
      value={{
        profileData,
        pageProfileDataHasLoaded,
        globalProfileDataHasLoaded,
      }}
    >
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
