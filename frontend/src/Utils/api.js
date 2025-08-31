// src/Utils/api.js
import axios from "axios";

const API = axios.create({
  // 👇 change if your API runs elsewhere
  //baseURL: "http://72.60.42.120:5000/api",
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// Attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
