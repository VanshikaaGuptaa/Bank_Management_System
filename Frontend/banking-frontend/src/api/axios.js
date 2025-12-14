import axios from "axios";

// Backend is on 8080, controllers are under /api/...
const api = axios.create({
  baseURL: "http://localhost:9191/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;