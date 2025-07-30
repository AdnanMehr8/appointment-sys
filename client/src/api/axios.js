import axios from 'axios';
import { logoutUserOnTokenError } from '../auth/tokenHandler';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      logoutUserOnTokenError(); // handles clear + redirect
    }
    return Promise.reject(error);
  }
);

export default API;
