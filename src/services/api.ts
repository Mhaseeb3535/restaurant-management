import axios from "axios";

const browserApiBaseUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000/api`
    : "http://localhost:5000/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || browserApiBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
