import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { advisoryAPI } from '../services/api';
import { ArrowLeft, Search } from 'lucide-react';

const Weather = () => {
  const { language } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [city, setCity] = useState('Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    updateDateTime();
    const dateTimeInterval = setInterval(updateDateTime, 60000);
    loadWeatherData();
    
    return () => {
      clearTimeout(timer);
      clearInterval(dateTimeInterval);
    };
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const response = await advisoryAPI.getWeather(city);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error loading weather data:', error);
      // Fallback to mock data
      setWeatherData(mockWeatherData);
    } finally {
      setLoading(false);
    }
  };

  const updateDateTime = () => {
    const now = new Date();
    const locale = language === 'hi' ? 'hi-IN' : 'en-US';

    const timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    
    const dateOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };

    setCurrentTime(now.toLocaleTimeString(locale, timeOptions));
    setCurrentDate(now.toLocaleDateString(locale, dateOptions));
  };

  const translations = {
    en: {
      headerTitle: '🌤️ Weather Information',
      headerDesc: 'Real-time weather updates for better farming decisions',
      humidityLabel: 'Humidity',
      windLabel: 'Wind Speed',
      visibilityLabel: 'Visibility',
      feelsLikeLabel: 'Feels Like',
      locationTitle: '📍 Location Details',
      locationLabel: 'Current Location',
      timeLabel: 'Local Time',
      dateLabel: 'Date',
      alertTitle: 'Weather Alert',
      alertMessage: 'Light rain expected tomorrow evening. Plan your irrigation accordingly.',
      forecastTitle: '📅 7-Day Weather Forecast',
      tipsTitle: '🌱 Weather-Based Farming Tips',
      tip1: 'Current weather is perfect for sowing wheat. Soil moisture is optimal.',
      tip2: 'Reduce watering frequency due to expected rainfall in next 2 days.',
      tip3: 'Avoid pesticide spraying today due to high wind speed.',
      tip4: 'Excellent conditions for harvesting. Clear skies for next 3 days.',
      sunny: 'Sunny',
      rainy: 'Rainy',
      cloudy: 'Cloudy',
      partlyCloudy: 'Partly Cloudy'
    },
    hi: {
      headerTitle: '🌤️ मौसम की जानकारी',
      headerDesc: 'बेहतर खेती के फैसलों के लिए वास्तविक समय मौसम अपडेट',
      humidityLabel: 'नमी',
      windLabel: 'हवा की गति',
      visibilityLabel: 'दृश्यता',
      feelsLikeLabel: 'महसूस होता है',
      locationTitle: '📍 स्थान विवरण',
      locationLabel: 'वर्तमान स्थान',
      timeLabel: 'स्थानीय समय',
      dateLabel: 'तारीख',
      alertTitle: 'मौसम चेतावनी',
      alertMessage: 'कल शाम हल्की बारिश की संभावना है। अपनी सिंचाई की योजना बनाएं।',
      forecastTitle: '📅 7-दिन का मौसम पूर्वानुमान',
      tipsTitle: '🌱 मौसम आधारित खेती के सुझाव',
      tip1: 'गेहूं बोने के लिए मौजूदा मौसम बिल्कुल सही है। मिट्टी की नमी अनुकूल है।',
      tip2: 'अगले 2 दिनों में बारिश की उम्मीद के कारण पानी देने की आवृत्ति कम करें।',
      tip3: 'तेज हवा की गति के कारण आज कीटनाशक का छिड़काव न करें।',
      tip4: 'कटाई के लिए उत्कृष्ट स्थितियां। अगले 3 दिनों तक साफ आसमान।',
      sunny: 'धूप',
      rainy: 'बारिश',
      cloudy: 'बादल',
      partlyCloudy: 'आंशिक बादल'
    }
  };

  const t = translations[language];

  // Mock weather data as fallback
  const mockWeatherData = {
    city: 'Delhi',
    temperature: 28,
    humidity: 65,
    description: 'Partly Cloudy',
    wind_speed: 12,
    pressure: 1013,
    visibility: 10,
    forecast: [
      { day: language === 'hi' ? 'आज' : 'Today', temp_max: 32, temp_min: 24, condition: 'Sunny', advice: 'Good day for field work' },
      { day: language === 'hi' ? 'कल' : 'Tomorrow', temp_max: 30, temp_min: 22, condition: 'Cloudy', advice: 'Monitor for rain' },
      { day: language === 'hi' ? 'बुध' : 'Wed', temp_max: 28, temp_min: 20, condition: 'Rain', advice: 'Avoid irrigation' }
    ],
    farming_advice: 'Moderate weather conditions. Good for most farming activities.'
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'sunny': '☀️',
      'cloudy': '☁️',
      'rain': '🌧️',
      'partly cloudy': '⛅',
      'clear': '☀️'
    };
    return icons[condition.toLowerCase()] || '☀️';
  };

  const searchWeather = async () => {
    if (city.trim()) {
      await loadWeatherData();
    } else {
      alert('Please enter a city name');
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
    <div className="min-h-screen bg-gray-50 transition-all duration-700 ease-in-out">
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-5 left-5 bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors z-10"
      >
        ← Back to Dashboard
      </button>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-5 text-center">
        <h1 className="text-3xl font-bold mb-3">{t.headerTitle}</h1>
        <p className="text-lg opacity-90">{t.headerDesc}</p>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Weather Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Current Weather */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg text-center">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="text-6xl mb-5 text-orange-500">{getWeatherIcon(weatherData?.description || 'sunny')}</div>
                <div className="text-5xl font-bold text-green-600 mb-3">{weatherData?.temperature || 28}°C</div>
                <div className="text-xl text-gray-800 mb-5">{weatherData?.description || 'Partly Cloudy'}</div>
                
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl text-blue-500 mb-2">💧</div>
                    <div className="text-lg font-semibold text-green-600">{weatherData?.humidity || 65}%</div>
                    <div className="text-sm text-gray-600">{t.humidityLabel}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl text-blue-500 mb-2">💨</div>
                    <div className="text-lg font-semibold text-green-600">{weatherData?.wind_speed || 12} km/h</div>
                    <div className="text-sm text-gray-600">{t.windLabel}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl text-blue-500 mb-2">👁️</div>
                    <div className="text-lg font-semibold text-green-600">{weatherData?.visibility || 10} km</div>
                    <div className="text-sm text-gray-600">{t.visibilityLabel}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl text-blue-500 mb-2">🌡️</div>
                    <div className="text-lg font-semibold text-green-600">{weatherData?.pressure || 1013} hPa</div>
                    <div className="text-sm text-gray-600">Pressure</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="text-green-600 font-bold text-lg mb-4 text-center">{t.locationTitle}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={searchWeather}
                  className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                >
                  🔍
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-lg text-blue-500 mb-1">📍</div>
                <div className="font-semibold text-green-600">{weatherData?.city || 'Delhi'}, India</div>
                <div className="text-xs text-gray-600">{t.locationLabel}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-lg text-blue-500 mb-1">🕰️</div>
                <div className="font-semibold text-green-600">{currentTime}</div>
                <div className="text-xs text-gray-600">{t.timeLabel}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-lg text-blue-500 mb-1">📅</div>
                <div className="font-semibold text-green-600">{currentDate}</div>
                <div className="text-xs text-gray-600">{t.dateLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl text-center mb-5 shadow-lg">
          <div className="text-3xl mb-3 animate-pulse">⚠️</div>
          <h3 className="text-xl font-bold mb-2">{t.alertTitle}</h3>
          <p className="text-lg">{weatherData?.farming_advice || t.alertMessage}</p>
        </div>

        {/* Forecast */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-5">
          <h3 className="text-green-600 font-bold text-xl mb-5 text-center">{t.forecastTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(weatherData?.forecast || mockWeatherData.forecast).map((day, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl text-center border-2 border-transparent hover:border-orange-500 transition-all duration-200">
                <div className="font-semibold text-green-600 mb-2">{day.day}</div>
                <div className="text-3xl mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="font-semibold text-gray-800">{day.temp_max}°/{day.temp_min}°</div>
                <div className="text-sm text-gray-600 mt-1">{day.condition}</div>
                <div className="text-xs text-blue-600 mt-1">{day.advice}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Farming Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-green-600 font-bold text-xl mb-5 text-center">{t.tipsTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-orange-500 flex items-start gap-3">
              <div className="text-2xl text-green-600">🌱</div>
              <span className="text-gray-800">{t.tip1}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-orange-500 flex items-start gap-3">
              <div className="text-2xl text-green-600">💧</div>
              <span className="text-gray-800">{t.tip2}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-orange-500 flex items-start gap-3">
              <div className="text-2xl text-green-600">🚿</div>
              <span className="text-gray-800">{t.tip3}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-orange-500 flex items-start gap-3">
              <div className="text-2xl text-green-600">☀️</div>
              <span className="text-gray-800">{t.tip4}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;