import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '3a680fa13cc9c4be860368ea425c7667';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('kisanSetuUser');
  if (user) {
    const userData = JSON.parse(user);
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Weather API
export const weatherAPI = {
  getCurrentWeather: async (city = 'Delhi') => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  },
  getForecast: async (city = 'Delhi') => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Forecast API error:', error);
      return null;
    }
  }
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getCropHealth: () => api.get('/dashboard/crop-health'),
  getRecentActivity: () => api.get('/dashboard/activity'),
};

// Advisory API
export const advisoryAPI = {
  getAdvice: (cropType) => api.get(`/advisory/${cropType}`),
  getExperts: () => api.get('/advisory/experts'),
  bookConsultation: (data) => api.post('/advisory/consultation', data),
};

export default api;