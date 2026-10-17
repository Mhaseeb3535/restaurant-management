import axios from "axios";

const browserApiBaseUrl =
  typeof window !== "undefined" && import.meta.env.DEV
    ? `${window.location.protocol}//${window.location.hostname}:5000/api`
    : "/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || browserApiBaseUrl;

export function getApiAssetUrl(assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
  const baseUrl =
    apiOrigin || (typeof window !== "undefined" ? window.location.origin : "");
  if (!baseUrl) {
    return assetPath;
  }
  return new URL(assetPath, baseUrl).toString();
}

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
