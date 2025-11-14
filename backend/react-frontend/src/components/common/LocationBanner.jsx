import { useState, useEffect } from 'react';
import { useLocationContext } from '../../contexts/LocationContext';
import { MapPin } from 'lucide-react';

const LocationBanner = () => {
  const { location } = useLocationContext();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !location) return null;

  return (
    <div className="bg-green-600 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <MapPin className="w-4 h-4" />
        <span>Your location: {location.city}, {location.state}</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default LocationBanner;