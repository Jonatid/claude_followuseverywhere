import axios from 'axios';

const apiBase =
  import.meta.env.VITE_API_BASE_URL || 'https://followuseverywhere-api.onrender.com';

const api = axios.create({
  baseURL: `${apiBase}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const requestPasswordReset = (data) => api.post('/auth/request-password-reset', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const getMe = () => api.get('/auth/me');
export const updateSocials = (socials) => api.put('/socials', { socials });
export const getBusinessBySlug = (slug) => api.get(`/businesses/${slug}`);
export const getMyQrCode = () => api.get('/businesses/me/qr-code');

export default api;
