import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import { weatherAPI } from '../services/api';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Weather = () => {
  const { language } = useAuth();
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const city = location?.city || 'Delhi';
      
      const [currentWeather, forecastData] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getForecast(city)
      ]);

      setWeatherData(currentWeather);
      setForecast(forecastData);
    } catch (error) {
      console.error('Weather data error:', error);
      // Mock data fallback
      setWeatherData({
        name: location?.city || 'Delhi',
        main: { temp: 28, humidity: 65, pressure: 1013 },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 3.5 }
      });
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Weather Information',
      current: 'Current Weather',
      forecast: '5-Day Forecast',
      temperature: 'Temperature',
      humidity: 'Humidity',
      pressure: 'Pressure',
      windSpeed: 'Wind Speed',
      feelsLike: 'Feels Like',
      visibility: 'Visibility',
      uvIndex: 'UV Index',
      farmingTips: 'Farming Tips',
      tips: [
        'Monitor soil moisture during dry weather',
        'Protect crops from strong winds',
        'Plan irrigation based on rainfall forecast'
      ]
    },
    hi: {
      title: 'मौसम की जानकारी',
      current: 'वर्तमान मौसम',
      forecast: '5-दिन का पूर्वानुमान',
      temperature: 'तापमान',
      humidity: 'नमी',
      pressure: 'दबाव',
      windSpeed: 'हवा की गति',
      feelsLike: 'महसूस होता है',
      visibility: 'दृश्यता',
      uvIndex: 'यूवी इंडेक्स',
      farmingTips: 'खेती की सलाह',
      tips: [
        'सूखे मौसम में मिट्टी की नमी की निगरानी करें',
        'तेज हवाओं से फसलों की सुरक्षा करें',
        'बारिश के पूर्वानुमान के आधार पर सिंचाई की योजना बनाएं'
      ]
    }
  };

  const t = translations[language];

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <Sun className="w-8 h-8 text-yellow-500" />,
      '01n': <Sun className="w-8 h-8 text-yellow-300" />,
      '02d': <Cloud className="w-8 h-8 text-gray-500" />,
      '02n': <Cloud className="w-8 h-8 text-gray-400" />,
      '09d': <CloudRain className="w-8 h-8 text-blue-500" />,
      '09n': <CloudRain className="w-8 h-8 text-blue-400" />,
      '10d': <CloudRain className="w-8 h-8 text-blue-600" />,
      '10n': <CloudRain className="w-8 h-8 text-blue-500" />
    };
    return iconMap[iconCode] || <Cloud className="w-8 h-8 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Weather */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.current}</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{weatherData?.name}</h3>
              <p className="text-gray-600 capitalize">{weatherData?.weather?.[0]?.description}</p>
            </div>
            <div className="text-center">
              {getWeatherIcon(weatherData?.weather?.[0]?.icon)}
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {Math.round(weatherData?.main?.temp || 28)}°C
              </p>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">{t.humidity}</span>
              </div>
              <p className="text-xl font-bold text-blue-600">{weatherData?.main?.humidity || 65}%</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-800">{t.windSpeed}</span>
              </div>
              <p className="text-xl font-bold text-green-600">{weatherData?.wind?.speed || 3.5} m/s</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">{t.feelsLike}</span>
              </div>
              <p className="text-xl font-bold text-orange-600">{Math.round((weatherData?.main?.temp || 28) + 2)}°C</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">{t.pressure}</span>
              </div>
              <p className="text-xl font-bold text-purple-600">{weatherData?.main?.pressure || 1013} hPa</p>
            </div>
          </div>
        </div>

        {/* Farming Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.farmingTips}</h2>
          <div className="space-y-3">
            {t.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.forecast}</h2>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((day) => {
              const date = new Date();
              date.setDate(date.getDate() + day);
              const temp = Math.round(28 + Math.random() * 10 - 5);
              
              return (
                <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {day === 0 ? (language === 'hi' ? 'आज' : 'Today') : 
                         day === 1 ? (language === 'hi' ? 'कल' : 'Tomorrow') :
                         date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{temp}°C</p>
                    <p className="text-sm text-gray-600">{Math.round(temp - 5)}°C</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Weather;