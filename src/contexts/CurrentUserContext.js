import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";

const CurrentUserContext = createContext();
const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        console.log("inside req interceptor");
        try {
          await axios.post("/dj-rest-auth/token/refresh/");
          console.log("refreshed the token successfully");
        } catch (err) {
          console.log(err.request);
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              history.push("/signin");
            }
            return null;
          });
          console.log("ERR1!");
          return config;
        }
        console.log("ERR2?");
        return config;
      },
      (err) => {
        console.log("REQ interceptor error:");
        return Promise.reject(err);
      }
    );
    axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(
          error,
          error?.request,
          "inside interceptor, ERROR STATUS:",
          error?.response?.status,
          "ERROR CONFIG:",
          error?.config
        );
        if (error?.response?.status === 401) {
          console.log("ACCESS TOKEN EXPIRED");
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            console.log("ACCESS TOKEN REFRESHED");
          } catch (err) {
            console.log("REFRESH TOKEN EXPIRED", err.request);
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
          }
          return axios(error.config);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    handleMount();
  }, []);

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err.request);
    }
  };
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
