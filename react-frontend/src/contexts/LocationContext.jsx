import { createContext, useContext, useState, useEffect } from 'react';
import { getLocationFromIP } from '../utils/locationUtils';

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
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
        console.error('Invalid saved location:', error);
      }
    }
    // Auto-detect location
    getCurrentLocation();
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('kisanSetuLocation', JSON.stringify(newLocation));
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const locationData = await getLocationFromIP();
      updateLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Location detection failed:', error);
      // Final fallback
      const defaultLocation = {
        latitude: 28.6139,
        longitude: 77.2090,
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110001',
        district: 'Delhi'
      };
      updateLocation(defaultLocation);
      return defaultLocation;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{
      location,
      loading,
      updateLocation,
      getCurrentLocation,
      hasLocation: !!location
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;