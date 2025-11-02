import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocationContext } from '../../contexts/LocationContext';
import LocationSelector from './LocationSelector';
import { MapPin, X, RefreshCw, Edit } from 'lucide-react';

const LocationBanner = () => {
  const { language } = useAuth();
  const { location, getCurrentLocation, loading } = useLocationContext();
  const [dismissed, setDismissed] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const translations = {
    en: {
      enableLocation: 'Enable location for personalized experience',
      currentLocation: 'Current location',
      refresh: 'Update location',
      dismiss: 'Dismiss',
      change: 'Change location'
    },
    hi: {
      enableLocation: 'व्यक्तिगत अनुभव के लिए स्थान सक्षम करें',
      currentLocation: 'वर्तमान स्थान',
      refresh: 'स्थान अपडेट करें',
      dismiss: 'बंद करें',
      change: 'स्थान बदलें'
    }
  };

  const t = translations[language];

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {location ? (
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {t.currentLocation}: {location.city}, {location.state}
                </p>
                <p className="text-xs opacity-90">
                  {language === 'hi' ? `जिला: ${location.district || location.city} | पिन: ${location.pincode || '000000'}` : `District: ${location.district || location.city} | PIN: ${location.pincode || '000000'}`}
                </p>
              </div>
            ) : (
              <p className="text-sm sm:text-base">{t.enableLocation}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSelector(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t.change}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <LocationSelector 
        isOpen={showSelector} 
        onClose={() => setShowSelector(false)} 
      />
    </div>
  );
};

export default LocationBanner;