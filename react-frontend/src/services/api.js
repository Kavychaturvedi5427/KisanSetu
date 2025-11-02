import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
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
    if (userData.access_token) {
      config.headers.Authorization = `Bearer ${userData.access_token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('kisanSetuUser');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  register: (userData) => api.post('/auth/register', userData),
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

// Marketplace API
export const marketplaceAPI = {
  getProducts: (params) => api.get('/marketplace/products', { params }),
  getProduct: (id) => api.get(`/marketplace/products/${id}`),
  getCategories: () => api.get('/marketplace/categories'),
  createOrder: (data) => api.post('/marketplace/orders', data, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getOrders: () => api.get('/marketplace/orders'),
  getOrder: (id) => api.get(`/marketplace/orders/${id}`),
};

// Cart utilities
export const cartUtils = {
  getCart: () => JSON.parse(localStorage.getItem('kisanSetuCart') || '[]'),
  addToCart: (product) => {
    const cart = cartUtils.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('kisanSetuCart', JSON.stringify(cart));
    return cart;
  },
  removeFromCart: (productId) => {
    const cart = cartUtils.getCart().filter(item => item.id !== productId);
    localStorage.setItem('kisanSetuCart', JSON.stringify(cart));
    return cart;
  },
  clearCart: () => {
    localStorage.removeItem('kisanSetuCart');
    return [];
  },
  getCartTotal: () => {
    const cart = cartUtils.getCart();
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }
};

// Farmers API
export const farmersAPI = {
  getDashboard: () => api.get('/farmers/dashboard'),
  getCrops: () => api.get('/farmers/crops'),
  createCrop: (data) => api.post('/farmers/crops', data),
  updateCrop: (id, data) => api.put(`/farmers/crops/${id}`, data),
  deleteCrop: (id) => api.delete(`/farmers/crops/${id}`),
};

// Advisory API
export const advisoryAPI = {
  predictCropHealth: (data) => api.post('/advisory/predict', null, { params: data }),
  getWeather: (city) => api.get('/advisory/weather', { params: { city } }),
  getRecommendations: (season) => api.get('/advisory/recommendations', { params: { season } }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
};

// Location API
export const locationAPI = {
  getNearbyUsers: (latitude, longitude, radius = 50) => 
    api.get('/location/nearby-users', { 
      params: { latitude, longitude, radius } 
    }),
  updateLocation: (locationData) => 
    api.post('/location/update-location', locationData),
  getUserStats: (userId) => 
    api.get(`/location/user-stats/${userId}`),
};

export default api;