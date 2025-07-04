import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000", // Match constants.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data.message;

      if (message === "Token expired") {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token"); // Remove the expired token
        window.location.href = "/login"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default api;
