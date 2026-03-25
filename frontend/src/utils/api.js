import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach user id to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('bugtracker_user') || 'null');
  if (user?._id) {
    config.headers['x-user-id'] = user._id;
  }
  return config;
});

export default api;
