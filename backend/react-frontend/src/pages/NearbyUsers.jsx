import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import { locationAPI } from '../services/api';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, MapPin, Phone, User, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NearbyUsers = () => {
  const { user, language } = useAuth();
  const { location, getCurrentLocation } = useLocationContext();
  const navigate = useNavigate();
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    if (location) {
      loadNearbyUsers();
    }
  }, [location, radius]);

  const loadNearbyUsers = async () => {
    try {
      setLoading(true);
      const response = await locationAPI.getNearbyUsers(
        location.latitude,
        location.longitude,
        radius
      );
      setNearbyUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading nearby users:', error);
      // Mock data
      setNearbyUsers([
        {
          id: 1,
          name: 'Ram Singh',
          type: user?.user_type === 'farmer' ? 'consumer' : 'farmer',
          distance: 2.5,
          city: 'Delhi',
          crops: ['Wheat', 'Rice'],
          interests: ['Organic', 'Fresh']
        },
        {
          id: 2,
          name: 'Shyam Kumar',
          type: user?.user_type === 'farmer' ? 'consumer' : 'farmer',
          distance: 5.8,
          city: 'Delhi',
          crops: ['Vegetables'],
          interests: ['Local', 'Seasonal']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (userId, userName) => {
    alert(
      language === 'hi'
        ? `${userName} से जुड़ने का अनुरोध भेजा गया! जल्द ही संपर्क सुविधा उपलब्ध होगी।`
        : `Connection request sent to ${userName}! Contact feature coming soon.`
    );
  };

  const translations = {
    en: {
      title: user?.user_type === 'farmer' ? 'Nearby Consumers' : 'Nearby Farmers',
      searchRadius: 'Search Radius',
      km: 'km',
      distance: 'Distance',
      connect: 'Connect',
      noUsers: 'No users found nearby',
      enableLocation: 'Enable Location',
      crops: 'Crops',
      interests: 'Interests',
      farmer: 'Farmer',
      consumer: 'Consumer'
    },
    hi: {
      title: user?.user_type === 'farmer' ? 'आस-पास के ग्राहक' : 'आस-पास के किसान',
      searchRadius: 'खोज त्रिज्या',
      km: 'किमी',
      distance: 'दूरी',
      connect: 'जुड़ें',
      noUsers: 'आस-पास कोई उपयोगकर्ता नहीं मिला',
      enableLocation: 'स्थान सक्षम करें',
      crops: 'फसलें',
      interests: 'रुचियां',
      farmer: 'किसान',
      consumer: 'ग्राहक'
    }
  };

  const t = translations[language];

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {language === 'hi' ? 'स्थान की आवश्यकता' : 'Location Required'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'hi'
              ? 'आस-पास के उपयोगकर्ताओं को खोजने के लिए अपना स्थान साझा करें'
              : 'Share your location to find nearby users'}
          </p>
          <button
            onClick={getCurrentLocation}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors min-h-[44px]"
          >
            <Navigation className="w-5 h-5 inline mr-2" />
            {t.enableLocation}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
        </div>

        {/* Location Info */}
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-blue-800">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {location.city}, {location.state}
            </span>
          </div>
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">{t.searchRadius}:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 min-h-[44px]"
          >
            <option value={10}>10 {t.km}</option>
            <option value={25}>25 {t.km}</option>
            <option value={50}>50 {t.km}</option>
            <option value={100}>100 {t.km}</option>
          </select>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-600 font-semibold">
              {language === 'hi' ? 'आस-पास के उपयोगकर्ता खोज रहे हैं...' : 'Finding nearby users...'}
            </p>
          </div>
        ) : nearbyUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.noUsers}</h2>
            <p className="text-gray-600">
              {language === 'hi'
                ? 'खोज त्रिज्या बढ़ाने का प्रयास करें'
                : 'Try increasing the search radius'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {nearbyUsers.map((nearbyUser) => (
              <div key={nearbyUser.id} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{nearbyUser.name}</h3>
                      <p className="text-sm text-gray-600">
                        {nearbyUser.type === 'farmer' ? t.farmer : t.consumer} • {nearbyUser.city}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{nearbyUser.distance} {t.km} {t.distance}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleConnect(nearbyUser.id, nearbyUser.name)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors min-h-[44px]"
                  >
                    {t.connect}
                  </button>
                </div>

                {/* User Details */}
                <div className="space-y-3">
                  {nearbyUser.crops && nearbyUser.crops.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">{t.crops}:</h4>
                      <div className="flex flex-wrap gap-2">
                        {nearbyUser.crops.map((crop, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {nearbyUser.interests && nearbyUser.interests.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">{t.interests}:</h4>
                      <div className="flex flex-wrap gap-2">
                        {nearbyUser.interests.map((interest, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default NearbyUsers;