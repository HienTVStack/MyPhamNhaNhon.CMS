import axios from "axios";
import queryString from "query-string";
import { parse, stringify } from "qs";

const baseUrl = "https://myphamnhanhon-server.vercel.app/api/";
// const baseUrl = "http://localhost:3001/api/";
const getToken = () => localStorage.getItem("token");

// Tiki API
const tikiURL = "https://api.tiki.vn/integration/v2.1/requests";

export const tikiAxios = axios.create({
  baseURL: tikiURL,
  headers: {
    "Content-Type": "application/json",
    authorization: "VpgHRqZ3Hw_Td7pw12SjRrHvDGfL8qYM3Zdw-pceAQQ.9q7l5J5VgkDrk1bkQebRcQlFwhXrZf_c3gfPcChoQeI",
  },
});

///
const axiosClient = axios.create({
  baseURL: baseUrl,
  // paramsSerializer: (params) => queryString.stringify({ params }),
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
});

axiosClient.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  };
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (err) => {
    if (!err.response) {
      return console.warn(err);
    }
    throw err.response;
  }
);

export default axiosClient;
