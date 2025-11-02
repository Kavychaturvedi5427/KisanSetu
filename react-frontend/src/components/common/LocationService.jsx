import { useEffect } from 'react';
import { useLocationContext } from '../../contexts/LocationContext';

const LocationService = ({ onLocationUpdate }) => {
  const { location, updateLocation } = useLocationContext();

  useEffect(() => {
    // Check if geolocation is available and user hasn't set location manually
    if (navigator.geolocation && !localStorage.getItem('kisanSetuLocationManual')) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          // For now, we'll just update with default location
          const newLocation = {
            city: 'Delhi',
            state: 'Delhi', 
            country: 'India',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          updateLocation(newLocation);
          if (onLocationUpdate) onLocationUpdate();
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Use default location if geolocation fails
          if (!location) {
            const defaultLocation = {
              city: 'Delhi',
              state: 'Delhi',
              country: 'India'
            };
            updateLocation(defaultLocation);
            if (onLocationUpdate) onLocationUpdate();
          }
        }
      );
    }
  }, [location, updateLocation, onLocationUpdate]);

  // This component doesn't render anything
  return null;
};

export default LocationService;