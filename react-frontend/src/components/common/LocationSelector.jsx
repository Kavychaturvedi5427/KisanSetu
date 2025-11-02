import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocationContext } from '../../contexts/LocationContext';
import { INDIAN_CITIES } from '../../utils/locationUtils';
import { MapPin, Check, X } from 'lucide-react';

const LocationSelector = ({ isOpen, onClose }) => {
  const { language } = useAuth();
  const { updateLocation } = useLocationContext();
  const [selectedCity, setSelectedCity] = useState('');

  const translations = {
    en: {
      title: 'Select Your Location',
      subtitle: 'Choose your city for personalized experience',
      searchPlaceholder: 'Search city...',
      confirm: 'Confirm Location',
      cancel: 'Cancel'
    },
    hi: {
      title: 'अपना स्थान चुनें',
      subtitle: 'व्यक्तिगत अनुभव के लिए अपना शहर चुनें',
      searchPlaceholder: 'शहर खोजें...',
      confirm: 'स्थान पुष्टि करें',
      cancel: 'रद्द करें'
    }
  };

  const t = translations[language];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleConfirm = () => {
    if (selectedCity) {
      const locationData = {
        latitude: selectedCity.lat,
        longitude: selectedCity.lng,
        city: selectedCity.city,
        state: selectedCity.state,
        country: 'India',
        pincode: selectedCity.pincode,
        district: selectedCity.state
      };
      updateLocation(locationData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              // Filter cities based on search - implementation can be added here
            }}
          />
        </div>

        <div className="max-h-60 overflow-y-auto mb-4">
          <div className="space-y-2">
            {INDIAN_CITIES.map((city, index) => (
              <button
                key={index}
                onClick={() => handleCitySelect(city)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedCity?.city === city.city
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-800">{city.city}</div>
                      <div className="text-sm text-gray-600">{city.state} - {city.pincode}</div>
                    </div>
                  </div>
                  {selectedCity?.city === city.city && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCity}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;