import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocationContext } from '../../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';
import { farmersAPI, advisoryAPI } from '../../services/api';
import MobileNav from '../common/MobileNav';
import LocationService from '../common/LocationService';
import { 
  Home, Leaf, Cloud, Store, ShoppingCart, Users, Lightbulb, User, Settings, LogOut, Menu, MapPin, Brain
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, language, setLanguage } = useAuth();
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    updateCurrentDate();
    const dateInterval = setInterval(updateCurrentDate, 60000);
    loadDashboardData();
    
    return () => {
      clearTimeout(timer);
      clearInterval(dateInterval);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const city = location?.city || 'Delhi';
      const [dashboardResponse, weatherResponse] = await Promise.all([
        farmersAPI.getDashboard(),
        advisoryAPI.getWeather(city)
      ]);
      
      // Location-based data enhancement
      const locationEnhancedData = {
        ...dashboardResponse.data,
        location_info: {
          city: location?.city || 'Unknown',
          state: location?.state || 'Unknown',
          district: location?.district || 'Unknown',
          pincode: location?.pincode || '000000'
        },
        local_market_prices: generateLocalPrices(location?.state),
        regional_crops: getRegionalCrops(location?.state)
      };
      
      setDashboardData(locationEnhancedData);
      setWeatherData({
        ...weatherResponse.data,
        location: `${location?.city || 'Delhi'}, ${location?.state || 'India'}`
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalPrices = (state) => {
    const basePrices = { wheat: 2100, rice: 1800, onion: 25, tomato: 30 };
    const stateMultipliers = {
      'Punjab': 1.1, 'Haryana': 1.05, 'UP': 0.95, 'Bihar': 0.9,
      'Maharashtra': 1.08, 'Karnataka': 1.02, 'Tamil Nadu': 1.03
    };
    const multiplier = stateMultipliers[state] || 1.0;
    return Object.fromEntries(
      Object.entries(basePrices).map(([crop, price]) => [crop, Math.round(price * multiplier)])
    );
  };

  const getRegionalCrops = (state) => {
    const regionalCrops = {
      'Punjab': ['Wheat', 'Rice', 'Cotton'],
      'Haryana': ['Wheat', 'Rice', 'Sugarcane'],
      'UP': ['Wheat', 'Rice', 'Sugarcane', 'Potato'],
      'Maharashtra': ['Cotton', 'Sugarcane', 'Onion'],
      'Karnataka': ['Rice', 'Cotton', 'Coffee'],
      'Tamil Nadu': ['Rice', 'Cotton', 'Sugarcane']
    };
    return regionalCrops[state] || ['Wheat', 'Rice', 'Vegetables'];
  };

  const handleLocationUpdate = () => {
    loadDashboardData();
  };

  const updateCurrentDate = () => {
    const today = new Date();
    const locale = language === 'hi' ? 'hi-IN' : 'en-US';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    setCurrentDate(today.toLocaleDateString(locale, options));
  };

  const translations = {
    en: {
      title: 'Krishi',
      sidebarTitle: 'Krishi',
      menuHome: 'Home',
      menuCrop: 'Crop Health',
      menuWeather: 'Weather Info',
      menuMarket: 'Market Prices',
      menuAdvisory: 'Advisory',
      menuProfile: 'My Profile',
      menuSettings: 'Settings',
      menuLogout: 'Logout',
      farmText: 'My Farm',
      dateText: "Today's Date",
      alertText: 'Alerts',
      welcomeTitle: '🙏 Welcome Farmer!',
      welcomeDesc: 'View all your farm information here',
      earningsTitle: "This Month's Earnings",
      earningsUnit: 'Rupees',
      moistureTitle: 'Soil Moisture',
      moistureUnit: 'Good Condition',
      cropHealthTitle: 'Crop Health',
      cropHealthUnit: 'Very Good',
      tempTitle: "Today's Temperature",
      tempUnit: 'Normal',
      cropInfoTitle: 'My Crop Information',
      tasksTitle: "Today's Tasks",
      wheatCrop: 'Wheat Crop',
      wheatDesc: 'Planted in 5 acres, 80% ready',
      cornCrop: 'Corn Crop',
      cornDesc: 'Planted in 3 acres, 60% ready',
      vegCrop: 'Vegetable Crop',
      vegDesc: 'Planted in 2 acres, ready for harvest',
      waterTask: 'Watering',
      waterDesc: 'Water the field at 6 AM',
      sprayTask: 'Pesticide Spray',
      sprayDesc: 'Spray pesticide in the evening',
      sellTask: 'Sell Vegetables',
      sellDesc: 'Take vegetables to market',
      alertMsg: 'Important Notice: Rain expected tomorrow | Wheat price ₹2,100 per quintal',
      footerMsg: 'Krishi - Your Farming, Our Technology | Made for all farmer brothers'
    },
    hi: {
      title: 'कृषि',
      sidebarTitle: 'कृषि',
      menuHome: 'मुख्य पृष्ठ',
      menuCrop: 'फसल स्वास्थ्य',
      menuWeather: 'मौसम जानकारी',
      menuMarket: 'बाजार भाव',
      menuAdvisory: 'सलाह सेवा',
      menuProfile: 'मेरी प्रोफाइल',
      menuSettings: 'सेटिंग्स',
      menuLogout: 'लॉग आउट',
      farmText: 'मेरा खेत',
      dateText: 'आज की तारीख',
      alertText: 'अलर्ट',
      welcomeTitle: '🙏 नमस्कार किसान भाई!',
      welcomeDesc: 'आपके खेत की पूरी जानकारी यहाँ देखें',
      earningsTitle: 'इस महीने की कमाई',
      earningsUnit: 'रुपये',
      moistureTitle: 'मिट्टी में नमी',
      moistureUnit: 'अच्छी स्थिति',
      cropHealthTitle: 'फसल की सेहत',
      cropHealthUnit: 'बहुत अच्छी',
      tempTitle: 'आज का तापमान',
      tempUnit: 'सामान्य',
      cropInfoTitle: 'मेरी फसल की जानकारी',
      tasksTitle: 'आज के काम',
      wheatCrop: 'गेहूं की फसल',
      wheatDesc: '5 एकड़ में लगी है, 80% तैयार है',
      cornCrop: 'मक्का की फसल',
      cornDesc: '3 एकड़ में लगी है, 60% तैयार है',
      vegCrop: 'सब्जी की फसल',
      vegDesc: '2 एकड़ में लगी है, कटाई के लिए तैयार',
      waterTask: 'पानी देना',
      waterDesc: 'सुबह 6 बजे खेत में पानी दें',
      sprayTask: 'दवा छिड़काव',
      sprayDesc: 'शाम को कीटनाशक का छिड़काव करें',
      sellTask: 'सब्जी बेचना',
      sellDesc: 'मंडी में सब्जी ले जाना है',
      alertMsg: 'महत्वपूर्ण सूचना: कल बारिश की संभावना है | गेहूं का भाव ₹2,100 प्रति क्विंटल',
      footerMsg: 'कृषि - आपकी खेती, हमारी तकनीक | सभी किसान भाइयों के लिए बनाया गया'
    }
  };

  const t = translations[language];

  const nearbyLabel = user?.user_type === 'farmer' 
    ? (language === 'hi' ? 'आस-पास के ग्राहक' : 'Nearby Consumers')
    : (language === 'hi' ? 'आस-पास के किसान' : 'Nearby Farmers');

  const baseMenuItems = [
    { icon: Home, label: t.menuHome, action: () => {} },
    { icon: Leaf, label: t.menuCrop, action: () => navigate('/crop-health') },
    { icon: Brain, label: language === 'hi' ? 'AI विश्लेषण' : 'AI Analysis', action: () => navigate('/ai-analysis') },
    { icon: Users, label: nearbyLabel, action: () => navigate('/nearby') },
    { icon: Cloud, label: t.menuWeather, action: () => navigate('/weather') },
    { icon: Store, label: t.menuMarket, action: () => navigate('/marketplace') },
    { icon: ShoppingCart, label: language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders', action: () => navigate('/orders') },
    { icon: Lightbulb, label: t.menuAdvisory, action: () => navigate('/advisory') },
    { icon: User, label: t.menuProfile, action: () => navigate('/profile') },
    { icon: Settings, label: t.menuSettings, action: () => navigate('/settings') },
  ];

  // Add admin-only menu items
  const adminMenuItems = user?.user_type === 'admin' ? [
    { icon: Users, label: language === 'hi' ? 'सभी उपयोगकर्ता' : 'All Users', action: () => navigate('/users') },
  ] : [];

  const menuItems = [...baseMenuItems, ...adminMenuItems];

  const kpiData = [
    {
      title: t.earningsTitle,
      value: `₹${dashboardData?.total_earnings?.toLocaleString() || '1,25,000'}`,
      unit: t.earningsUnit,
      icon: '💰',
      color: 'text-green-600'
    },
    {
      title: t.moistureTitle,
      value: `${weatherData?.humidity || 78}%`,
      unit: t.moistureUnit,
      icon: '💧',
      color: 'text-blue-600'
    },
    {
      title: t.cropHealthTitle,
      value: `${Math.round((dashboardData?.crop_health?.healthy / Math.max(dashboardData?.crop_health?.total, 1)) * 100) || 85}%`,
      unit: t.cropHealthUnit,
      icon: '🌱',
      color: 'text-green-600'
    },
    {
      title: t.tempTitle,
      value: `${weatherData?.temperature || 28}°C`,
      unit: t.tempUnit,
      icon: '🌡️',
      color: 'text-orange-600'
    }
  ];

  const cropData = dashboardData?.recent_crops?.length > 0 ? 
    dashboardData.recent_crops.slice(0, 3).map(crop => ({
      name: crop.name,
      desc: `${crop.variety} - ${crop.area} acres, Status: ${crop.status}`,
      icon: getCropIcon(crop.name)
    })) : [
      { name: t.wheatCrop, desc: t.wheatDesc, icon: '🌾' },
      { name: t.cornCrop, desc: t.cornDesc, icon: '🌽' },
      { name: t.vegCrop, desc: t.vegDesc, icon: '🥕' }
    ];

  function getCropIcon(cropName) {
    const icons = {
      'wheat': '🌾',
      'rice': '🌾',
      'corn': '🌽',
      'tomato': '🍅',
      'potato': '🥔',
      'onion': '🧅',
      'carrot': '🥕'
    };
    return icons[cropName.toLowerCase()] || '🌱';
  }

  const tasks = [
    { title: t.waterTask, desc: t.waterDesc, icon: '💧' },
    { title: t.sprayTask, desc: t.sprayDesc, icon: '🚿' },
    { title: t.sellTask, desc: t.sellDesc, icon: '🚚' }
  ];

  const handleLogout = () => {
    if (confirm(language === 'hi' ? 'क्या आप वाकई लॉग आउट करना चाहते हैं?' : 'Are you sure you want to logout?')) {
      logout();
      alert(language === 'hi' ? 'सफलतापूर्वक लॉग आउट हो गए!' : 'Successfully logged out!');
      navigate('/login');
    }
  };

  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-green-600 to-orange-500 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex transition-all duration-700 ease-in-out">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-600 to-green-700 text-white transition-transform duration-300 ease-in-out shadow-2xl`}>
        <div className="p-5">
          <div className="text-center mb-6 p-3 bg-white/10 rounded-xl">
            <img src="/Krishi.png.jpeg" alt="Krishi Logo" className="w-12 h-12 mx-auto mb-2 rounded-lg object-contain" />
            <h2 className="text-lg font-bold">{t.sidebarTitle}</h2>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200 text-left hover:translate-x-1 hover:shadow-lg min-h-[44px] touch-manipulation"
              >
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200 text-left hover:translate-x-1 hover:shadow-lg min-h-[44px] touch-manipulation"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate">{t.menuLogout}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white mobile-px mobile-py p-3 sm:p-4 border-b-3 border-orange-500 shadow-lg flex justify-between items-center safe-area-top">
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-green-600 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="hidden md:flex items-center gap-3 lg:gap-6 text-green-600 font-semibold">
              <span className="flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-2 bg-blue-50 rounded-full text-xs lg:text-sm border border-blue-200">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span className="text-blue-700">
                  {location ? `${location.city}, ${location.state}` : t.farmText}
                </span>
              </span>
              <span className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm">
                📅 {currentDate}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-2 bg-orange-50 rounded-full text-xs lg:text-sm border border-orange-200">
                <span className="text-orange-600">🌡️</span>
                <span className="text-orange-700">{weatherData?.temperature || 28}°C</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2 py-1 sm:px-3 sm:py-2 border rounded-lg bg-white text-green-600 font-semibold text-sm min-h-[44px]"
            >
              <option value="hi">हिं</option>
              <option value="en">EN</option>
            </select>
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-2 py-1 sm:px-5 sm:py-2 rounded-full font-semibold shadow-lg text-xs sm:text-sm">
              <span className="hidden sm:inline">👤 </span>
              {(user?.full_name || user?.fullname || 'किसान जी').split(' ')[0]}{language === 'hi' ? ' जी' : ''}
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white mobile-px mobile-py p-4 sm:p-5 text-center">
          <h1 className="text-lg sm:text-2xl font-bold mb-2">{t.welcomeTitle}</h1>
          <p className="text-sm sm:text-lg opacity-90">{t.welcomeDesc}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mobile-px p-4 sm:p-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white border-3 border-green-100 mobile-card p-3 sm:p-6 text-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-orange-500 relative overflow-visible">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-200/40 via-yellow-200/40 to-green-300/40 blur-lg scale-110 opacity-50 transition-all duration-500 hover:opacity-95 hover:blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 text-green-600">{kpi.icon}</div>
                <h3 className="text-green-600 font-semibold text-sm sm:text-lg mb-2 sm:mb-3 leading-tight">{kpi.title}</h3>
                <div className="text-xl sm:text-3xl font-bold text-orange-500 mb-1">{kpi.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 opacity-70">{kpi.unit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* B2C Connection Card */}
        <div className="mobile-px mx-4 sm:mx-6 mb-4 sm:mb-6">
          <div 
            onClick={() => navigate('/nearby')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mobile-card p-4 sm:p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[44px] flex items-center"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                  {user?.user_type === 'farmer' 
                    ? (language === 'hi' ? '👥 आस-पास के ग्राहक' : '👥 Find Nearby Consumers')
                    : (language === 'hi' ? '🌾 आस-पास के किसान' : '🌾 Find Local Farmers')
                  }
                </h3>
                <p className="opacity-90 text-sm sm:text-base">
                  {user?.user_type === 'farmer'
                    ? (language === 'hi' ? 'अपने उत्पाद 50 किमी के भीतर बेचें' : 'Sell your produce within 50km radius')
                    : (language === 'hi' ? 'ताज़ा उत्पाद सीधे किसानों से खरीदें' : 'Buy fresh produce directly from farmers')
                  }
                </p>
              </div>
              <div className="text-2xl sm:text-4xl ml-2">
                {user?.user_type === 'farmer' ? '👥' : '🌾'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mobile-px p-4 sm:p-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Regional Crops */}
            <div className="bg-white rounded-2xl mobile-card p-4 sm:p-6 shadow-lg border-l-5 border-yellow-400">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-2 sm:pb-3 border-b-2 border-gray-100">
                <div className="text-xl sm:text-2xl text-green-600">🌾</div>
                <h3 className="text-green-600 font-bold text-lg sm:text-xl">
                  {language === 'hi' ? `${location?.state || 'आपके क्षेत्र'} की फसलें` : `${location?.state || 'Regional'} Crops`}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(dashboardData?.regional_crops || ['Wheat', 'Rice', 'Vegetables']).map((crop, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                    <div className="text-2xl mb-2">🌱</div>
                    <div className="font-medium text-green-800 text-sm">{crop}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Local Market Prices */}
            <div className="bg-white rounded-2xl mobile-card p-4 sm:p-6 shadow-lg border-l-5 border-blue-400">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-2 sm:pb-3 border-b-2 border-gray-100">
                <div className="text-xl sm:text-2xl text-blue-600">💰</div>
                <h3 className="text-blue-600 font-bold text-lg sm:text-xl">
                  {language === 'hi' ? `${location?.city || 'स्थानीय'} मंडी भाव` : `${location?.city || 'Local'} Market Prices`}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(dashboardData?.local_market_prices || {wheat: 2100, rice: 1800, onion: 25, tomato: 30}).map(([crop, price]) => (
                  <div key={crop} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="font-semibold text-blue-800 capitalize">{crop}</div>
                    <div className="text-lg font-bold text-blue-600">₹{price}</div>
                    <div className="text-xs text-blue-500">{crop === 'wheat' || crop === 'rice' ? 'per quintal' : 'per kg'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl mobile-card p-4 sm:p-6 shadow-lg border-l-5 border-orange-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-2 sm:pb-3 border-b-2 border-gray-100">
              <div className="text-xl sm:text-2xl text-green-600">✅</div>
              <h3 className="text-green-600 font-bold text-lg sm:text-xl">{t.tasksTitle}</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-l-4 border-green-500">
                  <div className="text-xl sm:text-2xl flex-shrink-0">{task.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 text-sm sm:text-base">{task.title}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{task.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location-based Alert */}
        <div className="mobile-px mx-4 sm:mx-6 mb-4 sm:mb-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white mobile-card p-4 sm:p-5 rounded-2xl text-center font-semibold shadow-lg">
          <span className="text-xl sm:text-2xl mr-2 sm:mr-3 animate-pulse">📍</span>
          <strong className="text-sm sm:text-base">
            {location 
              ? (language === 'hi' 
                  ? `${location.city}, ${location.state} के लिए आज का मौसम: ${weatherData?.temperature || 28}°C | ${location.state} में गेहूं का भाव ₹${dashboardData?.local_market_prices?.wheat || 2100} प्रति क्विंटल`
                  : `Today's weather for ${location.city}, ${location.state}: ${weatherData?.temperature || 28}°C | Wheat price in ${location.state}: ₹${dashboardData?.local_market_prices?.wheat || 2100} per quintal`)
              : t.alertMsg
            }
          </strong>
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-gray-600 mobile-card p-3 sm:p-4 bg-white mobile-px mx-4 sm:mx-6 mb-4 sm:mb-6 rounded-xl safe-area-bottom">
          <span className="text-red-500 mr-2">❤️</span>
          {t.footerMsg}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Location Service */}
      <LocationService onLocationUpdate={handleLocationUpdate} />
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Dashboard;