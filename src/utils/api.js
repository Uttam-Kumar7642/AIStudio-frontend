import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// ─── Request Interceptor: Attach Token ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle Auth Errors ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiAPI = {
  generate: (type, data, title) => api.post('/ai/generate', { type, data, title }),
  getSuggestions: (content, type) => api.post('/ai/suggestions', { content, type }),
};

export const getData = () => {
  return axios.get(`${API}/api/data`);
};
// ─── Documents API ────────────────────────────────────────────────────────────
export const documentsAPI = {
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  exportPDF: (id) =>
    api.get(`/documents/${id}/export/pdf`, { responseType: 'blob' }),
  getStats: () => api.get('/documents/user/stats'),
};

export default api;

export const passwordAPI = {
  forgotPassword: (email) => api.post('/password/forgot', { email }),
  verifyOTP: (email, otp) => api.post('/password/verify-otp', { email, otp }),
  resetPassword: (email, resetToken, password) => api.post('/password/reset', { email, resetToken, password }),
  resendOTP: (email) => api.post('/password/resend-otp', { email }),
};

export const registerAPI = {
  sendOTP: (name, email, password) => api.post('/auth/send-register-otp', { name, email, password }),
  verifyOTP: (name, email, password, otp) => api.post('/auth/verify-register-otp', { name, email, password, otp }),
  resendOTP: (email, name) => api.post('/auth/resend-register-otp', { email, name }),
};
