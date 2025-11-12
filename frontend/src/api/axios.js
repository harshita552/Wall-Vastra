import axios from "axios";

// Determine base URL automatically based on Vite environment
const baseURL =
   process.env.REACT_APP_API_BASE_UR ||
  (process.env.MODE === "development"
    ? "https://frame-customization-backend.onrender.com/api"
    : "https://frame-customization-backend.onrender.com/api");

const API = axios.create({
  baseURL,
  withCredentials: true, // needed if using cookies/auth sessions
});

// Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle expired sessions / 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login page if we have any login page its a future enhancement
    }
    return Promise.reject(error);
  }
);

export default API;
