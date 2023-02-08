import axios from "axios";
import jwt_decode from "jwt-decode";

import {AxiosRequestConfig} from "axios";

interface DecodedJwt {
  iat: number,
  exp: number,
  username: string,
  id: string
}

let hostname = window.location.hostname;
let url = "";
if (hostname === "localhost") {
  url = "http://localhost:4000"
} else {
  url = "/";
}
console.log(hostname);

let axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json"
  }
});

const onRequest = (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  if (config.url === "/api/login" || config.url === "/api/signup") {
    return Promise.resolve(config);
  }
  let token = localStorage.getItem("token");
  if (!token) {
    return Promise.reject({err: "No token"});
  }
  const decoded: DecodedJwt = jwt_decode(token);
  if (Date.now() >= decoded.exp * 1000) {
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    return Promise.reject("Token expired");
  }
  config && config.headers ? config.headers.authorization = token : console.log("Weird err");
  return Promise.resolve(config);
}

axiosInstance.interceptors.request.use(onRequest);

export default axiosInstance;