import axios from "axios";

const API = axios.create({
  baseURL: "https://frame-customization-backend.onrender.com/api",
  withCredentials: true, // only if you need cookies/auth
});

export default API;
