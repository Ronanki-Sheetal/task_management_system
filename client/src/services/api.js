import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/updateprofile', data),
  updatePassword: (data) => API.put('/auth/updatepassword', data),
  forgotPassword: (data) => API.post('/auth/forgotpassword', data),
  resetPassword: (token, data) => API.put(`/auth/resetpassword/${token}`, data),
};

// ─── Tasks ────────────────────────────────────────────────────
export const taskAPI = {
  getAll: (params) => API.get('/tasks', { params }),
  getOne: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  remove: (id) => API.delete(`/tasks/${id}`),
  changeStatus: (id, status) => API.put(`/tasks/${id}/status`, { status }),
  addComment: (id, text) => API.post(`/tasks/${id}/comments`, { text }),
  getStats: () => API.get('/tasks/stats'),
};

// ─── Users ────────────────────────────────────────────────────
export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  getOne: (id) => API.get(`/users/${id}`),
  remove: (id) => API.delete(`/users/${id}`),
  updateRole: (id, role) => API.put(`/users/${id}/role`, { role }),
  toggleStatus: (id) => API.put(`/users/${id}/toggle-status`),
};

// ─── Analytics ────────────────────────────────────────────────
export const analyticsAPI = {
  getOverview: () => API.get('/analytics/overview'),
  getDaily: (days) => API.get('/analytics/daily', { params: { days } }),
  getCompletion: () => API.get('/analytics/completion'),
  getProductivity: () => API.get('/analytics/productivity'),
};

export default API;
