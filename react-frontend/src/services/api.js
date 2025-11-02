import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.protocol + '//' + window.location.hostname + ':8001';
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
    
    // Handle network errors gracefully
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend not available, using mock mode');
      return Promise.resolve({ data: { message: 'Mock response - backend unavailable' } });
    }
    
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
  register: async (userData) => {
    try {
      console.log('Sending registration request:', userData);
      const response = await api.post('/auth/register', userData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Registration response:', response);
      return response;
    } catch (error) {
      console.error('Registration API error:', error);
      // If backend is down, create mock success response
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.warn('Backend unavailable, using mock registration');
        const mockUser = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role || 'farmer',
          access_token: 'mock_token_' + Date.now(),
          token_type: 'bearer'
        };
        localStorage.setItem('kisanSetuUser', JSON.stringify(mockUser));
        return { data: mockUser };
      }
      throw error;
    }
  },
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
  getProducts: (params) => api.get('/api/marketplace/products', { params }),
  getProduct: (id) => api.get(`/api/marketplace/products/${id}`),
  getCategories: () => api.get('/api/marketplace/categories'),
  createOrder: (data) => api.post('/api/marketplace/orders', data, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getOrders: () => api.get('/api/marketplace/orders'),
  getOrder: (id) => api.get(`/api/marketplace/orders/${id}`),
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
  getDashboard: () => api.get('/api/farmers/dashboard'),
  getCrops: () => api.get('/api/farmers/crops'),
  createCrop: (data) => api.post('/api/farmers/crops', data),
  updateCrop: (id, data) => api.put(`/api/farmers/crops/${id}`, data),
  deleteCrop: (id) => api.delete(`/api/farmers/crops/${id}`),
};

// Advisory API
export const advisoryAPI = {
  predictCropHealth: (data) => api.post('/api/advisory/predict', null, { params: data }),
  getWeather: (city) => api.get('/api/advisory/weather', { params: { city } }),
  getRecommendations: (season, location, language) => api.get('/api/advisory/recommendations', { 
    params: { season, location, language } 
  }),
  getSustainabilityMetrics: (crop, area_hectares, farming_method) => 
    api.get('/api/advisory/sustainability-metrics', { 
      params: { crop, area_hectares, farming_method } 
    }),
  analyzeCropImage: (file, crop_type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop_type', crop_type);
    return api.post('/api/advisory/crop-image-analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getAllUsers: () => api.get('/api/admin/all-users'),
};

// Location API
export const locationAPI = {
  getNearbyUsers: (latitude, longitude, radius = 50) => 
    api.get('/api/location/nearby-users', { 
      params: { latitude, longitude, radius } 
    }),
  updateLocation: (locationData) => 
    api.post('/api/location/update-location', locationData),
  getUserStats: (userId) => 
    api.get(`/api/location/user-stats/${userId}`),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/auth/users'),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

export default api;