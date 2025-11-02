import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocationContext } from '../../contexts/LocationContext';
import { MapPin, X, Check } from 'lucide-react';

const LocationService = ({ onLocationUpdate }) => {
  const { language } = useAuth();
  const { location, getCurrentLocation, loading } = useLocationContext();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const locationEnabled = localStorage.getItem('kisanSetuLocationEnabled');
    if (!locationEnabled && !location) {
      setTimeout(() => setShowPrompt(true), 2000);
    } else if (locationEnabled === 'true' && !location) {
      getCurrentLocation();
    }
  }, [location]);



  const handleEnable = async () => {
    localStorage.setItem('kisanSetuLocationEnabled', 'true');
    setShowPrompt(false);
    const newLocation = await getCurrentLocation();
    onLocationUpdate?.(newLocation);
  };

  const handleDeny = () => {
    localStorage.setItem('kisanSetuLocationEnabled', 'false');
    setShowPrompt(false);
  };

  const translations = {
    en: {
      title: 'Enable Location Services',
      description: 'Get personalized weather, nearby farmers/consumers, and local market prices based on your location.',
      benefits: [
        '🌤️ Local weather updates',
        '👥 Find nearby users within 50km', 
        '💰 Regional market prices',
        '🚚 Accurate delivery estimates',
        '🏪 Local farmer products',
        '📍 State-specific crop info'
      ],
      enable: 'Enable Location',
      deny: 'Maybe Later',
      detecting: 'Detecting location...'
    },
    hi: {
      title: 'स्थान सेवा सक्षम करें',
      description: 'अपने स्थान के आधार पर व्यक्तिगत मौसम, आस-पास के किसान/उपभोक्ता, और स्थानीय बाजार भाव प्राप्त करें।',
      benefits: [
        '🌤️ स्थानीय मौसम अपडेट',
        '👥 50 किमी के भीतर उपयोगकर्ता खोजें',
        '💰 क्षेत्रीय बाजार भाव', 
        '🚚 सटीक डिलीवरी अनुमान',
        '🏪 स्थानीय किसान उत्पाद',
        '📍 राज्य-विशिष्ट फसल जानकारी'
      ],
      enable: 'स्थान सक्षम करें',
      deny: 'बाद में',
      detecting: 'स्थान खोज रहे हैं...'
    }
  };

  const t = translations[language];

  if (!showPrompt && !loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t.title}</h2>
          <p className="text-gray-600 text-sm">{t.description}</p>
        </div>

        <div className="space-y-3 mb-6">
          {t.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">{t.detecting}</p>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDeny}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t.deny}
            </button>
            <button
              onClick={handleEnable}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.enable}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationService;