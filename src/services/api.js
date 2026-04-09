import axios from 'axios';

const api = axios.create({
  
  baseURL: 'https://resonforge-api-production.up.railway.app', 

  
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
