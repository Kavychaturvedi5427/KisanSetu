import { useState, useEffect } from 'react';
import { getLocationFromIP } from '../utils/locationUtils';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('kisanSetuLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed.city && parsed.city !== 'Unknown' && parsed.state && parsed.state !== 'Unknown') {
          setLocation(parsed);
          return;
        }
      } catch (error) {
        console.error('Invalid saved location');
      }
    }
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    
    try {
      const locationData = await getLocationFromIP();
      setLocation(locationData);
      localStorage.setItem('kisanSetuLocation', JSON.stringify(locationData));
      return locationData;
    } catch (err) {
      const fallbackLocation = {
        latitude: 28.6139,
        longitude: 77.2090,
        city: 'Delhi',
        state: 'Delhi',
        country: 'India'
      };
      setLocation(fallbackLocation);
      localStorage.setItem('kisanSetuLocation', JSON.stringify(fallbackLocation));
      return fallbackLocation;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    getCurrentLocation,
    hasLocation: !!location
  };
};

export default useLocation;