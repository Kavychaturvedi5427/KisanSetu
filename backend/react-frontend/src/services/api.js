import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
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
    
    // Handle network errors gracefully for specific endpoints
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend not available, API calls will use fallback data');
      // Don't auto-resolve here, let individual API methods handle fallbacks
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
  login: async (credentials) => {
    try {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      return await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Login API error:', error);
      // If backend is down, create mock login response for demo accounts
      if ((error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') && 
          ['admin', 'farmer1', 'consumer1'].includes(credentials.username)) {
        console.warn('Backend unavailable, using mock login for demo account');
        const mockUser = {
          id: credentials.username === 'admin' ? 1 : credentials.username === 'farmer1' ? 2 : 3,
          username: credentials.username,
          email: `${credentials.username}@demo.com`,
          full_name: credentials.username === 'admin' ? 'Admin User' : 
                    credentials.username === 'farmer1' ? 'Demo Farmer' : 'Demo Consumer',
          role: credentials.username === 'admin' ? 'admin' : 
               credentials.username === 'farmer1' ? 'farmer' : 'consumer',
          access_token: 'mock_token_' + Date.now(),
          token_type: 'bearer'
        };
        localStorage.setItem('kisanSetuUser', JSON.stringify(mockUser));
        return { data: mockUser };
      }
      throw error;
    }
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
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
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
  getProfile: async () => {
    try {
      return await api.get('/auth/profile');
    } catch (error) {
      console.error('Profile API error:', error);
      // Return mock profile if backend is down
      const user = localStorage.getItem('kisanSetuUser');
      if (user) {
        return { data: JSON.parse(user) };
      }
      throw error;
    }
  },
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
  predictCropHealth: async (data) => {
    try {
      return await api.post('/api/advisory/predict', null, { params: data });
    } catch (error) {
      console.error('Crop health prediction error:', error);
      // Return mock data if API fails
      return {
        data: {
          crop: data.crop || 'wheat',
          season: data.season || 'winter',
          soil_type: data.soil_type || 'loamy',
          health_score: 85,
          status: 'healthy',
          recommendations: [
            'Apply organic fertilizer every 2 weeks',
            'Monitor soil moisture levels daily',
            'Check for pest infestation regularly'
          ],
          confidence: 88
        }
      };
    }
  },
  
  getWeather: async (city, language = 'en') => {
    try {
      return await api.get('/api/advisory/weather', { params: { city, language } });
    } catch (error) {
      console.error('Weather advisory error:', error);
      // Return mock weather data
      return {
        data: {
          weather: {
            city: city || 'Delhi',
            temperature: 25,
            humidity: 65,
            rainfall: 0,
            wind_speed: 10
          },
          advisory: [
            'Good weather conditions for farming',
            'Maintain regular irrigation schedule',
            'Monitor crop health daily'
          ],
          farming_tips: [
            'Best time for field operations: Early morning',
            'Apply fertilizers during cool hours',
            'Ensure proper drainage in fields'
          ]
        }
      };
    }
  },
  
  getRecommendations: async (season = 'winter', location = 'Delhi', language = 'en') => {
    try {
      const response = await api.get('/api/advisory/recommendations', { 
        params: { season, location, language } 
      });
      return response;
    } catch (error) {
      console.error('Recommendations error:', error);
      // Enhanced fallback recommendations
      const fallbackData = {
        winter: {
          crops: language === 'hi' ? ['गेहूं', 'सरसों', 'मटर', 'आलू', 'जौ', 'चना'] : ['Wheat', 'Mustard', 'Peas', 'Potato', 'Barley', 'Gram'],
          tips: language === 'hi' ? [
            'रबी फसलों के लिए उचित जुताई के साथ मिट्टी तैयार करें',
            'बुवाई से 2-3 सप्ताह पहले जैविक खाद डालें',
            'उचित सिंचाई का समय निर्धारण करें',
            'पाले से बचाव के लिए तापमान की निगरानी करें',
            'बेहतर उत्पादन के लिए प्रमाणित बीजों का उपयोग करें',
            'संतुलित NPK उर्वरक का प्रयोग करें'
          ] : [
            'Prepare soil for rabi crops with proper plowing',
            'Apply organic manure 2-3 weeks before sowing',
            'Ensure proper irrigation scheduling',
            'Monitor temperature for frost protection',
            'Use certified seeds for better yield',
            'Apply balanced NPK fertilizers'
          ]
        },
        summer: {
          crops: language === 'hi' ? ['धान', 'कपास', 'गन्ना', 'मक्का', 'चारा फसलें', 'सब्जियां'] : ['Rice', 'Cotton', 'Sugarcane', 'Maize', 'Fodder crops', 'Vegetables'],
          tips: language === 'hi' ? [
            'जल संरक्षण तकनीकों पर ध्यान दें',
            'मिट्टी की नमी बनाए रखने के लिए मल्चिंग का उपयोग करें',
            'गर्मी प्रतिरोधी किस्मों की बुवाई करें',
            'ड्रिप सिंचाई प्रणाली स्थापित करें',
            'संवेदनशील फसलों के लिए छाया जाल प्रदान करें',
            'मिट्टी की नमी का दैनिक निरीक्षण करें'
          ] : [
            'Focus on water conservation techniques',
            'Use mulching to retain soil moisture',
            'Plant heat-resistant crop varieties',
            'Install drip irrigation systems',
            'Provide shade nets for sensitive crops',
            'Monitor soil moisture levels daily'
          ]
        },
        monsoon: {
          crops: language === 'hi' ? ['धान', 'कपास', 'दालें', 'सब्जियां', 'गन्ना', 'चारा'] : ['Rice', 'Cotton', 'Pulses', 'Vegetables', 'Sugarcane', 'Fodder'],
          tips: language === 'hi' ? [
            'खेत में उचित जल निकासी व्यवस्था सुनिश्चित करें',
            'कीट और रोग के प्रकोप की निगरानी करें',
            'भारी बारिश से पहले पकी फसल की कटाई करें',
            'रोकथाम के लिए फफूंदनाशी का छिड़काव करें',
            'पौधों के बीच उचित दूरी बनाए रखें',
            'कटी हुई फसल को सूखी जगह पर भंडारित करें'
          ] : [
            'Ensure proper field drainage systems',
            'Monitor for pest and disease outbreaks',
            'Harvest mature crops before heavy rains',
            'Apply preventive fungicide sprays',
            'Maintain proper plant spacing',
            'Store harvested crops in dry places'
          ]
        }
      };
      
      return {
        data: fallbackData[season] || fallbackData.winter
      };
    }
  },
  
  getSustainabilityMetrics: async (crop, area_hectares, farming_method) => {
    try {
      return await api.get('/api/advisory/sustainability-metrics', { 
        params: { crop, area_hectares, farming_method } 
      });
    } catch (error) {
      console.error('Sustainability metrics error:', error);
      // Return mock sustainability data
      const baseFootprint = farming_method === 'organic' ? 2200 : farming_method === 'precision' ? 2000 : 2800;
      const totalFootprint = baseFootprint * (area_hectares || 1);
      
      return {
        data: {
          crop: crop || 'wheat',
          area_hectares: area_hectares || 1,
          farming_method: farming_method || 'conventional',
          carbon_footprint: {
            total_kg_co2: totalFootprint,
            per_hectare_kg_co2: baseFootprint,
            savings_vs_conventional_kg: farming_method !== 'conventional' ? (2800 - baseFootprint) * (area_hectares || 1) : 0,
            savings_percentage: farming_method === 'organic' ? 21.4 : farming_method === 'precision' ? 28.6 : 0
          },
          sustainability_score: farming_method === 'organic' ? 85 : farming_method === 'precision' ? 90 : 60
        }
      };
    }
  },
  
  analyzeCropImage: async (file, crop_type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('crop_type', crop_type);
      return await api.post('/api/advisory/crop-image-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Crop image analysis error:', error);
      // Return mock analysis result
      const healthScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const diseases = healthScore < 85 ? [
        {
          disease_name: 'Early Blight',
          confidence: Math.floor(Math.random() * 20) + 80,
          severity: healthScore < 75 ? 'high' : 'moderate'
        }
      ] : [];
      
      return {
        data: {
          success: true,
          analysis_id: `IMG_${Math.floor(Math.random() * 90000) + 10000}`,
          crop_type: crop_type || 'tomato',
          overall_health_score: healthScore,
          disease_predictions: diseases,
          recommendations: [
            'Monitor crop health daily',
            'Apply organic fertilizer regularly',
            'Ensure proper irrigation',
            diseases.length > 0 ? 'Apply appropriate fungicide treatment' : 'Continue current care routine'
          ].filter(Boolean),
          confidence_score: Math.floor(Math.random() * 10) + 85,
          status: healthScore > 85 ? 'healthy' : healthScore > 70 ? 'needs_attention' : 'critical'
        }
      };
    }
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