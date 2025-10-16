import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ Change this if your backend runs on another port
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach JWT token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // assuming you store auth token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => {
  return Promise.reject(err);
});

export default axiosInstance;
