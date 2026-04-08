import axios from 'axios';

const api = axios.create({
  
  baseURL: 'http://192.168.100.39:8080', 

  
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;