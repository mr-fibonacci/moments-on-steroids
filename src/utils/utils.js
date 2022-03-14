import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((result) => result.id === cur.id) ? acc : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {
    console.log(err.request);
  }
};

export const fetchMoreDataState = async (resource, setState) => {
  // get the resource object variable name (the actual string)
  const [resourceName] = Object.keys({ resource: "" });
  try {
    const { data } = await axiosReq.get(resource.next);
    setState((prevState) => ({
      ...prevState,
      [resourceName]: {
        ...prevState[resourceName],
        next: data.next,
        results: data?.results.reduce((acc, cur) => {
          return acc.some((result) => result.id === cur.id)
            ? acc
            : [...acc, cur];
        }, prevState[resourceName].results),
      },
    }));
  } catch (err) {
    console.log(err.request);
  }
};

export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};

export const IMAGE_FILTERS = [
  { name: "1977", value: "_1977" },
  { name: "Brannan", value: "brannan" },
  { name: "Earlybird", value: "earlybird" },
  { name: "Hudson", value: "hudson" },
  { name: "Inkwell", value: "inkwell" },
  { name: "Lo-Fi", value: "lofi" },
  { name: "Kelvin", value: "kelvin" },
  { name: "no-filter", value: "normal" },
  { name: "Nashville", value: "nashville" },
  { name: "Rise", value: "rise" },
  { name: "Toaster", value: "toaster" },
  { name: "Valencia", value: "valencia" },
  { name: "Walden", value: "walden" },
  { name: "X-pro II", value: "xpro2" },
];
