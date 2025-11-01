import { useState, useEffect } from 'react';
import { weatherAPI } from '../../services/api';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Thermometer } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('Delhi');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const [currentWeather, forecastData] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getForecast(city)
      ]);

      if (currentWeather) {
        setWeather(currentWeather);
      }

      if (forecastData) {
        // Process forecast data to get daily forecasts
        const dailyForecasts = [];
        const processedDates = new Set();
        
        forecastData.list.forEach(item => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!processedDates.has(date) && dailyForecasts.length < 5) {
            processedDates.add(date);
            dailyForecasts.push({
              date: new Date(item.dt * 1000),
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main,
              icon: item.weather[0].icon
            });
          }
        });
        
        setForecast(dailyForecasts);
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-green-600 flex items-center gap-2">
          🌤️ Weather Information
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="px-3 py-1 border rounded text-sm"
          />
          <button
            onClick={fetchWeatherData}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            🔍
          </button>
        </div>
      </div>

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Weather */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold">{weather.name}</h4>
                <p className="text-blue-100">{new Date().toLocaleDateString()}</p>
              </div>
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            
            <div className="text-3xl font-bold mb-2">{Math.round(weather.main.temp)}°C</div>
            <p className="text-blue-100 mb-4 capitalize">{weather.weather[0].description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span>{weather.main.humidity}% Humidity</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span>{Math.round(weather.wind.speed * 3.6)} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{Math.round(weather.visibility / 1000)} km</span>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">5-Day Forecast</h4>
            <div className="space-y-3">
              {forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(day.condition)}
                    <div>
                      <p className="font-medium">
                        {index === 0 ? 'Today' : day.date.toLocaleDateString('en', { weekday: 'short' })}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{day.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{day.temp}°C</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Farming Tips */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
        <h4 className="font-semibold text-green-800 mb-2">🌱 Weather-Based Farming Tips</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Current weather is perfect for sowing wheat. Soil moisture is optimal.</li>
          <li>• Reduce watering frequency due to expected rainfall in next 2 days.</li>
          <li>• Avoid pesticide spraying today due to high wind speed.</li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherWidget;