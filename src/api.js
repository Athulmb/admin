import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000/api/", // backend base url
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  req.headers["Cache-Control"] = "no-cache"; // ✅ disable caching
  return req;
});

export default API;
