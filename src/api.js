import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-fitvantage-production.up.railway.app/api"
});

export default api;
