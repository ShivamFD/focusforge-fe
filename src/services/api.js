import axios from 'axios';

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove token and redirect to login
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Task API
export const taskAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData),
  archiveTask: (taskId) => api.patch(`/tasks/${taskId}/archive`),
  completeTask: (taskId) => api.post(`/tasks/${taskId}/complete`),
  recoverTask: (taskId) => api.post(`/tasks/${taskId}/recover`),
  getTaskLogs: (params) => api.get('/tasks/logs', { params }),
};

// Streak API
export const streakAPI = {
  getUserStreaks: () => api.get('/streaks'),
  getTaskStreak: (taskId) => api.get(`/streaks/task/${taskId}`),
  updateStreak: (data) => api.post('/streaks/update', data),
};

// Report API
export const reportAPI = {
  getHeatmap: (params) => api.get('/reports/heatmap', { params }),
  getMonthlyReport: (params) => api.get('/reports/monthly', { params }),
  getUserStats: () => api.get('/reports/stats'),
};

// Leaderboard API
export const leaderboardAPI = {
  getPublicLeaderboard: () => api.get('/leaderboard/public'),
  getUserPosition: () => api.get('/leaderboard/my-position'),
};

export default api;