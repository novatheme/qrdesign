import axios from "axios";

// Standard Fintech Axios instance
const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const apiKey = localStorage.getItem("apiKey") || "default-key";
  config.headers["x-api-key"] = apiKey;
  return config;
});

export default api;
